const config = require('../config/config');

const databaseConfig = {
  development: {
    username: config.db_username,
    password: config.db_password,
    database: config.db_name,
    host: config.db_host,
    dialect: config.db_dialect,
  },
  test: {
    username: config.db_username,
    password: config.db_password,
    database: config.db_name,
    host: config.db_host,
    dialect: config.db_dialect,
  },
  production: {
    username: config.db_username,
    password: config.db_password,
    database: config.db_name,
    host: config.db_host,
    dialect: config.db_dialect,
  },
};
module.exports = databaseConfig;
