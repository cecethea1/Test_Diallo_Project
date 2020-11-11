const db = require('../utils/db');

/**
 * Get all alerts
 * @returns {array} alerts
 */
const getAllAlerts = async () => {
  const queryText = {
    text: `
    select distinct on (a.id, a.created_at) a.id,
                                        a.type,
                                        a.created_at,
                                        a.payload,
                                        s.name      as sensor_name,
                                        s2.name     as site_name,
                                        p.name      as project_name,
                                        g.gateway_name as box_name
    from alerts a
            inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
            inner join site_gateway sg on s.gateway_id = sg.id
            inner join gateways g on sg.gateway_id = g.id
            inner join sites s2 on sg.site_id = s2.id
            inner join projects p on s2.project_id = p.id
    order by a.created_at desc;
    `,
  };
  const res = await db.query(queryText);
  return res.rows;
};

/**
 * Get alerts details from sensor id
 * @param {number} sensorId
 * @returns {array} alerts
 */
const getAlertsBySensorId = async (sensorId) => {
  const queryText = {
    text: `
    select a.id,
        a.type,
        a.created_at,
        a.payload,
        s.name      as sensor_name,
        s2.name     as site_name,
        p.name      as project_name,
        g.gateway_name as box_name
    from alerts a
          inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
          inner join site_gateway sg on s.gateway_id = sg.id
          inner join gateways g on sg.gateway_id = g.id
          inner join sites s2 on sg.site_id = s2.id
          inner join projects p on s2.project_id = p.id
    where s.id = $1
    order by a.created_at desc;`,
    values: [sensorId],
  };
  const res = await db.query(queryText);
  return res.rows;
};

/**
 * Get alerts details from project id
 * @param {number} projectId
 * @returns {Promise<Array>} alerts
 */
const getAlertsByProjectId = async (projectId, limit = 5, orderBy, order) => {
  const queryText = {
    text: ` 
    select a.id,
        a.type,
        a.created_at,
        a.payload,
        s.sensor_name  as sensor_name,
        s2.name     as site_name,
        p.name      as project_name,
        g.gateway_name as box_name
    from alerts a
          inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
          inner join site_gateway sg on s.gateway_id = sg.id
          inner join gateways g on sg.gateway_id = g.id
          inner join sites s2 on sg.site_id = s2.id
          inner join projects p on s2.project_id = p.id
    where p.id = $1
    ORDER BY
    (CASE WHEN $3 = 'created_at' AND $4 = 'desc' THEN cast(a.created_at as varchar(30)) END) DESC,
    (CASE WHEN $3 = 'created_at' THEN cast(a.created_at as varchar(30)) END),
    (CASE WHEN $3 = 'site_name' AND $4 = 'desc' THEN cast(s2.name as varchar(30)) END) DESC,
    (CASE WHEN $3 = 'site_name' THEN cast(s2.name as varchar(30)) END),
    (CASE WHEN $3 = 'alert_level' AND $4 = 'desc' THEN cast(a.type as text) END) DESC,
    (CASE WHEN $3 = 'alert_level' THEN cast(a.type as text) END),
    (CASE WHEN $3 = 'value' AND $4 = 'desc' THEN cast(a.payload -> 'value' as text) END) DESC,
    (CASE WHEN $3 = 'value' THEN cast(a.payload -> 'value' as text) END)
    LIMIT $2;
    `,
    values: [projectId, limit, orderBy, order],
  };
  const res = await db.query(queryText);
  return res.rows;
};
/**
 * Get alerts count by type
 * @param {string} type
 * @returns {number} alerts count by type
 */
const getAlertsProjectCountByType = async (type, projectId) => {
  const queryText = {
    text: `
    select count(*)
    from alerts a
            inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
            inner join site_gateway sg on s.gateway_id = sg.id
            inner join sites s2 on sg.site_id = s2.id
            inner join projects p on s2.project_id = p.id
    where a.type = $1
      and p.id = $2;`,
    values: [type, projectId],
  };
  const queryTextContractual = {
    text: `
    select count(*)
    from alerts a
            inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
            inner join site_gateway sg on s.gateway_id = sg.id
            inner join sites s2 on sg.site_id = s2.id
            inner join projects p on s2.project_id = p.id
    where a.type != ALL('{ Warning, Alert }'::text[])
      and p.id = $1;`,
    values: [projectId],
  };
  const queryTextAll = {
    text: `
    select count(*)
    from alerts a
            inner join sensors s on (a.payload -> 'sensor_id')::INTEGER = s.id
            inner join site_gateway sg on s.gateway_id = sg.id
            inner join sites s2 on sg.site_id = s2.id
            inner join projects p on s2.project_id = p.id
      and p.id = $1;`,
    values: [projectId],
  };
  let query = queryTextAll;
  if (type) {
    query = type === 'Contractual' ? queryTextContractual : queryText;
  }
  const res = await db.query(query);
  return res.rows[0].count;
};

/**
 * Get alerts details from project id
 * @param {number} projectId
 * @returns {Promise<Array>} alerts
 */
const getLastAlertCheck = async () => {
  const res = await db.query({
    text: 'select * from alert_logs al order by created_at desc limit 1;',
  });
  return res.rows[0];
};

module.exports = {
  getAllAlerts, getAlertsBySensorId, getAlertsByProjectId, getAlertsProjectCountByType, getLastAlertCheck,
};
