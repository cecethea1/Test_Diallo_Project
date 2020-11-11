const format = require('pg-format');
const db = require('../utils/db');

/**
 * Get projects details from id
 * @param {number} projectId
 * @param {number} userId
 * @returns {object} projects
 */
const getProjectById = async (projectId) => {
  const res = await db.query(` SELECT distinct on (p.id) p.id,
                                p.name,
                                p.description,
                                COUNT(distinct sn.id)                                          as sensorsCount,
                                MAX(sn.updated_at)                                             as updated_at,
                                (select json_agg(photos_agg)
                                from (select distinct name, url
                                      from media m
                                      where p.id = m.project_id and m.type = 'image/jpeg') photos_agg) as photos,
                                (select json_agg(companies_agg)
                                from (select distinct c.name, pc.role, c.address
                                      from companies c
                                      INNER JOIN projects_companies pc ON pc.project_id = p.id
                                      where pc.company_id = c.id) companies_agg) as companies
                              FROM projects p
                              LEFT JOIN sites s ON s.project_id = p.id
                              LEFT JOIN site_gateway b on b.site_id = s.id
                              LEFT JOIN sensors sn ON sn.gateway_id = b.id
                              WHERE p.id = $1
                              GROUP BY p.id;`, [projectId]);

  if (res.rowCount > 0) {
    return res.rows[0];
  }
  return [];
};

const getProjects = async (id) => {
  const projectRes = await db.query(`
              SELECT distinct on (p.id) p.id,
              p.name,
              p.description,
              COUNT(distinct sn.id)                                          as sensorsCount,
              MAX(sn.updated_at)                                             as updated_at,
              (select json_agg(photos_agg)
              from (select distinct name, url
                    from media m
                    where p.id = m.project_id and m.type = 'image/jpeg') photos_agg) as photos,
              (select json_agg(companies_agg)
              from (select distinct c.name, pc.role, c.address
                    from companies c
                    INNER JOIN projects_companies pc ON pc.project_id = p.id
                    where pc.company_id = c.id) companies_agg) as companies
            FROM projects p
            LEFT JOIN sites s ON s.project_id = p.id
            LEFT JOIN site_gateway b on b.site_id = s.id
            LEFT JOIN sensors sn ON sn.gateway_id = b.id
            LEFT OUTER JOIN projects_companies pc ON pc.project_id = p.id
            LEFT OUTER JOIN companies c ON pc.company_id = c.id
            LEFT OUTER JOIN users u ON pc.company_id = u.company_id
            where u.id = $1
            GROUP BY p.id;
  `, [id]);

  if (projectRes.rowCount > 0) {
    return projectRes.rows;
  }

  return [];
};

const getMedia = async (projectId, type) => {
  const res = await db.query(format(`
    SELECT type, name, description, url
    FROM media
    WHERE project_id = %1$L AND (type IN (%2$L) OR (%2$L) IS NULL)  ;
  `, projectId, type));

  return res.rows;
};

const getProjectSites = async (projectId) => {
  const res = await db.query(
    `  SELECT s.id, s.name, s.type, s.start_date, s.previsional_end
    FROM sites s WHERE s.project_id = $1;
    `, [projectId],
  );
  return res.rows;
};

const postNewProject = async (
  ProjectPhoto,
  ProjectName,
  Country,
  ClientComapanyName,
  TimeZone,
  City,
  StartDate,
  Description,
) => {
  try {
    const res = await db.query(` INSERT INTO project(
      project_photo, 
      project_name, 
      country, 
      client_comapany_name,
      time_zone,
      city, 
      start_date,
      description
      )
      VALUES($1, $2, $3, $4, $5, $6, $7),`,
    [
      ProjectPhoto,
      ProjectName,
      Country,
      ClientComapanyName,
      TimeZone,
      City,
      StartDate,
      Description,
    ]);
    return res.rows;
  } catch (err) {
    console.log(err);
    throw (new Error(err.message));
  }
};
module.exports = {
  getProjectById, getProjects, getMedia, getProjectSites, postNewProject,
};
