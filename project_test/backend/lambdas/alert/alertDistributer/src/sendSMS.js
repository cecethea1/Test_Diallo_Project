const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const smsTemplate = require('./templates/sms.txt')

// User-defined function to send bulk SMS to desired 
// numbers bypassing numbers list as parameter 
const sendBulkMessages = (messageBody, numberList) => {
    var numbers = [];
    for (i = 0; i < numberList.length; i++) {
        numbers.push(JSON.stringify({
            binding_type: 'sms', address: numberList[i]
        }))
    }

    const notificationOpts = {
        toBinding: numbers,
        body: messageBody,
    };

    return client.notify
        .services(process.env.TWILIO_SERVICE_SID)
        .notifications.create(notificationOpts);
}
module.exports = async (alert, phoneNumbers) => {
    return new Promise(async (resolve, reject) => {
        if (Array.isArray(phoneNumbers) && alert && phoneNumbers.length > 0) {
            try {
                const phoneNumbersToSend = [...new Set(phoneNumbers)] // Set will only allow unique values in it
                const sms_text = smsTemplate(alert)
                await sendBulkMessages(sms_text, phoneNumbersToSend);
                resolve(phoneNumbersToSend.length + ` sms sent done | AlertId: ${alert.id} SensorId: ${alert.sensor_id}`)
            } catch (error) {
                reject(error);
            }
        }
        resolve(`[smsService] No one was subscribed to this alertId : ${alert.id} type : ${alert.type}  | sensorId :  ${alert.sensor_id}`);
    })
};
