const { fuelRecords } = require('../config/database');

let nextId = 1;

// Part B will fill in the real logic; these are the stubs so Part A routes don't blow up
function findAllByUser(userId) {
  return fuelRecords.filter(r => r.userId === userId);
}

function findById(id) {
  return fuelRecords.find(r => r.id === id) || null;
}

function create(data) {
  const record = { id: nextId++, ...data };
  fuelRecords.push(record);
  return record;
}

function update(id, data) {
  const idx = fuelRecords.findIndex(r => r.id === id);
  if (idx === -1) return null;
  fuelRecords[idx] = { ...fuelRecords[idx], ...data };
  return fuelRecords[idx];
}

function remove(id) {
  const idx = fuelRecords.findIndex(r => r.id === id);
  if (idx === -1) return false;
  fuelRecords.splice(idx, 1);
  return true;
}

module.exports = { findAllByUser, findById, create, update, remove };
