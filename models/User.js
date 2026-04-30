const bcrypt = require('bcryptjs');
const { users } = require('../config/database');

let nextId = 1;

function findByUsername(username) {
  return users.find(u => u.username === username) || null;
}

function findById(id) {
  return users.find(u => u.id === id) || null;
}

async function create(username, password) {
  if (findByUsername(username)) {
    throw new Error('Username already taken');
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: nextId++, username, password: hashed };
  users.push(user);
  return user;
}

function verifyPassword(user, plainText) {
  return bcrypt.compare(plainText, user.password);
}

module.exports = { findByUsername, findById, create, verifyPassword };
