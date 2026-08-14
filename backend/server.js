'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const SqliteStore = require('better-sqlite3-session-store')(session);

const db = require('./src/db');
const { loadUser, requireAuth } = require('./src/middleware/auth');

const authRoutes = require('./src/routes/auth');
const ownerRoutes = require('./src/routes/owner');
const limitedRoutes = require('./src/routes/limited');
const receiptRoutes = require('./src/routes/receipts');

const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

// Behind Render's proxy we need to trust it so secure cookies work.
if (isProd) app.set('trust proxy', 1);

// ---- security headers ------------------------------------------------------
// Server-rendered, same-origin admin. Lock the CSP down to same-origin assets.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'self'"], // allow inline PDF/image receipt viewing
        frameSrc: ["'self'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  })
);

// ---- views + body parsing --------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

// Template helper: format a number as GBP for display.
app.locals.gbp = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(n) || 0);

// Static admin assets (CSS/JS) only — NOT the uploads directory.
app.use(express.static(path.join(__dirname, 'public')));

// ---- sessions --------------------------------------------------------------
if (!process.env.SESSION_SECRET && isProd) {
  console.warn('[server] WARNING: SESSION_SECRET is not set in production.');
}
app.use(
  session({
    store: new SqliteStore({
      client: db,
      // Sweep expired sessions every 15 minutes.
      expired: { clear: true, intervalMs: 15 * 60 * 1000 },
    }),
    name: 'billiano.sid',
    secret: process.env.SESSION_SECRET || 'dev-insecure-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  })
);

// Load the current user onto req/res for every request.
app.use(loadUser);

// ---- health check ----------------------------------------------------------
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ---- routes ----------------------------------------------------------------
// Public auth routes (login/logout/root redirect).
app.use('/', authRoutes);

// Everything below requires authentication.
app.use(requireAuth);

// Authorised receipt serving (owner or the owning limited user).
app.use('/', receiptRoutes);

// Limited-user area, mounted before the owner router so /my is handled here.
app.use('/my', limitedRoutes);

// Owner area (each route inside is guarded by requireOwner).
app.use('/', ownerRoutes);

// ---- 404 + error handlers --------------------------------------------------
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not found', status: 404, message: 'Page not found.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err.message);
  const status = err.status || 500;
  res.status(status).render('error', {
    title: 'Error',
    status,
    message: isProd ? 'Something went wrong.' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`[server] Billiano admin listening on http://localhost:${PORT}`);
  console.log(`[server] DB: ${db.DATABASE_PATH}`);
});

module.exports = app;
