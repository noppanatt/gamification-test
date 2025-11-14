import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./database";
import { initModels } from "./database/sequelize/index";
import { setupRoutes } from "./routes";
import gcpService from "./utils/google-cloud";

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

initModels(sequelize);

(async () => {
  await gcpService.initiateCORS();
})();

//* Uncomment to start server LOCAL ONLY
// app.listen(port, () => {
//   console.log(`🔥 Server is running on port ${port} 🔥`);
// });

export default app;
