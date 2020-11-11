const webpush = require('web-push');
webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

module.exports = (alert, subscriptions) => {
    return new Promise(async (resolve, reject) => {
        if (Array.isArray(subscriptions) && alert && subscriptions.length > 0) {
            try {
                const subscriptionsToSend = [...new Set(subscriptions)] // Set will only allow unique values in it
                for (let i = 0; i < subscriptionsToSend.length; i++) {
                    const sub = subscriptionsToSend[i];
                    const payload = JSON.stringify({ title: `${alert.type} Alert`, body: 'New Alert Detected \n Click for more details' })
                    webpush.sendNotification({ endpoint: JSON.parse(sub).endpoint, keys: JSON.parse(sub).keys }, payload)
                }
                resolve(subscriptionsToSend.length + ` push notification sent done | AlertId: ${alert.id} SensorId: ${alert.sensor_id}`)
            } catch (error) {
                reject(error);
            }
        }
        resolve(`[pushNotificationService] No one was subscribed to this alertId : ${alert.id} type : ${alert.type}  | sensorId :  ${alert.sensor_id}`);
    });
}