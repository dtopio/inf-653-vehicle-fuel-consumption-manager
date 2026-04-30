const records = [];
let nextRecordId = 1;

class FuelRecord {
	static create({ userId, date, vehicleType, liters, distance, totalCost }) {
		const litersValue = Number(liters);
		const distanceValue = Number(distance);
		const totalCostValue = Number(totalCost);

		const record = {
			id: nextRecordId++,
			userId: Number(userId),
			date,
			vehicleType,
			liters: litersValue,
			distance: distanceValue,
			totalCost: totalCostValue
		};

		records.push(record);
		return { ...record };
	}

	static findByUserId(userId) {
		return records
			.filter((record) => record.userId === Number(userId))
			.map((record) => ({ ...record }));
	}
}

module.exports = FuelRecord;
