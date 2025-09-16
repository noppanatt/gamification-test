import { Sequelize } from "sequelize";
import configPath from "./config/config";
const env: string = process.env.NODE_ENV || "local";
const config = JSON.parse(JSON.stringify(configPath))[env];

const sequelize = config.use_env_variable
  ? new Sequelize(config.use_env_variable, config)
  : new Sequelize(config.database, config.username, config.password, config);

sequelize
  .authenticate()
  .then(() => {
    console.log("🌍 Database connection has been established successfully.🌍");
    // return sequelize.sync(); // Chaining sync() after authenticate()
  })
  .then(() => {
    console.log("🔄 Database synchronization completed.🗂️");
    console.log("✅ All processes complete, server is ready! 🚀✨");
  })
  .catch((error: any) => {
    console.error("❌ Error connecting to DB:", error);
    // process.exit(1);
    throw error;
  });

export default sequelize;
