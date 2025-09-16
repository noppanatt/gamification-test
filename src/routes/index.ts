import { Express, Router } from "express";
import multer from "multer";
import { incentiveController } from "src/controllers/incentiveController";

const upload = multer();

export function setupRoutes(app: Express) {
  const router = Router();

  router.get("/check", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  router.post("/upload", upload.single("file"), incentiveController.uploadFile);

  app.use("/incensive", router);
}
