const FuelRecord = require('../models/FuelRecord');

class FuelRecordController {
	static showDashboard(req, res) {
		const records = FuelRecord.findByUserId(req.session.userId);
		const summary = FuelRecordController.buildSummary(records);

		return res.render('dashboard', {
			title: 'Dashboard',
			username: req.session.username,
			records,
			weeklySummary: summary.weekly,
			monthlySummary: summary.monthly,
			csrfToken: req.csrfToken()
		});
	}

	static buildSummary(records) {
		const weeklyTotals = new Map();
		const monthlyTotals = new Map();

		for (const record of records) {
			const date = new Date(record.date);
			if (Number.isNaN(date.getTime())) {
				continue;
			}

			const weekKey = FuelRecordController.getIsoWeekKey(date);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

			weeklyTotals.set(weekKey, (weeklyTotals.get(weekKey) || 0) + Number(record.totalCost));
			monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + Number(record.totalCost));
		}

		const weekly = Array.from(weeklyTotals.entries())
			.map(([period, totalCost]) => ({ period, totalCost: totalCost.toFixed(2) }))
			.sort((a, b) => b.period.localeCompare(a.period));

		const monthly = Array.from(monthlyTotals.entries())
			.map(([period, totalCost]) => ({ period, totalCost: totalCost.toFixed(2) }))
			.sort((a, b) => b.period.localeCompare(a.period));

		return { weekly, monthly };
	}

	static getIsoWeekKey(date) {
		const workingDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = workingDate.getUTCDay() || 7;
		workingDate.setUTCDate(workingDate.getUTCDate() + 4 - dayNum);

		const yearStart = new Date(Date.UTC(workingDate.getUTCFullYear(), 0, 1));
		const weekNum = Math.ceil((((workingDate - yearStart) / 86400000) + 1) / 7);

		return `${workingDate.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
	}

	static showAddRecordForm(req, res) {
		return res.render('addRecord', {
			title: 'Add Record',
			csrfToken: req.csrfToken(),
			error: null
		});
	}

	static addRecordWeb(req, res) {
		const { date, vehicleType, liters, distance, totalCost } = req.body;
		const isVehicleTypeValid = vehicleType === 'Car' || vehicleType === 'Motorcycle';

		if (!date || !isVehicleTypeValid || !liters || !distance || !totalCost) {
			return res.status(400).render('addRecord', {
				title: 'Add Record',
				csrfToken: req.csrfToken(),
				error: 'All fields are required and vehicle type must be valid.'
			});
		}

		FuelRecord.create({
			userId: req.session.userId,
			date,
			vehicleType,
			liters,
			distance,
			totalCost
		});

		return res.redirect('/dashboard');
	}

	static showEditRecordForm(req, res) {
		const record = FuelRecord.findByIdForUser(req.params.id, req.session.userId);

		if (!record) {
			return res.status(404).send('Record not found');
		}

		return res.render('editRecord', {
			title: 'Edit Record',
			record,
			csrfToken: req.csrfToken(),
			error: null
		});
	}

	static updateRecordWeb(req, res) {
		const { date, vehicleType, liters, distance, totalCost } = req.body;
		const isVehicleTypeValid = vehicleType === 'Car' || vehicleType === 'Motorcycle';
		const currentRecord = FuelRecord.findByIdForUser(req.params.id, req.session.userId);

		if (!currentRecord) {
			return res.status(404).send('Record not found');
		}

		if (!date || !isVehicleTypeValid || !liters || !distance || !totalCost) {
			return res.status(400).render('editRecord', {
				title: 'Edit Record',
				record: {
					...currentRecord,
					date,
					vehicleType,
					liters,
					distance,
					totalCost
				},
				csrfToken: req.csrfToken(),
				error: 'All fields are required and vehicle type must be valid.'
			});
		}

		FuelRecord.updateForUser(req.params.id, req.session.userId, {
			date,
			vehicleType,
			liters,
			distance,
			totalCost
		});

		return res.redirect('/dashboard');
	}

	static deleteRecordWeb(req, res) {
		FuelRecord.deleteForUser(req.params.id, req.session.userId);
		return res.redirect('/dashboard');
	}

	static getRecordsApi(req, res) {
		const records = FuelRecord.findByUserId(req.user.userId);
		return res.json(records);
	}
}

module.exports = FuelRecordController;
