'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireOwner } = require('../middleware/auth');
const { upload } = require('../upload');

const router = express.Router();

// Every route in this router is owner-only. requireAuth already ran globally.
router.use(requireOwner);

// ---- helpers ---------------------------------------------------------------

function projectFinancials(project) {
  const spent = db
    .prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM expenditures WHERE project_id = ?')
    .get(project.id).total;
  const cost = project.cost_to_company || 0;
  const quote = project.quote_to_client || 0;
  const commission = project.commission_to_company || 0;
  // Margin = what the client pays minus company cost minus everything spent on the job.
  const margin = quote - cost - spent;
  return { spent, cost, quote, commission, margin };
}

// ---- dashboard: projects list with financial summary -----------------------

router.get('/dashboard', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC, id DESC').all();
  const rows = projects.map((p) => ({ ...p, ...projectFinancials(p) }));
  const totals = rows.reduce(
    (acc, r) => {
      acc.quote += r.quote;
      acc.cost += r.cost;
      acc.spent += r.spent;
      acc.commission += r.commission;
      acc.margin += r.margin;
      return acc;
    },
    { quote: 0, cost: 0, spent: 0, commission: 0, margin: 0 }
  );
  res.render('owner/dashboard', { title: 'Owner dashboard', projects: rows, totals });
});

// ---- projects CRUD ---------------------------------------------------------

router.get('/projects/new', (req, res) => {
  res.render('owner/project_form', { title: 'New project', project: null, error: null });
});

router.post('/projects', (req, res) => {
  const b = req.body;
  if (!b.name || !b.name.trim()) {
    return res.status(400).render('owner/project_form', {
      title: 'New project',
      project: null,
      error: 'Project name is required.',
    });
  }
  const info = db
    .prepare(
      `INSERT INTO projects
        (name, client, work_type, status, start_date, end_date, notes,
         cost_to_company, quote_to_client, commission_to_company)
       VALUES (@name, @client, @work_type, @status, @start_date, @end_date, @notes,
               @cost_to_company, @quote_to_client, @commission_to_company)`
    )
    .run({
      name: b.name.trim(),
      client: b.client || null,
      work_type: b.work_type || null,
      status: b.status || null,
      start_date: b.start_date || null,
      end_date: b.end_date || null,
      notes: b.notes || null,
      cost_to_company: Number(b.cost_to_company) || 0,
      quote_to_client: Number(b.quote_to_client) || 0,
      commission_to_company: Number(b.commission_to_company) || 0,
    });
  res.redirect(`/projects/${info.lastInsertRowid}`);
});

router.get('/projects/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Project not found.' });

  const fin = projectFinancials(project);
  const assigned = db
    .prepare(
      `SELECT p.*, a.id AS assignment_id
         FROM assignments a
         JOIN professionals p ON p.id = a.professional_id
        WHERE a.project_id = ?
        ORDER BY p.name`
    )
    .all(project.id);

  const expenditures = db
    .prepare(
      `SELECT e.*, p.name AS professional_name
         FROM expenditures e
         JOIN professionals p ON p.id = e.professional_id
        WHERE e.project_id = ?
        ORDER BY e.created_at DESC, e.id DESC`
    )
    .all(project.id);

  // Professionals not yet assigned to this project (for the assign dropdown).
  const unassigned = db
    .prepare(
      `SELECT * FROM professionals
        WHERE id NOT IN (SELECT professional_id FROM assignments WHERE project_id = ?)
        ORDER BY name`
    )
    .all(project.id);

  res.render('owner/project_detail', {
    title: project.name,
    project,
    fin,
    assigned,
    expenditures,
    unassigned,
  });
});

router.post('/projects/:id', (req, res) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Project not found.' });
  const b = req.body;
  db.prepare(
    `UPDATE projects SET
        name = @name, client = @client, work_type = @work_type, status = @status,
        start_date = @start_date, end_date = @end_date, notes = @notes,
        cost_to_company = @cost_to_company, quote_to_client = @quote_to_client,
        commission_to_company = @commission_to_company
      WHERE id = @id`
  ).run({
    id: project.id,
    name: (b.name || '').trim() || 'Untitled project',
    client: b.client || null,
    work_type: b.work_type || null,
    status: b.status || null,
    start_date: b.start_date || null,
    end_date: b.end_date || null,
    notes: b.notes || null,
    cost_to_company: Number(b.cost_to_company) || 0,
    quote_to_client: Number(b.quote_to_client) || 0,
    commission_to_company: Number(b.commission_to_company) || 0,
  });
  res.redirect(`/projects/${project.id}`);
});

router.get('/projects/:id/edit', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Project not found.' });
  res.render('owner/project_form', { title: `Edit: ${project.name}`, project, error: null });
});

router.post('/projects/:id/delete', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.redirect('/dashboard');
});

// ---- assignments -----------------------------------------------------------

router.post('/projects/:id/assign', (req, res) => {
  const projectId = Number(req.params.id);
  const professionalId = Number(req.body.professional_id);
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  const prof = db.prepare('SELECT id FROM professionals WHERE id = ?').get(professionalId);
  if (project && prof) {
    db.prepare(
      'INSERT OR IGNORE INTO assignments (project_id, professional_id) VALUES (?, ?)'
    ).run(projectId, professionalId);
  }
  res.redirect(`/projects/${projectId}`);
});

router.post('/assignments/:id/delete', (req, res) => {
  const a = db.prepare('SELECT project_id FROM assignments WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM assignments WHERE id = ?').run(req.params.id);
  res.redirect(a ? `/projects/${a.project_id}` : '/dashboard');
});

// ---- expenditures (owner can add/delete on any project) --------------------

router.post('/projects/:id/expenditures', upload.single('receipt'), (req, res) => {
  const projectId = Number(req.params.id);
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  if (!project) return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Project not found.' });

  const professionalId = Number(req.body.professional_id);
  const category = req.body.category;
  const validCategory = ['labour', 'inventory', 'expenditure'].includes(category);
  const prof = db.prepare('SELECT id FROM professionals WHERE id = ?').get(professionalId);

  if (!prof || !validCategory) {
    return res.status(400).render('error', {
      title: 'Invalid',
      status: 400,
      message: 'A valid professional and category are required for an expenditure.',
    });
  }

  const receiptPath = req.file ? `uploads/${req.file.filename}` : null;
  db.prepare(
    `INSERT INTO expenditures
       (project_id, professional_id, description, category, amount, receipt_path)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(projectId, professionalId, req.body.description || null, category, Number(req.body.amount) || 0, receiptPath);

  res.redirect(`/projects/${projectId}`);
});

router.post('/expenditures/:id/delete', (req, res) => {
  const e = db.prepare('SELECT project_id FROM expenditures WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM expenditures WHERE id = ?').run(req.params.id);
  res.redirect(e ? `/projects/${e.project_id}` : '/dashboard');
});

// ---- professionals CRUD ----------------------------------------------------

router.get('/professionals', (req, res) => {
  const professionals = db.prepare('SELECT * FROM professionals ORDER BY name').all();
  res.render('owner/professionals', { title: 'Professionals', professionals, error: null });
});

router.post('/professionals', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    const professionals = db.prepare('SELECT * FROM professionals ORDER BY name').all();
    return res.status(400).render('owner/professionals', {
      title: 'Professionals',
      professionals,
      error: 'Name is required.',
    });
  }
  db.prepare('INSERT INTO professionals (name, trade, certifications) VALUES (?, ?, ?)').run(
    name,
    req.body.trade || null,
    req.body.certifications || null
  );
  res.redirect('/professionals');
});

router.post('/professionals/:id', (req, res) => {
  const prof = db.prepare('SELECT id FROM professionals WHERE id = ?').get(req.params.id);
  if (prof) {
    db.prepare(
      'UPDATE professionals SET name = ?, trade = ?, certifications = ? WHERE id = ?'
    ).run((req.body.name || '').trim() || 'Unnamed', req.body.trade || null, req.body.certifications || null, prof.id);
  }
  res.redirect('/professionals');
});

router.post('/professionals/:id/delete', (req, res) => {
  db.prepare('DELETE FROM professionals WHERE id = ?').run(req.params.id);
  res.redirect('/professionals');
});

// ---- users CRUD (create limited users, link to a professional) -------------

router.get('/users', (req, res) => {
  const users = db
    .prepare(
      `SELECT u.id, u.username, u.email, u.role, u.professional_id, u.created_at,
              p.name AS professional_name
         FROM users u
         LEFT JOIN professionals p ON p.id = u.professional_id
        ORDER BY u.role, u.username`
    )
    .all();
  const professionals = db.prepare('SELECT * FROM professionals ORDER BY name').all();
  res.render('owner/users', { title: 'Users', users, professionals, error: null });
});

function renderUsersError(res, status, message) {
  const users = db
    .prepare(
      `SELECT u.id, u.username, u.email, u.role, u.professional_id, u.created_at,
              p.name AS professional_name
         FROM users u LEFT JOIN professionals p ON p.id = u.professional_id
        ORDER BY u.role, u.username`
    )
    .all();
  const professionals = db.prepare('SELECT * FROM professionals ORDER BY name').all();
  return res.status(status).render('owner/users', { title: 'Users', users, professionals, error: message });
}

router.post('/users', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';
  const role = req.body.role === 'owner' ? 'owner' : 'limited';
  const email = req.body.email || null;
  let professionalId = req.body.professional_id ? Number(req.body.professional_id) : null;

  if (!username || !password) {
    return renderUsersError(res, 400, 'Username and password are required.');
  }
  if (password.length < 8) {
    return renderUsersError(res, 400, 'Password must be at least 8 characters.');
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return renderUsersError(res, 400, `Username "${username}" is already taken.`);
  }
  // Limited users must be linked to a professional to be useful.
  if (role === 'limited') {
    if (!professionalId) {
      return renderUsersError(res, 400, 'Limited users must be linked to a professional.');
    }
    const prof = db.prepare('SELECT id FROM professionals WHERE id = ?').get(professionalId);
    if (!prof) return renderUsersError(res, 400, 'Selected professional does not exist.');
  } else {
    professionalId = null; // owners are never linked to a professional record
  }

  const password_hash = bcrypt.hashSync(password, 12);
  db.prepare(
    'INSERT INTO users (username, email, password_hash, role, professional_id) VALUES (?, ?, ?, ?, ?)'
  ).run(username, email, password_hash, role, professionalId);
  res.redirect('/users');
});

router.post('/users/:id/password', (req, res) => {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  const password = req.body.password || '';
  if (!user) return renderUsersError(res, 404, 'User not found.');
  if (password.length < 8) return renderUsersError(res, 400, 'Password must be at least 8 characters.');
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 12), user.id);
  res.redirect('/users');
});

router.post('/users/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  // Never let the owner delete their own currently-logged-in account, and never
  // delete the last remaining owner (would lock everyone out).
  if (id === req.currentUser.id) {
    return renderUsersError(res, 400, 'You cannot delete your own account while logged in.');
  }
  const target = db.prepare('SELECT role FROM users WHERE id = ?').get(id);
  if (target && target.role === 'owner') {
    const owners = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'owner'").get().n;
    if (owners <= 1) {
      return renderUsersError(res, 400, 'Cannot delete the last owner account.');
    }
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.redirect('/users');
});

module.exports = router;
