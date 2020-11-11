// const fetch = require('node-fetch');
const sendMail = require("./src/sendMail");
const sendSMS = require("./src/sendSMS");
const pushNotification = require("./src/pushNotification");
const saveNotifications = require("./src/tools/saveNotifications");
const getAlertContacts = require('./src/tools/getAlertContacts');
const saveAlertLogs = require('./src/tools/saveAlertLogs');

module.exports = async (event) => {
    try {
        for (const record of event.Records) {
            const alert = JSON.parse(record.body);
            const { type, sensor_id } = alert;
            // save alert log to db 
            const savedAlert = await saveAlertLogs(alert);
            console.log(`\n${savedAlert.type} alert saved to db / timestamp : ${savedAlert.timestamp}\n`);
            const measureTimestamp = new Date(savedAlert.timestamp)
            const dateFromNow = new Date(new Date().setFullYear(new Date().getFullYear() - 15))
            if (measureTimestamp >= dateFromNow) {
                // get alert/sensor contacts
                const alertContacs = await getAlertContacts(type, sensor_id);
                const { phone_numbers, emails, subscriptions } = alertContacs;
                const subs = subscriptions.map(s => s.sub);
                const subsUsersIds = subscriptions.map(s => s.id)
                // send emails/sms's to alert/sensor contacts
                const notificationsSent = await Promise.all([
                    sendMail(savedAlert, emails),
                    sendSMS(savedAlert, phone_numbers),
                    saveNotifications(savedAlert, subsUsersIds),
                    pushNotification(savedAlert, subs)]);
                console.log(notificationsSent);
            }
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
};