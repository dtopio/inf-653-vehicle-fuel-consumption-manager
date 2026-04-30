const FuelRecord = require('../models/FuelRecord');

class FuelRecordController {
	static showDashboard(req, res) {
		const records = FuelRecord.findByUserId(req.session.userId);
		return res.render('dashboard', {
			title: 'Dashboard',
			username: req.session.username,
			records
		});
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

	static getRecordsApi(req, res) {
		const records = FuelRecord.findByUserId(req.user.userId);
		return res.json(records);
	}
}

module.exports = FuelRecordController;
