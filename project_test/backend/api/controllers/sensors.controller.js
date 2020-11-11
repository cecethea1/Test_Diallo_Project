const {
  getSensorLastData,
  getSiteLastData,
  getSensorData,
  getSensorDataByMetric,
  postBoxesData,
  getSensorsByProjectId,
} = require('../services/sensors.service');

const getSensorsByProjectIdHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await getSensorsByProjectId(projectId);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
const getSensorLastDataHandler = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const data = await getSensorLastData(sensorId);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const getSensorDataHandler = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { metric } = req.query;
    const data = await getSensorData(sensorId, metric);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const getSiteLastDataHandler = async (req, res) => {
  try {
    const { siteId } = req.params;
    const data = await getSiteLastData(siteId);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const getSensorDataByMetricHandler = async (req, res) => {
  try {
    const { sensorId, metric } = req.params;
    const { min, max, downsampling } = req.query;
    const data = await getSensorDataByMetric(sensorId, metric, downsampling, min, max);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const postBoxesDataHandler = async (req, res) => {
  try {
    const {
      nameGateway, serialNumber, projectName, transferProtocol, powerSupply, installationDate, operatingTeam,
    } = req.body;
    const { siteId } = req.params;
    const boxesData = await postBoxesData(nameGateway,
      serialNumber, projectName, transferProtocol, powerSupply, installationDate, operatingTeam, siteId);
    res.status(200).json(boxesData);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getSensorLastDataHandler,
  getSensorDataHandler,
  getSiteLastDataHandler,
  getSensorDataByMetricHandler,
  postBoxesDataHandler,
  getSensorsByProjectIdHandler,
};
