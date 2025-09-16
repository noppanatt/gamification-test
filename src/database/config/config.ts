//To do
import dotenv from "dotenv";
// const dotenv = require('dotenv')
dotenv.config();

export default {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: process.env.DEV_DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
      useUTC: false,
    },
    timezone: "+07:00",
  },
};
