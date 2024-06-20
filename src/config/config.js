const path = require('path');
const { fileURLToPath } = require('url');
const dotenv = require('dotenv');

// Configure dotenv with the resolved path
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  cors_origin: process.env.CORS_ORIGIN,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_dialect: process.env.DB_DIALECT,
  db_host: process.env.DB_HOST,
  jwt_secret_key: process.env.JWT_SECRET_KEY
};

module.exports = config;
