import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import sequelize from "../database/index";
import { CustomerMasterModel } from "../database/sequelize/customerMaster";
import { GameModel } from "../database/sequelize/game";
import { RewardModel } from "../database/sequelize/reward";
import { RuleBookModel } from "../database/sequelize/ruleBook";
import { rewardService } from "../services/rewardService";
import { errorResponseHandler } from "../utils/errorResponseHandler";
import customResponse from "../utils/response";
import { CreateRewardSchema, editRewardSchema } from "../validation/reward";
import {
  CreateGameRuleBody,
  CreateGameRuleBodySchema,
  editGameRuleSchema,
  getGameRuleSchema,
} from "../validation/rulebook";

export const incentiveController = {
  uploadFile: async (req: Request, res: Response) => {
    try {
      console.log("CT:", req.headers["content-type"]);
      console.log("is multipart?", req.is("multipart/form-data"));
      console.log("body keys:", Object.keys(req.body || {}));
      console.log("file:", !!req.file, req.file?.mimetype, req.file?.size);

      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
      let xlsxData;
      if (data.length) {
        xlsxData = data.map((row) => {
          return Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.replace(/\s+/g, ""),
              value,
            ])
          );
        });
      }

      return customResponse(res, 200, {
        message: "Upload OK",
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        data: xlsxData?.slice(0, 10),
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  getCustomerMaster: async (req: Request, res: Response) => {
    try {
      const result = await CustomerMasterModel.findAll();

      return customResponse(res, 200, { result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  createGameRule: async (
    req: Request<any, any, CreateGameRuleBody>,
    res: Response
  ) => {
    const transaction = await sequelize.transaction();
    try {
      const parsed = CreateGameRuleBodySchema.parse(req.body);

      if (parsed?.data.length) {
        const ruleBookPayload = {
          id: uuidv4(),
          fileName: parsed.fileName ?? null,
          active: false,
          appMasterId: 1,
        };

        const ruleBook = await RuleBookModel.create(
          ruleBookPayload as unknown as RuleBookModel,
          {
            transaction,
          }
        );

        const gamesPayload = parsed.data.map((r) => ({
          id: uuidv4(),
          gameId: r.gameId,
          gameMasterDataId: r.gameMasterDataId ?? null,
          customerMasterDataId: r.customerMasterDataId ?? null,
          version: r.version ?? null,
          trafficPercentage: r.trafficPercentage ?? null,
          page: r.page ?? null,
          durationDays: r.durationDays ?? null,
          point: r.point ?? null,
          rewardIds: r.rewardId,
          dropOffDays: r.dropOffDays != null ? String(r.dropOffDays) : null,
          pushMessage: r.pushMessage ?? null,
          timeToPush: r.timeToPush ? new Date(r.timeToPush) : null,
          startDate: r?.startDate ? new Date(r.startDate) : null,
          endDate: r?.endDate ? new Date(r.endDate) : null,
          active: r.active ?? false,
          appMasterId: ruleBook.appMasterId,
          ruleBookId: ruleBook.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await GameModel.bulkCreate(gamesPayload as any[], { transaction });
        await transaction.commit();

        return customResponse(res, 201, {
          ok: true,
          ruleBookId: ruleBook.id,
          createdGames: gamesPayload.length,
        });
      }
    } catch (e) {
      await transaction.rollback();

      errorResponseHandler(e, req, res);
    }
  },
  getRuleBook: async (req: Request, res: Response) => {
    try {
      const params = getGameRuleSchema.parse(req.query);

      const result = await RuleBookModel.findAll({
        where: { appMasterId: params.appId },
        include: [
          {
            model: GameModel,
            as: "games",
          },
        ],
      });

      return customResponse(res, 200, { rules: result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  toggleRuleStatus: async (req: Request, res: Response) => {
    try {
      const params = editGameRuleSchema.parse(req.query);

      const rule = await RuleBookModel.findOne({
        where: { id: params.ruleId, appMasterId: params.appId },
        attributes: ["id", "active", "appMasterId"],
      });

      if (!rule) {
        return customResponse(res, 404, {
          message: `RuleID: ${params.ruleId} not found.`,
        });
      }

      await RuleBookModel.update(
        { active: !rule.active },
        { where: { id: rule.id, appMasterId: rule.appMasterId } }
      );

      return customResponse(res, 201, { newActive: !rule.active });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  deleteRule: async (req: Request, res: Response) => {
    try {
      const params = editGameRuleSchema.parse(req.query);
      const { appId, ruleId } = params;

      const rule = await RuleBookModel.findOne({
        where: { id: ruleId, appMasterId: appId },
        attributes: ["id", "active", "appMasterId"],
      });

      if (!rule) {
        return customResponse(res, 404, {
          message: `RewardID: ${ruleId} not found.`,
        });
      }

      await RuleBookModel.destroy({
        where: { id: ruleId, appMasterId: appId },
      });

      return customResponse(res, 201, {
        message: `Delete rewardID: ${ruleId} completed.`,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  restoreRule: async (req: Request, res: Response) => {
    try {
      const params = editGameRuleSchema.parse(req.query);
      const { appId, ruleId } = params;

      const rule = await RuleBookModel.findOne({
        where: { id: ruleId, appMasterId: appId },
        attributes: ["id", "active", "appMasterId"],
        paranoid: false,
      });

      if (!rule) {
        return customResponse(res, 404, {
          message: `RuleID: ${ruleId} not found.`,
        });
      }

      await RuleBookModel.restore({
        where: { id: ruleId, appMasterId: appId },
      });

      return customResponse(res, 201, {
        message: `Restore ruleID: ${ruleId} completed.`,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  getPreSignUploadUrl: async (req: Request, res: Response) => {
    try {
      const blob = await rewardService.getUploadPreSignUrl();

      return customResponse(res, 200, { blob });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  createReward: async (req: Request, res: Response) => {
    try {
      const parsed = CreateRewardSchema.parse(req.body);

      await RewardModel.create(parsed);

      return customResponse(res, 201);
    } catch (e) {
      errorResponseHandler(e, req, res);
    }
  },

  getReward: async (req: Request, res: Response) => {
    try {
      const result = await RewardModel.findAll();

      return customResponse(res, 200, { rewards: result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  editReward: async (req: Request, res: Response) => {
    try {
      const params = editRewardSchema.parse(req.query);
      const parsed = CreateRewardSchema.parse(req.body);

      const reward = await RewardModel.findOne({
        where: { id: params.rewardId },
        attributes: ["id", "name", "point", "description", "termsAndCondition"],
      });

      if (!reward) {
        return customResponse(res, 404, {
          message: `RewardID: ${params.rewardId} not found.`,
        });
      }

      await RewardModel.update(
        {
          name: parsed.name,
          point: parsed.point,
          description: parsed.description,
          termsAndCondition: parsed.termsAndCondition,
        },
        { where: { id: reward.id } }
      );

      return customResponse(res, 201, {
        message: `updated rewardId : ${reward.id} success`,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  deleteReward: async (req: Request, res: Response) => {
    try {
      const params = editRewardSchema.parse(req.query);
      const { rewardId } = params;

      const reward = await RewardModel.findOne({
        where: { id: rewardId },
        attributes: ["id", "name", "point", "description", "termsAndCondition"],
      });

      if (!reward) {
        return customResponse(res, 404, {
          message: `RewardID: ${rewardId} not found.`,
        });
      }

      await RewardModel.destroy({
        where: { id: rewardId },
      });

      return customResponse(res, 201, {
        message: `Delete ruleID: ${rewardId} completed.`,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  getDetailReward: async (req: Request, res: Response) => {
    try {
      const params = editRewardSchema.parse(req.query);
      const { rewardId } = params;

      if (!rewardId) {
        return customResponse(res, 404, {
          message: `RewardID: ${rewardId} not found.`,
        });
      }

      const reward = await RewardModel.findOne({
        where: { id: rewardId },
        attributes: ["id", "name", "point", "description", "termsAndCondition"],
      });

      return customResponse(res, 201, { reward: reward });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
};
