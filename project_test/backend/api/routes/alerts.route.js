const express = require('express');
const { getAllAlertsHandler, getLastAlertCheckHandler } = require('../controllers/alerts.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/', authentication, getAllAlertsHandler);
router.get('/logs/last', authentication, getLastAlertCheckHandler);

module.exports = router;
