const db = require('../utils/db');

/**
 * Get user notifications
 * @returns {Promise<Array>} notifications
 */
const getNotifications = async (userId) => {
  const queryText = {
    text: 'SELECT * FROM notifications WHERE receiver = $1 limit 10;',
    values: [userId],
  };
  const res = await db.query(queryText);
  return res.rows;
};

/**
 * Set user notification read
 * @returns {Promise<Number>} updated rows count
 */
const setReadNotification = async (userId, notificationId) => {
  const queryText = {
    text: 'UPDATE notifications SET read = TRUE WHERE receiver = $1 AND id = $2;',
    values: [userId, notificationId],
  };
  const res = await db.query(queryText);
  return res.rows;
};
/**
 * Set all user notification read
 * @returns {Promise<Number>} updated rows count
 */
const setReadAllNotification = async (userId) => {
  const queryText = {
    text: 'UPDATE notifications SET read = TRUE WHERE receiver = $1;',
    values: [userId],
  };
  const res = await db.query(queryText);
  return res.rows;
};

module.exports = {
  getNotifications, setReadNotification, setReadAllNotification,
};
