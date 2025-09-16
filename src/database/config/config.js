require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: Number(process.env.DEV_DB_PORT),
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: { ssl: { rejectUnauthorized: false }, useUTC: false },
    timezone: "+07:00",
  },
};
