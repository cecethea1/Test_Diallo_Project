const {
  getDashboardComponents,
  createDashboard,
  deleteDashboardById,
  updateDashboard,
  createComponent,
  getDashboardsByProjectId,
  getImagePopupsData,
  updateComponent,
} = require('../services/dashboards.service');

/**
   * Get dashboard components
   * @param {*} req
   * @param {*} res
   */
const getDashboardComponentsHandler = async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { id } = req.user;
    const components = await getDashboardComponents(id, dashboardId);
    res.status(200).json(components);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Create dashboard
   * @param {*} req
   * @param {*} res
   */
const createDashboardHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { payload, name } = req.body;
    const { projectId } = req.params;
    const dashboardId = await createDashboard(id, projectId, payload, name);
    res.status(200).send(dashboardId);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
/**
 * update dashboard layout
 * @param {*} req
 * @param {*} res
 */
const updateDashboardHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { payload, name } = req.body;
    const { dashboardId } = req.params;
    const updatedDashboardId = await updateDashboard(id, dashboardId, name, payload);
    res.status(200).send(updatedDashboardId);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Get dashboards list by projectId and userId
   * @param {*} req
   * @param {*} res
   */
const getDashboardsByProjectIdHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { projectId } = req.params;
    const dashboards = await getDashboardsByProjectId(id, projectId);

    res.status(200).json(dashboards);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Create dashboard component
   * @param {*} req
   * @param {*} res
   */
const createComponentHandler = async (req, res) => {
  try {
    const { type, payload } = req.body;
    const { projectId } = req.params;
    const components = await createComponent(type, payload, projectId);
    res.status(200).json(components);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
/**
 * update dashboard component
 * @param {*} req
 * @param {*} res
 */
const updateComponentHandler = async (req, res) => {
  try {
    const { payload } = req.body;
    const { componentId } = req.params;
    const component = await updateComponent(componentId, payload);

    res.status(200).json(component);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
/**
 * Delete dashboard by id
 * @param {*} req
 * @param {*} res
 */
const deleteDashboardByIdHandler = async (req, res) => {
  try {
    const { dashboardId } = req.params;
    await deleteDashboardById(dashboardId);
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};
/**
 * Delete dashboard by id
 * @param {*} req
 * @param {*} res
 */
const getImagePopupsDataHandler = async (req, res) => {
  try {
    const { siteId, projectId } = req.params;
    const response = await getImagePopupsData(siteId, projectId);
    res.status(200).send(response[0]);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getDashboardComponentsHandler,
  createDashboardHandler,
  updateDashboardHandler,
  getDashboardsByProjectIdHandler,
  createComponentHandler,
  updateComponentHandler,
  deleteDashboardByIdHandler,
  getImagePopupsDataHandler,
};
