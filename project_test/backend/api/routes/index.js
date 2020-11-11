const express = require('express');
const users = require('./users.route');
const projects = require('./projects.route');
const sites = require('./sites.route');
const sensors = require('./sensors.route');
const graphs = require('./graphs.route');
const dashboard = require('./dashboard.route');
const alerts = require('./alerts.route');
const notifications = require('./notifications.route');

const router = express.Router();

router.get('/wake-up', (_req, res) => res.send('👍'));
router.use('/users', users);
router.use('/projects', projects);
router.use('/sites', sites);
router.use('/sensors', sensors);
router.use('/users', users);
router.use('/graphs', graphs);
router.use('/dashboard', dashboard);
router.use('/alerts', alerts);
router.use('/notifications', notifications);

module.exports = router;
