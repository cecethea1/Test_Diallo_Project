const hstore = require('pg-hstore')();
const {
  getAllAlerts,
  getAlertsProjectCountByType,
  getAlertsBySensorId,
  getAlertsByProjectId,
  getLastAlertCheck,
} = require('../services/alerts.service');

/**
 * Get all alerts
 * @param {*} req
 * @param {*} res
 */
const getAllAlertsHandler = async (_req, res) => {
  try {
    const alerts = await getAllAlerts();
    const parsedAlerts = alerts.map((alert) => ({ ...alert, payload: hstore.parse(alert.payload) }));
    res.status(200).json(parsedAlerts);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get alerts by sensorId
 * @param {number} req.params.sensorId
 * @param {*} res
 */
const getAlertsBySensorIdHandler = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const alerts = await getAlertsBySensorId(sensorId);
    const parsedAlerts = alerts.map((alert) => ({ ...alert, payload: hstore.parse(alert.payload) }));
    res.status(200).json(parsedAlerts);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get alerts by projectId
 * @param {number} req.params.projectId
 * @param {*} res
 */
const getAlertsByProjectIdHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit, orderBy, order } = req.query;
    const alerts = await getAlertsByProjectId(projectId, limit, orderBy, order);
    const parsedAlerts = alerts.map((alert) => ({ ...alert, payload: hstore.parse(alert.payload) }));
    res.status(200).json(parsedAlerts);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get alerts count by type
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @param req.query.type {String} The alert type query
 */
const getAlertsProjectCountByTypeHandler = async (req, res) => {
  const { type } = req.query;
  const { projectId } = req.params;
  try {
    const count = await getAlertsProjectCountByType(type, projectId);
    res.status(200).json({
      type,
      count,
    });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get last threshold check
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const getLastAlertCheckHandler = async (_req, res) => {
  try {
    const lastcheck = await getLastAlertCheck();
    res.status(200).json(lastcheck);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getAllAlertsHandler,
  getAlertsBySensorIdHandler,
  getAlertsByProjectIdHandler,
  getAlertsProjectCountByTypeHandler,
  getLastAlertCheckHandler,
};
