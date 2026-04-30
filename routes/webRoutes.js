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

router.post('/logout', sessionAuth, csrfProtection, AuthController.logoutWeb);

router.get('/dashboard', sessionAuth, csrfProtection, FuelRecordController.showDashboard);

router.get('/add-record', sessionAuth, csrfProtection, FuelRecordController.showAddRecordForm);
router.post('/add-record', sessionAuth, csrfProtection, FuelRecordController.addRecordWeb);
router.get('/records/:id/edit', sessionAuth, csrfProtection, FuelRecordController.showEditRecordForm);
router.post('/records/:id/edit', sessionAuth, csrfProtection, FuelRecordController.updateRecordWeb);
router.post('/records/:id/delete', sessionAuth, csrfProtection, FuelRecordController.deleteRecordWeb);

module.exports = router;
