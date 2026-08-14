-- Billiano Built Designs — admin database schema
-- Applied at boot if the core tables are missing (see src/db.js).
-- SQLite. Foreign keys are enforced at runtime (PRAGMA foreign_keys = ON).

CREATE TABLE IF NOT EXISTS professionals (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  trade          TEXT,
  certifications TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  username        TEXT NOT NULL UNIQUE,
  email           TEXT,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('owner','limited')),
  professional_id INTEGER REFERENCES professionals(id) ON DELETE SET NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  name                  TEXT NOT NULL,
  client                TEXT,
  work_type             TEXT,
  status                TEXT,
  start_date            TEXT,
  end_date              TEXT,
  notes                 TEXT,
  cost_to_company       REAL DEFAULT 0,
  quote_to_client       REAL DEFAULT 0,
  commission_to_company REAL DEFAULT 0,
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignments (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (project_id, professional_id)
);

CREATE TABLE IF NOT EXISTS expenditures (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN ('labour','inventory','expenditure')),
  amount          REAL NOT NULL DEFAULT 0,
  receipt_path    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_assignments_project      ON assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_professional ON assignments(professional_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_project     ON expenditures(project_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_prof        ON expenditures(professional_id);
