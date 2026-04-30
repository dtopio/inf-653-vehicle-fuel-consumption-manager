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
			.map((record) => ({ ...record }))
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}

	static findByIdForUser(recordId, userId) {
		const record = records.find(
			(item) => item.id === Number(recordId) && item.userId === Number(userId)
		);

		return record ? { ...record } : null;
	}

	static updateForUser(recordId, userId, { date, vehicleType, liters, distance, totalCost }) {
		const index = records.findIndex(
			(item) => item.id === Number(recordId) && item.userId === Number(userId)
		);

		if (index < 0) {
			return null;
		}

		records[index] = {
			...records[index],
			date,
			vehicleType,
			liters: Number(liters),
			distance: Number(distance),
			totalCost: Number(totalCost)
		};

		return { ...records[index] };
	}

	static deleteForUser(recordId, userId) {
		const index = records.findIndex(
			(item) => item.id === Number(recordId) && item.userId === Number(userId)
		);

		if (index < 0) {
			return false;
		}

		records.splice(index, 1);
		return true;
	}
}

module.exports = FuelRecord;
