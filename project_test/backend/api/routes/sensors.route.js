const express = require('express');
const { getAlertsBySensorIdHandler } = require('../controllers/alerts.controller');
const {
  getSensorDataHandler, getSensorLastDataHandler, getSiteLastDataHandler, getSensorDataByMetricHandler,
  postBoxesDataHandler,
} = require('../controllers/sensors.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/:sensorId/data', authentication, getSensorDataHandler);
router.get('/:sensorId/last', authentication, getSensorLastDataHandler);
router.get('/site/:siteId/last', authentication, getSiteLastDataHandler);
router.get('/:sensorId/alerts', authentication, getAlertsBySensorIdHandler);
router.get('/:sensorId/data/:metric', authentication, getSensorDataByMetricHandler);
router.post('/boxes/:siteId/insert', authentication, postBoxesDataHandler);
module.exports = router;
