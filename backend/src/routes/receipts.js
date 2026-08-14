'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { UPLOAD_DIR } = require('../upload');

const router = express.Router();

// Receipts are NEVER served from a public static mount. Access is authorised
// per-file: the owner may see any receipt; a limited user may see only the
// receipt attached to an expenditure they own.
router.get('/receipts/:id', requireAuth, (req, res) => {
  const exp = db
    .prepare('SELECT professional_id, receipt_path FROM expenditures WHERE id = ?')
    .get(req.params.id);

  if (!exp || !exp.receipt_path) {
    return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Receipt not found.' });
  }

  const isOwner = req.currentUser.role === 'owner';
  const ownsIt =
    req.currentUser.role === 'limited' &&
    req.currentUser.professional_id === exp.professional_id;

  if (!isOwner && !ownsIt) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      status: 403,
      message: 'You are not allowed to view this receipt.',
    });
  }

  // Guard against path traversal: only serve the basename from within UPLOAD_DIR.
  const filename = path.basename(exp.receipt_path);
  const fullPath = path.join(UPLOAD_DIR, filename);
  if (!fullPath.startsWith(UPLOAD_DIR) || !fs.existsSync(fullPath)) {
    return res.status(404).render('error', { title: 'Not found', status: 404, message: 'Receipt file is missing.' });
  }

  res.sendFile(fullPath);
});

module.exports = router;
