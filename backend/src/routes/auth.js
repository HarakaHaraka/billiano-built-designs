'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');

const router = express.Router();

// Throttle login attempts: 10 attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

// Root: send authenticated users to their dashboard, everyone else to /login.
router.get('/', (req, res) => {
  if (req.currentUser) {
    return res.redirect(req.currentUser.role === 'owner' ? '/dashboard' : '/my');
  }
  return res.redirect('/login');
});

router.get('/login', (req, res) => {
  if (req.currentUser) {
    return res.redirect(req.currentUser.role === 'owner' ? '/dashboard' : '/my');
  }
  res.render('login', { title: 'Sign in', error: null, username: '' });
});

router.post('/login', loginLimiter, (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  const fail = () =>
    res.status(401).render('login', {
      title: 'Sign in',
      error: 'Invalid username or password.',
      username,
    });

  if (!username || !password) return fail();

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    // Run a hash compare anyway to blunt username-enumeration timing.
    bcrypt.compareSync(password, '$2a$12$0000000000000000000000000000000000000000000000000000');
    return fail();
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return fail();

  // Regenerate the session on privilege change to prevent fixation.
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).render('login', {
        title: 'Sign in',
        error: 'Something went wrong. Please try again.',
        username,
      });
    }
    req.session.userId = user.id;
    res.redirect(user.role === 'owner' ? '/dashboard' : '/my');
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('billiano.sid');
    res.redirect('/login');
  });
});

module.exports = router;
