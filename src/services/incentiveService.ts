import { AppMasterModel } from "../database/sequelize/appMaster";
import { UserModel } from "../database/sequelize/user";

export const incentiveService = {
  getUserByReferenceId: async (referenceId: string, appMasterId: number) =>
    await UserModel.findOne({
      where: { referenceId, appMasterId },
      include: [
        { model: AppMasterModel, as: "appMaster", attributes: ["id", "name"] },
      ],
    }),
};
