const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function showRegister(req, res) {
  res.render('register', { csrfToken: req.csrfToken() });
}

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('register', { error: 'Username and password are required', csrfToken: req.csrfToken() });
  }
  try {
    await User.create(username, password);
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: err.message, csrfToken: req.csrfToken() });
  }
}

async function showLogin(req, res) {
  res.render('login', { csrfToken: req.csrfToken() });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !(await User.verifyPassword(user, password))) {
    return res.render('login', { error: 'Invalid username or password', csrfToken: req.csrfToken() });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/dashboard');
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

async function apiLogin(req, res) {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !(await User.verifyPassword(user, password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
}

module.exports = { showRegister, register, showLogin, login, logout, apiLogin };
