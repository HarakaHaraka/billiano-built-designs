'use strict';

const db = require('../db');

// Populate res.locals.currentUser (fresh from DB) for every request so views
// and downstream middleware can rely on it. Also refreshes the session copy.
function loadUser(req, res, next) {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    const user = db
      .prepare(
        'SELECT id, username, email, role, professional_id FROM users WHERE id = ?'
      )
      .get(req.session.userId);
    if (user) {
      req.currentUser = user;
      res.locals.currentUser = user;
    } else {
      // User was deleted while logged in — drop the stale session.
      req.session.destroy(() => {});
    }
  }
  next();
}

// Require any authenticated user. HTML routes redirect to /login; nothing here
// is an API, so a redirect is the correct UX.
function requireAuth(req, res, next) {
  if (req.currentUser) return next();
  return res.redirect('/login');
}

// Require the owner role. Authenticated-but-limited users get a hard 403.
function requireOwner(req, res, next) {
  if (!req.currentUser) return res.redirect('/login');
  if (req.currentUser.role !== 'owner') {
    return res.status(403).render('error', {
      title: 'Forbidden',
      status: 403,
      message: 'This area is restricted to the owner account.',
    });
  }
  return next();
}

// Require a limited user that is actually linked to a professional record.
// A limited user with no professional_id can do nothing meaningful, so guard it.
function requireLimited(req, res, next) {
  if (!req.currentUser) return res.redirect('/login');
  if (req.currentUser.role !== 'limited') {
    // Owners have their own dashboard; send them there rather than 403.
    return res.redirect('/dashboard');
  }
  if (!req.currentUser.professional_id) {
    return res.status(403).render('error', {
      title: 'Not linked',
      status: 403,
      message:
        'Your account is not linked to a professional record yet. Ask the owner to link your account.',
    });
  }
  return next();
}

module.exports = { loadUser, requireAuth, requireOwner, requireLimited };
