'use strict';

const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Uploads live under backend/uploads (or a persistent-disk-backed path in prod).
// We store a RELATIVE path (e.g. "uploads/162736-receipt.pdf") in the DB and
// serve files only through an authorised route — never via a public static mount.
const BACKEND_ROOT = path.join(__dirname, '..');
const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(BACKEND_ROOT, process.env.UPLOAD_DIR)
  : path.join(BACKEND_ROOT, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(new Error('Only image or PDF receipts are allowed.'));
  },
});

module.exports = { upload, UPLOAD_DIR, BACKEND_ROOT };
