const express = require('express');
const { getAlertsByProjectIdHandler, getAlertsProjectCountByTypeHandler } = require('../controllers/alerts.controller');
const {
  getProjectsHandler, getProjectByIdHandler, getMediaHandler, getProjectSitesHandler, insertNewProjectHandler,
} = require('../controllers/projects.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/', authentication, getProjectsHandler);
router.get('/:projectId', authentication, getProjectByIdHandler);
router.get('/:projectId/alerts', authentication, getAlertsByProjectIdHandler);
router.get('/:projectId/alerts/count', authentication, getAlertsProjectCountByTypeHandler);
router.get('/:projectId/media', authentication, getMediaHandler);
router.get('/:projectId/sites', authentication, getProjectSitesHandler);
router.post('/', authentication, insertNewProjectHandler);

module.exports = router;
