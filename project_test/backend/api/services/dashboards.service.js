const db = require('../utils/db');

const createDashboard = async (userId, projectId, payload, name) => {
  const parsedPayload = JSON.stringify(payload);
  const res = await db.query('INSERT INTO dashboards (name, payload, user_id, project_id) VALUES ($1, $2, $3, $4) returning *;', [name, parsedPayload, userId, projectId]);
  return res.rows;
};
const updateDashboard = async (userId, dashboardId, name, payload) => {
  const parsedPayload = JSON.stringify(payload);
  const res = await db.query('UPDATE dashboards SET payload = $4, name = $3 WHERE id = $2 AND user_id = $1 returning *;', [userId, dashboardId, name, parsedPayload]);
  return res.rows;
};
const updateComponent = async (componentId, payload) => {
  const parsedPayload = JSON.stringify(payload);
  const res = await db.query('UPDATE dashboard_components SET payload = $2 WHERE id = $1 returning *;', [componentId, parsedPayload]);
  return res.rows;
};

const createComponent = async (type, payload, projectId) => {
  const parsedPayload = JSON.stringify(payload);
  const res = await db.query(`
                    INSERT INTO dashboard_components (type, payload, project_id) 
                    VALUES ($1, $2, $3);`, [type, parsedPayload, projectId]);
  return res.rows;
};

const getImagePopupsData = async (siteId, projectId) => {
  const res = await db.query(`
                    select *
                    from dashboard_components
                    where type = 'IMAGE_POPUPS'
                      and (payload -> 'site_id')::INTEGER = $1 and project_id = $2;`, [siteId, projectId]);
  return res.rows;
};

const getDashboardComponents = async (userId, dashboardId) => {
  const res = await db.query(`select dc.id id, type, dashboard_id, dc.payload payload, dc.created_at created_at
                              from dashboard_components dc
                                      inner join dashboards on dc.dashboard_id = dashboards.id
                              and user_id = $1 and dc.dashboard_id = $2;`, [userId, dashboardId]);
  return res.rows;
};

const getDashboardsByProjectId = async (userId, projectId) => {
  const res = await db.query(`SELECT *
                              FROM dashboards
                              where user_id = $1
                                and project_id = $2 order by id;`, [userId, projectId]);
  return res.rows;
};

const deleteDashboardById = async (id) => {
  const res = await db.query('delete from dashboards where id = $1;', [id]);
  return res.rows;
};

module.exports = {
  createDashboard,
  createComponent,
  getDashboardComponents,
  getDashboardsByProjectId,
  updateComponent,
  updateDashboard,
  deleteDashboardById,
  getImagePopupsData,
};
