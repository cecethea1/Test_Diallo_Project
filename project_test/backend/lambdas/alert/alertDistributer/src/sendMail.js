const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = async (alert, emails) => {
    return new Promise(async (resolve, reject) => {
        if (Array.isArray(emails) && alert && emails.length > 0) {
            const toEmails = [...new Set(emails.map(e => { return { email: e } }))] // Set will only allow unique values in it
            const fromEmail = { email: process.env.SENDGRID_EMAIL_SENDER, name: "THM-Insight | Alert Service" }
            try {
                const mailOptions = {
                    personalizations: [
                        {
                            to: toEmails,
                            dynamic_template_data: alert,
                        }
                    ],
                    from: fromEmail,
                    subject: `${alert.type} Message`,
                    content: [{ type: "text/html", value: "0" }],
                    template_id: process.env.SENDGRID_TEMPLATE_ID,
                };
                await sgMail.send(mailOptions);
                resolve(toEmails.length + ' emails sent done')
            } catch (error) {
                if ("response" in error) {
                    console.dir(error.response.body);
                }
                reject(error)
            }
        }
        resolve('[emailService] No one was subscribed to this alert type : ', alert.type, ' | sensorId : ', alert.sensor_id);
    })

}