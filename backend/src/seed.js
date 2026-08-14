'use strict';

// Idempotent owner-account seeder.
// Reads OWNER_USERNAME / OWNER_EMAIL / OWNER_PASSWORD from the environment
// and upserts a single owner user (password bcrypt-hashed).
// Run with: npm run seed

require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./db');

function seed() {
  const username = process.env.OWNER_USERNAME;
  const email = process.env.OWNER_EMAIL || null;
  const password = process.env.OWNER_PASSWORD;

  if (!username || !password) {
    console.error(
      '[seed] Missing required env vars. Set OWNER_USERNAME and OWNER_PASSWORD (OWNER_EMAIL optional).'
    );
    process.exit(1);
  }

  const password_hash = bcrypt.hashSync(password, 12);
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

  if (existing) {
    db.prepare(
      "UPDATE users SET email = ?, password_hash = ?, role = 'owner' WHERE id = ?"
    ).run(email, password_hash, existing.id);
    console.log(`[seed] Owner account "${username}" already existed — updated password/email. (id=${existing.id})`);
  } else {
    const info = db
      .prepare(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'owner')"
      )
      .run(username, email, password_hash);
    console.log(`[seed] Created owner account "${username}". (id=${info.lastInsertRowid})`);
  }

  console.log('[seed] Done. You can now log in at /login with these owner credentials.');
}

seed();
