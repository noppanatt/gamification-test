import axios, { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { OrderItem } from "sequelize";
import { ERuleOrderBy } from "src/enums/rule.enum";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import sequelize from "../database/index";
import { AppMasterModel } from "../database/sequelize/appMaster";
import { CustomerMasterModel } from "../database/sequelize/customerMaster";
import { GameModel } from "../database/sequelize/game";
import { RedeemModel } from "../database/sequelize/redeem";
import { RewardModel } from "../database/sequelize/reward";
import { RewardFileModel } from "../database/sequelize/rewardFile";
import { RuleBookModel } from "../database/sequelize/ruleBook";
import { UserModel } from "../database/sequelize/user";
import { EUpdatePointMethod } from "../enums/update-point.enum";
import { incentiveService } from "../services/incentiveService";
import { rewardService } from "../services/rewardService";

import { errorResponseHandler } from "../utils/errorResponseHandler";
import gcpService from "../utils/google-cloud";
import customResponse from "../utils/response";
import { GetRedeemSchema, RedeemSchema } from "../validation/redeem";
import { CreateRewardSchema, editRewardSchema } from "../validation/reward";
import {
  CreateGameRuleBody,
  CreateGameRuleBodySchema,
  editGameRuleSchema,
  getGameRuleSchema,
} from "../validation/rulebook";
import {
  getAllUserPointSchema,
  getUserPointSchema,
  updateRewardSchema,
} from "../validation/user";

export const incentiveController = {
  // uploadFile: async (req: Request, res: Response) => {
  //   try {
  //     console.log("CT:", req.headers["content-type"]);
  //     console.log("is multipart?", req.is("multipart/form-data"));
  //     console.log("body keys:", Object.keys(req.body || {}));
  //     console.log("file:", !!req.file, req.file?.mimetype, req.file?.size);

  //     if (!req.file) {
  //       return res.status(400).json({ error: "File is required" });
  //     }

  //     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];

  //     const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
  //     let xlsxData;
  //     if (data.length) {
  //       xlsxData = data.map((row) => {
  //         return Object.fromEntries(
  //           Object.entries(row).map(([key, value]) => [
  //             key.replace(/\s+/g, ""),
  //             value,
  //           ])
  //         );
  //       });
  //     }

  //     return customResponse(res, 200, {
  //       message: "Upload OK",
  //       filename: req.file.originalname,
  //       size: req.file.size,
  //       mimeType: req.file.mimetype,
  //       data: xlsxData?.slice(0, 10),
  //     });
  //   } catch (error) {
  //     errorResponseHandler(error, req, res);
  //   }
  // },
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
    res: Response,
  ) => {
    const transaction = await sequelize.transaction();
    try {
      const parsed = CreateGameRuleBodySchema.parse(req.body);

      if (!parsed.data.length) {
        await transaction.commit();
        return customResponse(res, 400, {
          message: "At least one rule is required.",
        });
      }

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
        },
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
        multiply: r.multiply ?? null,
        rewardIds: r.rewardId,
        dropOffDays: r.dropOffDays != null ? String(r.dropOffDays) : null,
        pushMessage: r.pushMessage ?? null,
        timeToPush: r.timeToPush ?? null,
        pushAmount: r.pushAmount ?? null,
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
    } catch (e) {
      await transaction.rollback();

      errorResponseHandler(e, req, res);
    }
  },
  getRuleBook: async (req: Request, res: Response) => {
    try {
      const { appId, direction, orderBy } = getGameRuleSchema.parse(req.query);
      const order: OrderItem[] = [];

      //* filter
      switch (orderBy) {
        case ERuleOrderBy.FileName:
          order.push(["fileName", direction]);
        case ERuleOrderBy.UpdatedAt:
          order.push(["updatedAt", direction]);
      }

      const result = await RuleBookModel.findAll({
        where: { appMasterId: appId },
        include: [
          {
            model: GameModel,
            as: "games",
          },
        ],
        order,
      });

      return customResponse(res, 200, { rules: result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  toggleRuleStatus: async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const params = editGameRuleSchema.parse(req.query);

      const rule = await RuleBookModel.findOne({
        where: { id: params.ruleId, appMasterId: params.appId },
        attributes: ["id", "active", "appMasterId"],
        include: [
          {
            model: GameModel,
            as: "games",
          },
        ],
      });

      if (!rule) {
        await transaction.rollback();
        return customResponse(res, 404, {
          message: `RuleID: ${params.ruleId} was not found.`,
        });
      }
      //* Toggle off all rule
      await RuleBookModel.update(
        { active: false },
        { where: { appMasterId: rule.appMasterId, active: true }, transaction },
      );

      //* Toggle on rule
      await RuleBookModel.update(
        { active: !rule.active },
        { where: { id: rule.id, appMasterId: rule.appMasterId }, transaction },
      );

      //* use update back to FARMSOOK
      try {
        const games = rule.games.map((game) => ({
          id: game.id,
          gameId: game?.gameId,
          gameMasterDataId: game?.gameMasterDataId,
          customerMasterDataId: game?.customerMasterDataId,
          version: game?.version,
          trafficPercentage: game?.trafficPercentage ?? 0,
          page: game?.page,
          durationDays: game?.durationDays ?? 0,
          point: game?.point ?? 0,
          multiple: game?.multiply,
          rewardIds: game?.rewardIds,
          dropOffDays: game?.dropOffDays,
          pushMessage: game?.pushMessage ?? "",
          pushAmount: game?.pushAmount,
          startDate: game?.startDate,
          endDate: game?.endDate,
        }));

        console.log("Update to FARMSOOK with new status:", !!rule.active);
        await axios.post(
          "https://uat.farmsookbyfarmtech.com/api/games/update-rules",
          { newActive: !rule.active, games },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error: any) {
        console.log({ error });
        throw error;
      }

      await transaction.commit();

      return customResponse(res, 201, { newActive: !rule.active });
    } catch (error) {
      await transaction.rollback();
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
          message: `RewardID: ${ruleId} was not found.`,
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
          message: `RuleID: ${ruleId} was not found.`,
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
  getPreSignDownloadUrl: async (req: Request, res: Response) => {
    try {
      req.body = z.object({ fileId: z.uuid() }).parse(req.query);
      const fileId = req.body?.fileId;

      const file = await RewardFileModel.findOne({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        return customResponse(res, 404, {
          message: `File ID ${fileId} was not found`,
        });
      }

      const generatedBlobName = rewardService.generateRewardBlobPath(fileId);
      const blobUrl = await gcpService.getPreSignedURL(
        "read",
        generatedBlobName,
      );

      return customResponse(res, 200, { blobObject: { blobUrl } });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  createReward: async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const parsed = CreateRewardSchema.parse(req.body);

      const reward = await RewardModel.create(
        {
          name: parsed.name,
          points: parsed.point,
          description: parsed.description,
          termsAndCondition: parsed.termsAndCondition,
          isDraft: parsed.isDraft,
          active: false,
        },
        {
          transaction,
        },
      );

      await RewardFileModel.create(
        {
          fileOriginalName: parsed.fileOriginalName,
          id: parsed.fileId,
          rewardId: reward.id,
        },
        {
          transaction,
        },
      );
      await transaction.commit();
      return customResponse(res, 201);
    } catch (e) {
      await transaction.rollback();
      errorResponseHandler(e, req, res);
    }
  },

  getReward: async (req: Request, res: Response) => {
    try {
      const result = await RewardModel.findAll({
        include: [
          {
            model: RewardFileModel,
            as: "rewardFiles",
            attributes: ["id", "fileOriginalName"],
          },
        ],
      });

      return customResponse(res, 200, { rewards: result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  editReward: async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const params = editRewardSchema.parse(req.query);
      const parsed = CreateRewardSchema.parse(req.body);

      const reward = await RewardModel.findOne({
        where: { id: params.rewardId },
        attributes: [
          "id",
          "name",
          "points",
          "description",
          "termsAndCondition",
        ],
        include: [
          {
            model: RewardFileModel,
            as: "rewardFiles",
          },
        ],
      });

      if (!reward) {
        await transaction.rollback();
        return customResponse(res, 404, {
          message: `RewardID: ${params.rewardId} was not found.`,
        });
      }

      await RewardModel.update(
        {
          name: parsed.name,
          points: parsed.point,
          description: parsed.description,
          termsAndCondition: parsed.termsAndCondition,
        },
        { where: { id: reward.id }, transaction },
      );

      const fileIdExist = reward.rewardFiles.find(
        (file) => file.id === parsed.fileId,
      );

      if (reward.rewardFiles.length === 0 && !fileIdExist) {
        await RewardFileModel.create(
          {
            id: parsed.fileId,
            fileOriginalName: parsed.fileOriginalName,
            rewardId: params.rewardId,
          },
          { transaction },
        );
      }

      if (reward.rewardFiles.length && !fileIdExist) {
        //* remove old file
        await RewardFileModel.destroy({
          where: {
            rewardId: params.rewardId,
          },
          transaction,
        });

        //* insert new file
        await RewardFileModel.create(
          {
            id: parsed.fileId,
            fileOriginalName: parsed.fileOriginalName,
            rewardId: params.rewardId,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return customResponse(res, 201, {
        message: `updated rewardId : ${reward.id} success`,
      });
    } catch (error) {
      await transaction.rollback();
      errorResponseHandler(error, req, res);
    }
  },

  deleteReward: async (req: Request, res: Response) => {
    try {
      const params = editRewardSchema.parse(req.query);
      const { rewardId } = params;

      const reward = await RewardModel.findOne({
        where: { id: rewardId },
        attributes: [
          "id",
          "name",
          "points",
          "description",
          "termsAndCondition",
        ],
      });

      if (!reward) {
        return customResponse(res, 404, {
          message: `RewardID: ${rewardId} was not found.`,
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
        return customResponse(res, HttpStatusCode.NotFound, {
          message: `RewardID: ${rewardId} was not found.`,
        });
      }

      const reward = await RewardModel.findOne({
        where: { id: rewardId },
        include: [
          {
            model: RewardFileModel,
            as: "rewardFiles",
            attributes: ["id", "fileOriginalName"],
          },
        ],
      });

      return customResponse(res, HttpStatusCode.Ok, { reward: reward });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },

  toggleRewardStatus: async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const params = editRewardSchema.parse(req.query);

      const reward = await RewardModel.findOne({
        where: { id: params.rewardId },
        attributes: ["id", "active"],
      });

      if (!reward) {
        await transaction.rollback();
        return customResponse(res, HttpStatusCode.NotFound, {
          message: `RewardID: ${params.rewardId} was not found.`,
        });
      }

      await RewardModel.update(
        { active: !reward.active, isDraft: false },
        { where: { id: reward.id }, transaction },
      );

      await transaction.commit();
      return customResponse(res, HttpStatusCode.Ok, {
        newActive: !reward.active,
      });
    } catch (error) {
      await transaction.rollback();
      errorResponseHandler(error, req, res);
    }
  },

  deleteRewardFile: async (req: Request, res: Response) => {
    try {
      req.body = z.object({ fileId: z.uuid() }).parse(req.query);
      const fileId = req.body?.fileId;

      const file = await RewardFileModel.findOne({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        return customResponse(res, HttpStatusCode.NotFound, {
          message: `File ID ${fileId} was not found`,
        });
      }

      await RewardFileModel.destroy({
        where: {
          id: fileId,
        },
      });

      return customResponse(res, HttpStatusCode.Ok);
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  getUserPointByUserId: async (req: Request, res: Response) => {
    try {
      const { referenceId, appMasterId } = getUserPointSchema.parse(req.query);

      const user = await incentiveService.getUserByReferenceId(
        referenceId,
        appMasterId,
      );

      const result = {
        userId: "",
        points: 0,
        app: "",
      };

      if (!user) {
        const userNew = await UserModel.create({
          referenceId,
          appMasterId: appMasterId,
        });

        await userNew.reload({
          include: [
            {
              model: AppMasterModel,
              as: "appMaster",
              attributes: ["id", "name"],
            },
          ],
        });

        result.userId = userNew.id;
        result.points = userNew.points;
        result.app = userNew.appMaster.name;

        return customResponse(res, HttpStatusCode.Ok, { result });
      }

      result.userId = user.id;
      result.points = user.points;
      result.app = user.appMaster.name;

      return customResponse(res, HttpStatusCode.Ok, { result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  getAllUserPoint: async (req: Request, res: Response) => {
    try {
      const { appMasterId } = getAllUserPointSchema.parse(req.query);
      const result = await incentiveService.getAllUserPoint(appMasterId);

      return customResponse(res, HttpStatusCode.Ok, { result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  updateUserPoint: async (req: Request, res: Response) => {
    try {
      const parsed = updateRewardSchema.parse(req.body);
      const referenceId = req.params?.referenceId;

      const { code, message } = await sequelize.transaction(
        async (transaction) => {
          const user = await UserModel.findOne({
            where: {
              referenceId,
              appMasterId: parsed.appMasterId,
            },
          });

          //* Increase points
          if (parsed.method === EUpdatePointMethod.INCREASE) {
            if (!user) {
              const user = await UserModel.create(
                {
                  referenceId,
                  appMasterId: parsed.appMasterId,
                },
                { transaction },
              );

              await UserModel.increment("points", {
                by: parsed.amount,
                where: {
                  referenceId: user.referenceId,
                  appMasterId: user.appMasterId,
                },
                transaction,
              });

              return {
                code: HttpStatusCode.Ok,
                message: "Successfully added points.",
              };
            }

            await UserModel.increment("points", {
              by: parsed.amount,
              where: {
                referenceId,
                appMasterId: parsed.appMasterId,
              },
              transaction,
            });

            return {
              code: HttpStatusCode.Ok,
              message: "Successfully added points.",
            };
          }

          //* Decrease points
          if (parsed.method === EUpdatePointMethod.DECREASE) {
            if (!user) {
              return {
                code: HttpStatusCode.InternalServerError,
                message: "Point deduction failed: user not found.",
              };
            }

            if (user.points < parsed.amount) {
              return {
                code: HttpStatusCode.InternalServerError,
                message: "Not enough points to deduct.",
              };
            }

            await UserModel.decrement("points", {
              by: parsed.amount,
              where: {
                referenceId,
                appMasterId: parsed.appMasterId,
              },
              transaction,
            });
          }

          return {
            code: HttpStatusCode.Ok,
            message: "Successfully added points.",
          };
        },
      );

      return customResponse(res, code, {
        message,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  getRedeemList: async (req: Request, res: Response) => {
    try {
      const { appMasterId } = GetRedeemSchema.parse(req.body);

      const result = await RedeemModel.findAll({
        where: {
          appMasterId,
        },
        attributes: [
          "id",
          "unit",
          "redemptionPoints",
          "name",
          "phoneNumber",
          "email",
          "address",
          "shippingAddressId",
          "createdAt",
          "rewardId",
        ],
        include: [
          {
            model: RewardModel,
            as: "reward",
            attributes: ["id", "rewardId", "name", "points"],
            paranoid: false,
          },
        ],
      });

      return customResponse(res, HttpStatusCode.Ok, { redeems: result });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
  redeemReward: async (req: Request, res: Response) => {
    try {
      //* parse
      const body = RedeemSchema.parse(req.body);
      const referenceId = req.params?.referenceId;

      //* check referenceId(farmerID) with UserId
      const user = await UserModel.findOne({
        where: {
          referenceId,
          appMasterId: body.appMasterId,
        },
      });

      if (!user) {
        return customResponse(res, HttpStatusCode.NotFound, {
          message: `userId: ${referenceId} was not found.`,
        });
      }

      //* check rewardId exist
      const reward = await RewardModel.findOne({
        where: {
          id: body.rewardId,
          active: true,
        },
      });

      if (!reward) {
        return customResponse(res, HttpStatusCode.NotFound, {
          message: `rewardId: ${body.rewardId} was not found.`,
        });
      }

      //* check point balance
      if (user.points < reward.points) {
        return customResponse(res, HttpStatusCode.BadRequest, {
          message: "Not enough points.",
        });
      }

      //* redemption
      const { formUrl } = await incentiveService.redeemReward(
        body,
        reward,
        user,
      );

      return customResponse(res, HttpStatusCode.Created, {
        message: "Reward redeemed successfully.",
        formUrl,
      });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
};
