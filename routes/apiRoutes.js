const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthController.apiLogin);

router.get('/records', jwtAuth, (req, res) => res.json([]));
router.post('/records', jwtAuth, (req, res) => res.status(201).json({}));
router.put('/records/:id', jwtAuth, (req, res) => res.json({}));
router.delete('/records/:id', jwtAuth, (req, res) => res.json({ deleted: true }));

module.exports = router;
