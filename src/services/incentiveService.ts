import { Op } from "sequelize";
import * as XLSX from "xlsx";
import sequelize from "../database/index";
import { AppMasterModel } from "../database/sequelize/appMaster";
import { RedeemModel } from "../database/sequelize/redeem";
import { RewardModel } from "../database/sequelize/reward";
import { UserModel } from "../database/sequelize/user";
import { EFormField } from "../enums/form-field.enum";
import { dateToStringYYYMMDD } from "../utils/date";
import { TRedeemSchema } from "../validation/redeem";

const DEFAULT_SENDER_NAME = process.env.DEFAULT_SENDER_NAME;
const FORM_BASE_URL = process.env.FORM_BASE_URL;

const FORM_FIELDS = {
  [EFormField.customerId]: process.env.FORM_CUSTOMER_ID!,
  [EFormField.date]: process.env.FORM_DATE!,
  [EFormField.completeTime]: process.env.FORM_COMPLETE_TIME!,
  [EFormField.startTime]: process.env.FORM_START_TIME!,
  [EFormField.name]: process.env.FORM_FULL_NAME!,
  [EFormField.phoneNumber]: process.env.FORM_PHONE_NO!,
  [EFormField.email]: process.env.FORM_EMAIL!,
  [EFormField.address]: process.env.FORM_ADDRESS!,
  [EFormField.rewardId]: process.env.FORM_REWARD_ID!,
  [EFormField.unit]: process.env.FORM_UNIT!,
};
const FORM_ID = process.env.FORM_ID;
const FORM_REDEEM_SHEET_URL = process.env.FORM_REDEEM_SHEET_URL;

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
    const today = new Date();
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
          registrationId: body?.registrationId,
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
    const completeTime = new Date();
    //* Update to form
    // const urlParams = new URLSearchParams();
    // urlParams.append("id", FORM_ID ?? "");

    // const fields = Object.keys(FORM_FIELDS).map((key) => ({
    //   fieldName: key,
    //   value: "AA",
    //   fieldId: FORM_FIELDS[key as keyof typeof FORM_FIELDS],
    //   description: `Form field ${key.replace("field", "")}`,
    // }));

    // fields.map((data) => {
    //   switch (data.fieldName) {
    //     case EFormField.customerId:
    //       urlParams.append(FORM_FIELDS.customerId, user.id);
    //       break;
    //     case EFormField.date:
    //       const formattedDate = dateToStringDDMMYYYY(today);
    //       urlParams.append(FORM_FIELDS.date, formattedDate);
    //       break;
    //     case EFormField.completeTime:
    //       const formattedCompleteTime = dateTimeToString(completeTime);
    //       urlParams.append(FORM_FIELDS.completeTime, formattedCompleteTime);
    //       break;
    //     case EFormField.startTime:
    //       const formattedStartTime = dateTimeToString(today);
    //       urlParams.append(FORM_FIELDS.startTime, formattedStartTime);
    //       break;
    //     case EFormField.rewardId:
    //       urlParams.append(FORM_FIELDS.rewardId, reward.name);
    //       break;
    //     default:
    //       const fieldId =
    //         FORM_FIELDS[data.fieldName as keyof typeof FORM_FIELDS];
    //       if (fieldId) {
    //         const fieldValue =
    //           String(body[data.fieldName as keyof TRedeemSchema]) ?? "";

    //         urlParams.append(data.fieldId, fieldValue);
    //       }
    //       break;
    //   }
    // });

    // const formUrl = `${FORM_BASE_URL}?${urlParams.toString()}`;

    // // * Send Email
    // const templatePath = path.join(
    //   __dirname,
    //   "..",
    //   "emails",
    //   "reward-redemption.ejs"
    // );

    // const html = fs.readFileSync(templatePath, "utf-8");
    // const htmlFormat = ejs.render(html, { url: FORM_REDEEM_SHEET_URL });

    // const emailData: TEmailData = {
    //   html: htmlFormat,
    //   subject: "Reward Redemption Notification",
    //   to: [
    //     "noppanat.b@codemonday.com",
    //     "ThipwipaN@betagro.com",
    //     "nassaroon.b@codemonday.com",
    //     "thodsaphon.s@codemonday.com",
    //   ],
    //   sender: {
    //     name: "Retail Web Stockmovement",
    //     email: "smtp_stockmovement@betagro.com",
    //   },
    //   cc: [
    //     "nassaroon.b@codemonday.com",
    //     "thodsaphon.s@codemonday.com",
    //     "noppanat.b@codemonday.com",
    //   ],
    // };
    // const { success, message, actualSender, error, messageId } =
    //   await sendEmail(emailData);
  },
  generateDailyRedeemSheetBuffer: async (rows: any[], day: Date) => {
    const dayString = dateToStringYYYMMDD(day);
    const workbook = XLSX.utils.book_new();
    const fileName = `Reward-Redemption-${dayString}.xlsx`;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, dayString);

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return { buffer, fileName };
  },

  getRedeemExportByIds: async (ids: string[]) => {
    return RedeemModel.findAndCountAll({
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
        "registrationId",
        "completedDate",
      ],
      include: [
        {
          model: RewardModel,
          as: "reward",
          attributes: ["id", "rewardId", "name", "points"],
          paranoid: false,
        },
      ],
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      order: [["createdAt", "DESC"]],
    });
  },
};
