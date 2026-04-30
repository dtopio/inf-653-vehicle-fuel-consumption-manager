const express = require('express');

const AuthController = require('../controllers/AuthController');
const FuelRecordController = require('../controllers/FuelRecordController');
const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

router.post('/login', AuthController.loginApi);
router.get('/records', jwtAuth, FuelRecordController.getRecordsApi);

module.exports = router;
