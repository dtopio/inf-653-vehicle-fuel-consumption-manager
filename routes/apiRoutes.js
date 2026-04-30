const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const AuthController = require('../controllers/AuthController');
const FuelRecordController = require('../controllers/FuelRecordController');

router.post('/login', AuthController.apiLogin);

router.get('/records', jwtAuth, FuelRecordController.apiGetRecords);
router.post('/records', jwtAuth, FuelRecordController.apiCreateRecord);
router.put('/records/:id', jwtAuth, FuelRecordController.apiUpdateRecord);
router.delete('/records/:id', jwtAuth, FuelRecordController.apiDeleteRecord);

router.get('/statistics', jwtAuth, FuelRecordController.apiGetStatistics);

module.exports = router;
