const hstore = require('pg-hstore')();
const db = require('../db');

module.exports = async (payload, userIds) => {
    return new Promise(async (resolve, reject) => {
        if (Array.isArray(userIds) && payload && userIds.length > 0) {
            try {
                // Set will only allow unique values in it
                const idsToSaveNotifications = [...new Set(userIds)]
                for (let i = 0; i < idsToSaveNotifications.length; i++) {
                    const id = idsToSaveNotifications[i];
                    await db.query(`INSERT INTO notifications(receiver, payload) VALUES ($1, $2);`, [id, hstore.stringify(payload)]);
                }
                resolve(userIds.length + ` notifications saved done | AlertId: ${payload.id} SensorId: ${payload.sensor_id}`)
            } catch (error) {
                reject(error);
            }
        }
        resolve(`[saveNotificationService] No one was subscribed to this alertId : ${payload.id} type : ${payload.type}  | sensorId :  ${payload.sensor_id}`);
    });
};
