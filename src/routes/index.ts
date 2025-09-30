import { Express, Router } from "express";
import multer from "multer";
import { incentiveController } from "../controllers/incentiveController";

const upload = multer({ storage: multer.memoryStorage() });

export function setupRoutes(app: Express) {
  const router = Router();

  router.get("/check", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  app.get("/check/env", (_req, res) => {
    res.json({
      hasAccount: !!process.env.AZURE_STORAGE_ACCOUNT,
      hasContainer: !!process.env.AZURE_STORAGE_ACCOUNT_CONTAINER,
      hasKey: !!process.env.AZURE_STORAGE_KEY,
      hasSas: !!process.env.AZURE_STORAGE_SAS,
      nodeVersion: process.version,
    });
  });

  router.get("/customer-master", incentiveController.getCustomerMaster);

  //* Rule
  router.get("/rule", incentiveController.getRuleBook);

  router.put("/rule/active", incentiveController.toggleRuleStatus);

  router.patch("/rule/restore", incentiveController.restoreRule);

  router.delete("/rule", incentiveController.deleteRule);

  router.post("/rule", incentiveController.createGameRule);

  //* reward
  router.get("/reward", incentiveController.getDetailReward);
  router.post("/reward", incentiveController.createReward);
  router.get("/rewards", incentiveController.getReward);
  router.put("/reward", incentiveController.editReward);
  router.delete("/reward", incentiveController.deleteReward);
  router.get("/reward/upload", incentiveController.getPreSignUploadUrl);
  router.get("/reward/download", incentiveController.getPreSignDownloadUrl);

  app.use("/incentive", router);
}
