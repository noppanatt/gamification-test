import { Express, Router } from "express";
import multer from "multer";
import { incentiveController } from "../controllers/incentiveController";

const upload = multer({ storage: multer.memoryStorage() });

export function setupRoutes(app: Express) {
  const router = Router();

  router.get("/check", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  router.get("/customer-master", incentiveController.getCustomerMaster);

  //* Rule
  router.get("/rule", incentiveController.getRuleBook);

  router.put("/rule/active", incentiveController.toggleRuleStatus);

  router.patch("/rule/restore", incentiveController.restoreRule);

  router.delete("/rule", incentiveController.deleteRule);

  router.post("/rule", incentiveController.createGameRule);

  //* reward

  app.use("/incentive", router);
}
