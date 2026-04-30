const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.slice(7)
		: null;

	if (!token) {
		return res.status(401).json({ message: 'Missing Bearer token' });
	}

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET || 'default-jwt-secret'
		);
		req.user = payload;
		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
