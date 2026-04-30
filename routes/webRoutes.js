const express = require('express');
const router = express.Router();
const csrf = require('../middleware/csrfProtection');
const sessionAuth = require('../middleware/sessionAuth');
const AuthController = require('../controllers/AuthController');

router.get('/', (req, res) => res.redirect('/login'));

router.get('/register', csrf, AuthController.showRegister);
router.post('/register', csrf, AuthController.register);

router.get('/login', csrf, AuthController.showLogin);
router.post('/login', csrf, AuthController.login);

router.get('/logout', AuthController.logout);

router.get('/dashboard', sessionAuth, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});

router.get('/records', sessionAuth, csrf, (req, res) => {
  res.render('records', { username: req.session.username, csrfToken: req.csrfToken() });
});

module.exports = router;
