const users = [];
let nextUserId = 1;

class User {
	static create({ username, password }) {
		const existing = this.findByUsername(username);
		if (existing) {
			return null;
		}

		const user = {
			id: nextUserId++,
			username,
			password
		};

		users.push(user);
		return { ...user, password: undefined };
	}

	static findByUsername(username) {
		return users.find((user) => user.username === username);
	}

	static findById(id) {
		const user = users.find((item) => item.id === Number(id));
		if (!user) {
			return null;
		}

		return { ...user, password: undefined };
	}

	static validateCredentials(username, password) {
		const user = users.find(
			(item) => item.username === username && item.password === password
		);

		if (!user) {
			return null;
		}

		return { ...user, password: undefined };
	}
}

module.exports = User;
