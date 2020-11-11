'use strict';

const { SQS } = require('aws-sdk');
const processResult = require('./src/process');

let options = {};

// connect to local ElasticMQ if running offline
if (process.env.IS_OFFLINE) {
    // run command to test in local // docker run -it -p 9324:9324 s12v/elasticmq:latest
    options = {
        apiVersion: '2020-06-16',
        region: 'localhost',
        endpoint: "http://0.0.0.0:9324",
        sslEnabled: false,
    };
}

const sqs = new SQS(options);



module.exports = async () => {
    const region = process.env.REGION;
    const accountId = process.env.ACCOUNT_ID
    const queueName = process.env.QUEUE_NAME;
    const queueUrl = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;
    try {
        const alerts = await processResult();
        if (alerts.length > 0) {
            const toProcess = [];
            for (let i = 0; i < alerts.length; i += 1) {
                toProcess.push(
                    sqs.sendMessage({
                        QueueUrl: queueUrl,
                        MessageBody: JSON.stringify(alerts[i]),
                    }).promise()
                );
            }
            const result = await Promise.all(toProcess);
            return result.length + ' ALert Message placed in the Queue!'
        }
        return 'No aLert was found!'
    } catch (err) {
        console.log('Error', err);
        return err;
    }
}