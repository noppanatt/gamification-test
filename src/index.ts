import dotenv from "dotenv";
import express from "express";
import { initModels } from "src/database/sequelize";
import sequelize from "./database";
import { setupRoutes } from "./routes";

const env = dotenv.config();
const app = express();
const port = env.parsed?.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

initModels(sequelize);

//* Uncomment to start server LOCAL ONLY
// app.listen(port, () => {
//   console.log(`🔥 Server is running on port ${port} 🔥`);
// });

export default app;
