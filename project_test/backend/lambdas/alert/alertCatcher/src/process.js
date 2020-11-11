const hstore = require('pg-hstore')();
const db = require('./db');
const checkMeasureValue = require('./tools/checkMeasureValue');



module.exports = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('db connection started...');
            // get all non checked measures
            const measures = await db.query({
                text: ` select distinct ON (me.sensor_id, me.timestamp, me.value, me.metric_id)
                                        me.sensor_id,
                                        me.timestamp,
                                        me.value,
                                        m.metric,
                                        m.unit,
                                        th.threshold
                        from measures me
                        inner join metric m on me.metric_id = m.id
                        inner join thresholds th on th.metric_id = me.metric_id
                        where me.checked = false
                        order by me.timestamp;`,
            })

            let alerts = [];
            // initialize last
            if (measures.rowCount > 0) {
                const data = measures.rows;
                for (let i = 0; i < data.length; i++) {
                    const measure = data[i];
                    const alert = await checkMeasureValue(measure);
                    if (alert) alerts.push(alert);
                }
            }
            // set alerts to checked
            await db.query({
                text: `UPDATE measures m SET checked = TRUE WHERE m.checked = FALSE;`
            });
            await db.query({
                text: `INSERT INTO alert_logs (count) values ($1);`,
                values: [alerts.length]
            });
            resolve(alerts);
        }
        catch (error) {
            reject(error);
        }
    });
};
