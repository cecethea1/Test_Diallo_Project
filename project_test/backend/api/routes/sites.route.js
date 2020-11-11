const express = require('express');
const {
  getSitesHandler, getSiteByIdHandler, getSensorsHandler, getSensorByIdHandler, getGraphsConfigHandler,
} = require('../controllers/sites.controller');
const { getImagePopupsDataHandler } = require('../controllers/dashboards.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/', authentication, getSitesHandler);
router.get('/:siteId', authentication, getSiteByIdHandler);
router.get('/:siteId/sensors', authentication, getSensorsHandler);
router.get('/:siteId/sensors/:sensorId', authentication, getSensorByIdHandler);
router.get('/:siteId/graphs', authentication, getGraphsConfigHandler);
router.get('/:projectId/:siteId/image_popups', authentication, getImagePopupsDataHandler);

module.exports = router;
