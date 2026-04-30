const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
	static showLogin(req, res) {
		res.render('login', {
			title: 'Login',
			csrfToken: req.csrfToken(),
			error: null
		});
	}

	static showRegister(req, res) {
		res.render('register', {
			title: 'Register',
			csrfToken: req.csrfToken(),
			error: null
		});
	}

	static registerWeb(req, res) {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).render('register', {
				title: 'Register',
				csrfToken: req.csrfToken(),
				error: 'Username and password are required.'
			});
		}

		const user = User.create({ username, password });
		if (!user) {
			return res.status(400).render('register', {
				title: 'Register',
				csrfToken: req.csrfToken(),
				error: 'Username already exists.'
			});
		}

		req.session.userId = user.id;
		req.session.username = user.username;
		return res.redirect('/dashboard');
	}

	static loginWeb(req, res) {
		const { username, password } = req.body;
		const user = User.validateCredentials(username, password);
		if (!user) {
			return res.status(401).render('login', {
				title: 'Login',
				csrfToken: req.csrfToken(),
				error: 'Invalid username or password.'
			});
		}

		req.session.userId = user.id;
		req.session.username = user.username;
		return res.redirect('/dashboard');
	}

	static loginApi(req, res) {
		const { username, password } = req.body;
		const user = User.validateCredentials(username, password);

		if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			process.env.JWT_SECRET || 'default-jwt-secret',
			{ expiresIn: '1h' }
		);

		return res.json({ token });
	}

	static logoutWeb(req, res) {
		req.session.destroy(() => {
			res.redirect('/login');
		});
	}
}

module.exports = AuthController;
