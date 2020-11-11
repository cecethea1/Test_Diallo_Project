const Ajv = require('ajv');
const db = require('../db');

const ajv = new Ajv();

module.exports = async (type, sensor_id) => {
    const schema = {
        "properties": {
            "type": { "type": "string" },
            "sensor_id": { "type": "number" },
            "emails": { "type": "array" },
            "phone_numbers": { "type": "array" },
        }
    };
    const alertContactQuery = {
        text: ` select type,
                        sensor_id,
                        json_agg(a.email)::json                                           as emails,
                        json_agg(a.phone_number)::json                                    as phone_numbers,
                        json_agg(json_build_object('id', u.id, 'sub', u.push_sub))::jsonb as subscriptions
                from alert_contact a
                        inner join users u on a.email = u.email
                where type = $1
                and sensor_id = $2
                group by type, sensor_id;`,
        values: [type, sensor_id]
    };
    const result = await db.query(alertContactQuery);
    const alertContacts = result.rowCount > 0 ? result.rows[0] : { type, sensor_id, emails: [], phone_numbers: [] };
    const valid = ajv.validate(schema, alertContacts);
    if (!valid) {
        throw (ajv.errors);
    }
    return alertContacts;
};
