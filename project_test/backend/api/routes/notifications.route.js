const express = require('express');
const { getNotificationsHandler, setReadAllNotificationsHandler, setReadNotificationsHandler } = require('../controllers/notifications.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/', authentication, getNotificationsHandler);
router.post('/', authentication, setReadAllNotificationsHandler);
router.post('/:notificationId', authentication, setReadNotificationsHandler);

module.exports = router;
