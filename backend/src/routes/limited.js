'use strict';

const express = require('express');
const db = require('../db');
const { requireLimited } = require('../middleware/auth');
const { upload } = require('../upload');

const router = express.Router();

// Everything here is for limited users linked to a professional record.
router.use(requireLimited);

// Is this professional actually assigned to this project?
function isAssigned(projectId, professionalId) {
  const row = db
    .prepare('SELECT 1 FROM assignments WHERE project_id = ? AND professional_id = ?')
    .get(projectId, professionalId);
  return !!row;
}

// ---- limited dashboard: only assigned projects, NO financials --------------

router.get('/', (req, res) => {
  const profId = req.currentUser.professional_id;
  const projects = db
    .prepare(
      `SELECT p.id, p.name, p.work_type, p.status, p.start_date, p.end_date
         FROM projects p
         JOIN assignments a ON a.project_id = p.id
        WHERE a.professional_id = ?
        ORDER BY p.created_at DESC, p.id DESC`
    )
    .all(profId);
  res.render('limited/dashboard', { title: 'My projects', projects });
});

// ---- limited project view: work info + own expenditures + add form ---------

router.get('/projects/:id', (req, res) => {
  const profId = req.currentUser.professional_id;
  const projectId = Number(req.params.id);

  if (!isAssigned(projectId, profId)) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      status: 403,
      message: 'You are not assigned to this project.',
    });
  }

  // Deliberately select only non-financial columns — never cost/quote/commission.
  const project = db
    .prepare('SELECT id, name, work_type, status, start_date, end_date FROM projects WHERE id = ?')
    .get(projectId);
  if (!project) {
    return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Project not found.' });
  }

  // Only this professional's own expenditures.
  const expenditures = db
    .prepare(
      `SELECT id, description, category, amount, receipt_path, created_at
         FROM expenditures
        WHERE project_id = ? AND professional_id = ?
        ORDER BY created_at DESC, id DESC`
    )
    .all(projectId, profId);

  const myTotal = expenditures.reduce((sum, e) => sum + (e.amount || 0), 0);

  res.render('limited/project_detail', { title: project.name, project, expenditures, myTotal });
});

// ---- add an expenditure (own, on an assigned project only) -----------------

router.post('/projects/:id/expenditures', upload.single('receipt'), (req, res) => {
  const profId = req.currentUser.professional_id;
  const projectId = Number(req.params.id);

  // Hard 403 if the limited user is not assigned to this project.
  if (!isAssigned(projectId, profId)) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      status: 403,
      message: 'You cannot add costs to a project you are not assigned to.',
    });
  }

  const category = req.body.category;
  if (!['labour', 'inventory', 'expenditure'].includes(category)) {
    return res.status(400).render('error', {
      title: 'Invalid',
      status: 400,
      message: 'Please choose a valid category (labour, inventory or expenditure).',
    });
  }

  const receiptPath = req.file ? `uploads/${req.file.filename}` : null;
  // professional_id is forced to the session user's own linked professional —
  // never taken from the request body — so a limited user can only file for self.
  db.prepare(
    `INSERT INTO expenditures
       (project_id, professional_id, description, category, amount, receipt_path)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(projectId, profId, req.body.description || null, category, Number(req.body.amount) || 0, receiptPath);

  res.redirect(`/my/projects/${projectId}`);
});

// ---- delete own expenditure ------------------------------------------------

router.post('/expenditures/:id/delete', (req, res) => {
  const profId = req.currentUser.professional_id;
  const exp = db
    .prepare('SELECT id, project_id, professional_id FROM expenditures WHERE id = ?')
    .get(req.params.id);

  // Only allow deleting a row this professional owns.
  if (!exp || exp.professional_id !== profId) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      status: 403,
      message: 'You can only remove your own entries.',
    });
  }
  db.prepare('DELETE FROM expenditures WHERE id = ?').run(exp.id);
  res.redirect(`/my/projects/${exp.project_id}`);
});

module.exports = router;
