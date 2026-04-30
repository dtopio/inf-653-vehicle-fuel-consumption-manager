const FuelRecord = require('../models/FuelRecord');

async function showAddRecord(req, res) {
  res.render('addRecord', {
    csrfToken: req.csrfToken(),
    username: req.session.username
  });
}

async function createRecord(req, res) {
  const { date, vehicleType, liters, distance, cost } = req.body;

  if (!date || !vehicleType || !liters || !distance || !cost) {
    return res.render('addRecord', {
      error: 'All fields are required',
      csrfToken: req.csrfToken(),
      username: req.session.username
    });
  }

  try {
    FuelRecord.create({
      userId: req.session.userId,
      date,
      vehicleType,
      liters: parseFloat(liters),
      distance: parseFloat(distance),
      cost: parseFloat(cost)
    });
    res.redirect('/records');
  } catch (err) {
    res.render('addRecord', {
      error: err.message,
      csrfToken: req.csrfToken(),
      username: req.session.username
    });
  }
}

async function showEditRecord(req, res) {
  const record = FuelRecord.findById(parseInt(req.params.id));

  if (!record || record.userId !== req.session.userId) {
    return res.redirect('/records');
  }

  res.render('editRecord', {
    record,
    csrfToken: req.csrfToken(),
    username: req.session.username
  });
}

async function updateRecord(req, res) {
  const recordId = parseInt(req.params.id);
  const { date, vehicleType, liters, distance, cost } = req.body;

  const record = FuelRecord.findById(recordId);
  if (!record || record.userId !== req.session.userId) {
    return res.redirect('/records');
  }

  if (!date || !vehicleType || !liters || !distance || !cost) {
    return res.render('editRecord', {
      record,
      error: 'All fields are required',
      csrfToken: req.csrfToken(),
      username: req.session.username
    });
  }

  try {
    FuelRecord.update(recordId, {
      date,
      vehicleType,
      liters: parseFloat(liters),
      distance: parseFloat(distance),
      cost: parseFloat(cost)
    });
    res.redirect('/records');
  } catch (err) {
    res.render('editRecord', {
      record,
      error: err.message,
      csrfToken: req.csrfToken(),
      username: req.session.username
    });
  }
}

async function deleteRecord(req, res) {
  const recordId = parseInt(req.params.id);
  const record = FuelRecord.findById(recordId);

  if (record && record.userId === req.session.userId) {
    FuelRecord.remove(recordId);
  }

  res.redirect('/records');
}

async function getRecords(req, res) {
  const records = FuelRecord.findAllByUser(req.session.userId);

  res.render('records', {
    records: records.map(r => ({
      ...r,
      kml: (r.distance / r.liters).toFixed(2)
    })),
    username: req.session.username,
    csrfToken: req.csrfToken()
  });
}

async function getDashboard(req, res) {
  const records = FuelRecord.findAllByUser(req.session.userId);
  const stats = calculateStatistics(records);

  res.render('dashboard', {
    username: req.session.username,
    stats
  });
}

// Calculate weekly and monthly expenditure
function calculateStatistics(records) {
  const weeklyMap = {};
  const monthlyMap = {};
  let totalCost = 0;
  let totalDistance = 0;
  let totalLiters = 0;

  records.forEach(record => {
    const date = new Date(record.date);

    // Weekly aggregation
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = { cost: 0, count: 0, weekEnd: getWeekEnd(date).toISOString().split('T')[0] };
    }
    weeklyMap[weekKey].cost += record.cost;
    weeklyMap[weekKey].count += 1;

    // Monthly aggregation
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { cost: 0, count: 0 };
    }
    monthlyMap[monthKey].cost += record.cost;
    monthlyMap[monthKey].count += 1;

    // Totals
    totalCost += record.cost;
    totalDistance += record.distance;
    totalLiters += record.liters;
  });

  const weekly = Object.entries(weeklyMap).map(([week, data]) => ({
    week,
    weekEnd: data.weekEnd,
    cost: data.cost.toFixed(2),
    records: data.count
  }));

  const monthly = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    cost: data.cost.toFixed(2),
    records: data.count
  }));

  return {
    totalRecords: records.length,
    totalCost: totalCost.toFixed(2),
    totalDistance: totalDistance.toFixed(2),
    averageKml: totalLiters > 0 ? (totalDistance / totalLiters).toFixed(2) : 0,
    weekly,
    monthly
  };
}

// Helper: Get Monday of the week
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Helper: Get Sunday of the week
function getWeekEnd(date) {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

// API endpoints
async function apiCreateRecord(req, res) {
  const { date, vehicleType, liters, distance, cost } = req.body;

  if (!date || !vehicleType || !liters || !distance || !cost) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const record = FuelRecord.create({
      userId: req.user.id,
      date,
      vehicleType,
      liters: parseFloat(liters),
      distance: parseFloat(distance),
      cost: parseFloat(cost)
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function apiGetRecords(req, res) {
  const records = FuelRecord.findAllByUser(req.user.id);
  res.json(records.map(r => ({
    ...r,
    kml: (r.distance / r.liters).toFixed(2)
  })));
}

async function apiUpdateRecord(req, res) {
  const recordId = parseInt(req.params.id);
  const { date, vehicleType, liters, distance, cost } = req.body;

  const record = FuelRecord.findById(recordId);
  if (!record || record.userId !== req.user.id) {
    return res.status(404).json({ error: 'Record not found' });
  }

  try {
    const updated = FuelRecord.update(recordId, {
      date: date || record.date,
      vehicleType: vehicleType || record.vehicleType,
      liters: liters ? parseFloat(liters) : record.liters,
      distance: distance ? parseFloat(distance) : record.distance,
      cost: cost ? parseFloat(cost) : record.cost
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function apiDeleteRecord(req, res) {
  const recordId = parseInt(req.params.id);
  const record = FuelRecord.findById(recordId);

  if (!record || record.userId !== req.user.id) {
    return res.status(404).json({ error: 'Record not found' });
  }

  FuelRecord.remove(recordId);
  res.json({ deleted: true });
}

async function apiGetStatistics(req, res) {
  const records = FuelRecord.findAllByUser(req.user.id);
  const stats = calculateStatistics(records);
  res.json(stats);
}

module.exports = {
  showAddRecord,
  createRecord,
  showEditRecord,
  updateRecord,
  deleteRecord,
  getRecords,
  getDashboard,
  apiCreateRecord,
  apiGetRecords,
  apiUpdateRecord,
  apiDeleteRecord,
  apiGetStatistics
};
