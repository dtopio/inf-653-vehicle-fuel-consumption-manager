const express = require('express');
const router = express.Router();
const csrf = require('../middleware/csrfProtection');
const sessionAuth = require('../middleware/sessionAuth');
const AuthController = require('../controllers/AuthController');
const FuelRecordController = require('../controllers/FuelRecordController');

router.get('/', (req, res) => res.redirect('/login'));

router.get('/register', csrf, AuthController.showRegister);
router.post('/register', csrf, AuthController.register);

router.get('/login', csrf, AuthController.showLogin);
router.post('/login', csrf, AuthController.login);

router.get('/logout', AuthController.logout);

router.get('/dashboard', sessionAuth, FuelRecordController.getDashboard);

router.get('/records', sessionAuth, FuelRecordController.getRecords);
router.get('/add-record', sessionAuth, csrf, FuelRecordController.showAddRecord);
router.post('/add-record', sessionAuth, csrf, FuelRecordController.createRecord);

router.get('/edit-record/:id', sessionAuth, csrf, FuelRecordController.showEditRecord);
router.post('/update-record/:id', sessionAuth, csrf, FuelRecordController.updateRecord);

router.post('/delete-record/:id', sessionAuth, FuelRecordController.deleteRecord);

module.exports = router;
