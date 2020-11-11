const format = require('pg-format');
const db = require('../utils/db');

const getGraphsById = async (graphId) => {
  const res = await db.query(format(`
  SELECT g.id, g.name , g.metric , g.type , g.site_id , g.sensors_id , g.min_x , g.max_x , g.min_y , g.max_y
  FROM config_graph g
  WHERE g.id = %L;
  `, graphId));

  if (res.rowCount === 1) {
    return res.rows;
  }

  throw (new Error('Graph Unknow'));
};

const insertGraph = async (siteId, name, metric, type, captorsId, minX, maxX, minY, maxY) => {
  const request = {
    text: ` INSERT INTO config_graph(site_id,name,metric,type,sensors_id,min_x,max_x,min_y,max_y) values
          ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    values: [siteId, name, metric, type, captorsId, minX, maxX, minY, maxY],
  };
  const { rows } = await db.query(request);
  if (rows.length > 0) {
    return rows[0].id;
  }
  throw (new Error('No graph added'));
};

module.exports = { getGraphsById, insertGraph };
