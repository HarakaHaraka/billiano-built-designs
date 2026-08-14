'use strict';

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Resolve the database path from env, defaulting to ./data/billiano.db
// relative to the backend root (one level up from this file's dir).
const BACKEND_ROOT = path.join(__dirname, '..');
const DATABASE_PATH = process.env.DATABASE_PATH
  ? path.resolve(BACKEND_ROOT, process.env.DATABASE_PATH)
  : path.join(BACKEND_ROOT, 'data', 'billiano.db');

// Ensure the containing directory exists (Render persistent disk mount, or ./data locally).
const dbDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DATABASE_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Apply the schema at boot. Every statement is IF NOT EXISTS, so this is idempotent.
function applySchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

applySchema();

module.exports = db;
module.exports.DATABASE_PATH = DATABASE_PATH;
