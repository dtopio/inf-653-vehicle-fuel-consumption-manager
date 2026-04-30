const express = require('express');

const AuthController = require('../controllers/AuthController');
const FuelRecordController = require('../controllers/FuelRecordController');
const sessionAuth = require('../middleware/sessionAuth');
const csrfProtection = require('../middleware/csrfProtection');

const router = express.Router();

router.get('/login', csrfProtection, AuthController.showLogin);
router.post('/login', csrfProtection, AuthController.loginWeb);

router.get('/register', csrfProtection, AuthController.showRegister);
router.post('/register', csrfProtection, AuthController.registerWeb);

router.get('/dashboard', sessionAuth, FuelRecordController.showDashboard);

router.get('/add-record', sessionAuth, csrfProtection, FuelRecordController.showAddRecordForm);
router.post('/add-record', sessionAuth, csrfProtection, FuelRecordController.addRecordWeb);

module.exports = router;
