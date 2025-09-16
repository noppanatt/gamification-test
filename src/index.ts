import { initModels } from "@database/sequelize";
import express from "express";
import sequelize from "./database";
import { setupRoutes } from "./routes";
const app = express();
const port = process.env.APP_PORT || 3000;

initModels(sequelize);
setupRoutes(app);

// Start server
app.listen(port, () => {
  console.log(`🔥 Server is running on port ${port} 🔥`);
});

console.log("hello Gamification");
