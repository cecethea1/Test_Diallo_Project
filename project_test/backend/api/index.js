const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const morganMiddleware = require('./middleware/logger');

const routes = require('./routes');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const port = isTest ? 3004 : 3000;
// const {postBoxesData} = require('./routes/sensors')

const privkeyPath = path.join(__dirname, '.', ...process.env.CERTIFICATE_KEY_PATH.split('/'));
const certPath = path.join(__dirname, '.', ...process.env.CERTIFICATE_PATH.split('/'));

const certOptions = {
  key: fs.readFileSync(privkeyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8'),
};

const app = express();
if (!isTest && !isProduction) {
  // only used in development
  app.use(morganMiddleware);
}
app.use((req, res, next) => {
  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
if (!isProduction && !isTest) {
  app.use(morganMiddleware);
}

app.use('/api', routes);
const server = isProduction ? https.createServer(certOptions, app) : http.createServer(app);

server.listen(port, () => {
  if (!isTest) {
    if (isProduction) {
      console.log(`Server running on https://::${port} ...`);
    } else {
      console.log(`Server running on http://::${port} ...`);
    }
  }
});
