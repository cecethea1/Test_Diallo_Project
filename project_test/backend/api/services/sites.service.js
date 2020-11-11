const db = require('../utils/db');

/**
 * Format infos of site before response
 * @param {object} sitesDb
 */
const formatSites = (sitesDb) => ({ // supprimer pour l'instant
  id: sitesDb.id,
  type: sitesDb.name,
  name: sitesDb.type,
  startDate: sitesDb.start_date,
  previsionalEndDate: sitesDb.previsional_end,
  project: {
    id: sitesDb.project_id,
    name: sitesDb.project_name,
  },
});

/**
 * Get sites of userId
 * @param {number} userId
 * @returns {object} sites
 */
const getSites = async (userId) => {
  const res = await db.query(`
    SELECT s.id, s.name, s.type, s.project_id
    FROM users u
    INNER JOIN companies c ON c.id = u.company_id
    INNER JOIN projects_companies pc ON c.id = pc.company_id
    INNER JOIN projects p ON pc.project_id = p.id
    INNER JOIN sites s ON p.id = s.project_id
    WHERE  u.id = $1;
  `, [userId]);

  return res.rows;
};

/**
 * Get infos of siteId
 * @param {number} siteId
 * @returns {object} sites
 */
const getSiteById = async (siteId) => {
  const res = await db.query(`
    SELECT s.id, s.name, s.type, s.start_date, s.previsional_end, p.id as project_id, p.name AS project_name
    FROM sites s
    LEFT JOIN projects p ON s.project_id = p.id
    WHERE s.id = $1;
      `, [siteId]);

  if (res.rowCount === 1) {
    const sites = formatSites(res.rows[0]);
    return sites;
  }
  return null;
};

const getGraphsConfig = async (siteId) => {
  const res = await db.query(`
  SELECT g.id , g.metric ,  g.name , g.type , g.sensors_id , g.min_x , g.max_x , g.min_y , g.max_y
  FROM config_graph g
  WHERE g.site_id = $1;
  `, [siteId]);

  return res.rows;
};

module.exports = { getSites, getSiteById, getGraphsConfig };
