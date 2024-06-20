const db = require('./models/index.js');

try {
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');


  const bodyParser = require('body-parser');
  const router = require('./apps/auth/index.js');
  const errorHandler = require('./middleware/error-handler.js');
  const app = express();

  app.use(
    cors({
      // origin is given a array if we want to have multiple origins later
      origin: '*',
      // credentials: true,
    })
  );

  // Helmet is used to secure this app by configuring the http-header
  app.use(helmet());

  // parse application/json
  app.use(bodyParser.json());

  app.use('/api/auth', [router]);

  app.use(errorHandler);

  db.sequelize.authenticate().then(() => {
    console.log("DB CONNECTED SUCCESSFULLY.");
  }).catch(err => {
    console.log(err);
  })

  module.exports = app;
} catch (err) {
  console.log(err);
}
