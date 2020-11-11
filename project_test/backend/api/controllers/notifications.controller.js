const hstore = require('pg-hstore')();
const {
  getNotifications,
  setReadNotification,
  setReadAllNotification,
} = require('../services/notifications.service');

/**
 * Get user notifications
 * @param {*} req
 * @param {*} res
 */
const getNotificationsHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const notifications = await getNotifications(id);
    const parsedNotifications = notifications.map((notif) => ({ ...notif, payload: hstore.parse(notif.payload) }));
    res.status(200).json(parsedNotifications);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
/**
 * Set user notifications to read
 * @param {*} req
 * @param {*} res
 */
const setReadNotificationsHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { notificationId } = req.params;
    const updated = await setReadNotification(id, notificationId);
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Set user notifications to read
 * @param {*} req
 * @param {*} res
 */
const setReadAllNotificationsHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const updated = await setReadAllNotification(id);
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getNotificationsHandler,
  setReadNotificationsHandler,
  setReadAllNotificationsHandler,
};
