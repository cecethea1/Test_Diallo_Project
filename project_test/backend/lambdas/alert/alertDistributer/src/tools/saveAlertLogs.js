const Ajv = require('ajv');
const hstore = require('pg-hstore')();
const db = require('../db');

const ajv = new Ajv();

module.exports = async (alert) => {
    const schema = {
        "properties": {
            "type": { "type": "string" },
            "site": { "type": "string" },
            "sensor_id": { "type": "number" },
            "metric": { "type": "string" },
            "unit": { "type": "string" },
            "threshold": { "type": "string" },
            "value": { "type": "number" },
            "limit": { "type": "number" },
            "timestamp": { "type": "string" },
        }
    };

    const validAlert = ajv.validate(schema, alert);
    if (!validAlert) {
        throw (ajv.errors);
    }
    const { type, ...payload } = alert;
    const saveAlertLogQuery = {
        text: `INSERT INTO alerts(type, payload)
      VALUES ($1, $2)
      returning id, type, payload;`,
        values: [type, hstore.stringify(payload)]
    };
    const result = await db.query(saveAlertLogQuery);
    const savedAlert = result.rows[0];
    return ({
        id: savedAlert.id,
        type: savedAlert.type,
        ...hstore.parse(savedAlert.payload),
    });
};
