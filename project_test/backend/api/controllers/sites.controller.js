const {
  getSites,
  getGraphsConfig,
  getSiteById,
} = require('../services/sites.service');

const {
  getSensors,
  getSensorById,
} = require('../services/sensors.service');

/**
   * Get sites for the current user
   * @param {*} req
   * @param {*} res
   */
const getSitesHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const sites = await getSites(id);
    res.status(200).json({ sites });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Get informations of site by ID
   * @param {*} req
   * @param {*} res
   */
const getSiteByIdHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = await getSiteById(siteId);
    res.status(200).json(site);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
  * Get  sensors of site
  * @param {*} req
  * @param {*} res
  */
const getSensorsHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const sensors = await getSensors(siteId);

    res.status(200).json(sensors);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const getSensorByIdHandler = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const captor = await getSensorById(sensorId);
    res.status(200).json(captor);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const getGraphsConfigHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const graphConfig = await getGraphsConfig(siteId);
    res.status(200).json(graphConfig);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getSitesHandler,
  getSiteByIdHandler,
  getSensorsHandler,
  getSensorByIdHandler,
  getGraphsConfigHandler,
};
