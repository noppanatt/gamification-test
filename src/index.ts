import express from "express";
import { setupRoutes } from "./routes";
const app = express();
const port = process.env.APP_PORT || 3000;

setupRoutes(app);

// Start server
export default app;
// app.listen(port, () => {
//   console.log(`🔥 Server is running on port ${port} 🔥`);
// });

// console.log("hello Gamification");
