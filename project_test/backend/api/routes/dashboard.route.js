const express = require('express');

const {
  createComponentHandler,
  createDashboardHandler,
  deleteDashboardByIdHandler,
  getDashboardComponentsHandler,
  getDashboardsByProjectIdHandler,
  updateComponentHandler,
  updateDashboardHandler,
} = require('../controllers/dashboards.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/:projectId', authentication, getDashboardsByProjectIdHandler);
router.post('/:projectId', authentication, createDashboardHandler);
router.put('/:dashboardId', authentication, updateDashboardHandler);
router.delete('/:dashboardId', authentication, deleteDashboardByIdHandler);
router.get('/:dashboardId/components', authentication, getDashboardComponentsHandler);
router.post('/:projectId/components/create', authentication, createComponentHandler);
router.put('/components/:componentId/update', authentication, updateComponentHandler);

module.exports = router;
