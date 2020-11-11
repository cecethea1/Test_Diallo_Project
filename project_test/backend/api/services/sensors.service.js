const format = require('pg-format');
const db = require('../utils/db');
const treatData = require('../utils/TreatData');

const getSensors = async (siteId) => {
  const res = await db.query(format(`
    SELECT 
      s2.id::TEXT,
      s2.sensor_name,
      s2.sensor_type, 
      st.id, 
      st.type_name, 
      sgp.group_name, 
      sgp.priority,
      st.type_description
    FROM sites s
      INNER JOIN site_gateway sg  ON sg.site_id = s.id
      INNER JOIN sensors s2 on sg.id = s2.gateway_id
      INNER JOIN sensor_types st ON s2.sensor_type = st.id
      INNER JOIN sensor_groups sgp ON st.type_groups = sgp.id
      WHERE s.id = %L
  `, siteId));
  return res.rows;
};

const getSensorById = async (sensorId) => {
  const res = await db.query(format(`
    SELECT 
      s.id, 
      s.sensor_name, 
      s.type_sensor, 
      s.point_x, 
      s.point_y, 
      s.point_z, 
      s.installation_date, 
      s.initial_frequency , 
      json_agg(json_build_object('id', m.id, 'name', m.metric , 'unit' , m.unit)) as metric
    FROM sensors s
      INNER JOIN thresholds t on t.sensor_id = s.id
      INNER JOIN metric m on m.id = t.metric_id
      WHERE s.id = %L
      GROUP BY s.id;
  `, sensorId));

  if (res.rowCount > 0) {
    return res.rows;
  }
  throw (new Error('Captor unknown or no site deployed'));
};

const getSensorData = async (sensorId, metric) => {
  const res = await db.query(format(`
    SELECT 
      EXTRACT(EPOCH FROM (sm.timestamp AT TIME ZONE 'UTC'))*1000 as x  , sm.value  as y  , m.metric , m.unit
    FROM measures sm
      INNER JOIN metric m on m.id = sm.metric_id
      WHERE sensor_id = %1$L and (m.id in (%2$L) or (%2$L) IS NULL)  ;
  `, sensorId, metric));

  return res.rows;
};

const getSensorLastData = async (sensorId) => {
  const res = await db.query(`
    SELECT distinct on (sensor_id) sensor_id as id,
      EXTRACT(EPOCH FROM (sm.timestamp AT TIME ZONE 'UTC')) * 1000 as x,
      sm.value                                                     as y,
      m.metric,
      m.unit,
      s.name
    FROM measures sm
      INNER JOIN metric m on m.id = sm.metric_id
      INNER JOIN sensors s on sm.sensor_id = s.id AND s.id = $1;
  `, [sensorId]);

  return res.rows[0];
};

const getSiteLastData = async (siteId) => {
  const res = await db.query(`
    SELECT distinct on (sensor_id) sensor_id as id,
      EXTRACT(EPOCH FROM (sm.timestamp AT TIME ZONE 'UTC')) * 1000 as x,
      sm.value                                                     as y,
      m.metric,
      m.unit
    FROM measures sm
      INNER JOIN metric m on m.id = sm.metric_id
      INNER JOIN site_gateway sg on sg.site_id= $1
      INNER JOIN sensors s2 on sg.id = s2.gateway_id;
  `, [siteId]);

  return res.rows;
};

const getSensorDataByMetric = async (sensorId, metric, downsampling, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  const res = await db.query(format(`
    SELECT 
      EXTRACT(EPOCH FROM (sm.timestamp AT TIME ZONE 'UTC'))*1000 as x  , sm.value  as y  , m.metric , m.unit
    FROM measures sm
      INNER JOIN metric m on m.id = sm.metric_id
      WHERE sensor_id = %L and m.id=%L 
  `, sensorId, metric, min, max));

  let data = null;
  if (downsampling) {
    data = treatData.largestTriangleThreeBucket(res.rows, downsampling, min, max);
  } else {
    data = res.rows.filter((row) => row.x >= min && row.x <= max);
  }
  return data;
};

const postBoxesData = async (
  idSensor,
  sensorName,
  pointX,
  pointY,
  pointZ,
  installationDate,
  uninstallationDate,
  operatorName,
  serialNumber,
  installationSheet,
  idSites,
  idSubSite,
  initialFrequency,
  typeSensor,
  tagsSensor,
  gatewayId,
  createdAt,
  updatedAt) => {
  try {
    const res = await db.query(`
    INSERT INTO sensors(
      id,
      sensor_name, 
      point_x,
      point_y,
      point_z,
      installation_date,
      uninstallation_date,
      operator_name,
      serial_number,
      installation_sheet,
      id_sites,
      id_sub_site,
      initial_frequency,
      type_sensor,
      tags_sensor,
      gateway_id,
      created_at,
      updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
    [
      idSensor,
      sensorName,
      pointX,
      pointY,
      pointZ,
      installationDate,
      uninstallationDate,
      operatorName,
      serialNumber,
      installationSheet,
      idSites,
      idSubSite,
      initialFrequency,
      typeSensor,
      tagsSensor,
      gatewayId,
      createdAt,
      updatedAt,
    ]);
    return res.rows;
  } catch (err) {
    console.log(err.stack);
    throw (new Error(err.message));
  }
};

const getSensorTypes = async () => {
  const res = await db.query(format(
    `SELECT 
      s.id, s.type_name, 
      s.type_groups 
     FROM 
      sensor_types as s `,
  ));
  if (res.rowCount > 0) {
    return res.rows;
  }
  throw (new Error("Can't get sensor types"));
};

const getSensorGroups = async () => {
  const res = await db.query(format(
    `SELECT 
      id, 
      group_name, 
     FROM sensor_groups `,
  ));
  if (res.rowCount > 0) {
    return res.rows;
  }
  throw (new Error("Can't get sensor groups"));
};

module.exports = {
  getSensors,
  getSensorById,
  getSensorData,
  getSiteLastData,
  getSensorLastData,
  getSensorDataByMetric,
  postBoxesData,
  getSensorTypes,
  getSensorGroups,
};
