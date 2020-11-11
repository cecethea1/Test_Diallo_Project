module.exports = (alert) => {
  return ` \n
- Site : ${alert.site}\n
- Type: ${alert.type}\n
- Sensor : ${alert.sensor_id}\n
- measured at : ${alert.timestamp}\n
- Metric : ${alert.metric}\n
- Unit : ${alert.unit}\n
- Threshold : ${alert.threshold} \n
- Actual Value : ${alert.value}\n
- Limit Value: ${alert.limit}\n`
}