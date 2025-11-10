import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";
import sequelize from "../database/index";
import { AppMasterModel } from "../database/sequelize/appMaster";
import { RedeemModel } from "../database/sequelize/redeem";
import { RewardModel } from "../database/sequelize/reward";
import { UserModel } from "../database/sequelize/user";
import { sendEmail, TEmailData } from "../utils/mailer";
import { TRedeemSchema } from "../validation/redeem";

const DEFAULT_SENDER_NAME = process.env.DEFAULT_SENDER_NAME;

export const incentiveService = {
  getUserByReferenceId: async (referenceId: string, appMasterId: number) =>
    await UserModel.findOne({
      where: { referenceId, appMasterId },
      include: [
        { model: AppMasterModel, as: "appMaster", attributes: ["id", "name"] },
      ],
    }),

  getAllUserPoint: async (appMasterId: number) =>
    await UserModel.findAll({
      where: { appMasterId },
      include: [
        { model: AppMasterModel, as: "appMaster", attributes: ["id", "name"] },
      ],
    }),
  redeemReward: async (
    body: TRedeemSchema,
    reward: RewardModel,
    user: UserModel
  ) => {
    //* redemption
    await sequelize.transaction(async (transaction) => {
      //* create redeem
      await RedeemModel.create(
        {
          name: body.name,
          phoneNumber: body.phoneNumber,
          email: body?.email,
          address: body.address,
          unit: body.unit,
          redemptionPoints: reward.points,
          rewardId: reward.id,
          appMasterId: body.appMasterId,
          shippingAddressId: body?.shippingAddressId,
          userId: user.id,
        },
        { transaction }
      );

      //* deduct balance points
      await UserModel.decrement("points", {
        by: reward.points,
        where: {
          id: user.id,
          appMasterId: body.appMasterId,
        },
        transaction,
      });
    });

    //* Update to form

    //* Send Email
    const templatePath = path.join(
      __dirname,
      "..",
      "emails",
      "reward-redemption.ejs"
    );
    const html = fs.readFileSync(templatePath, "utf-8");
    const htmlFormat = ejs.render(html);

    const emailData: TEmailData = {
      html: htmlFormat,
      subject: "Reward Redemption Notification",
      to: [
        "ThipwipaN@betagro.com",
        "nassaroon.b@codemonday.com",
        "thodsapon.s@codemonday.com",
      ],
      sender: {
        name: "Retail Web Stockmovement",
        email: "smtp_stockmovement@betagro.com",
      },
      cc: [
        "nassaroon.b@codemonday.com",
        "thodsapon.s@codemonday.com",
        "noppanat.b@codemonday.com",
      ],
    };

    const { success, message, actualSender, error, messageId } =
      await sendEmail(emailData);

    console.log({ success, message, actualSender, error, messageId });
  },
};
