import { Sequelize } from "sequelize";
import { AppMasterModel, initAppMasterModel } from "./appMaster";
import { initCustomerMasterModel } from "./customerMaster";
import { GameModel, initGameModel } from "./game";
import { initRedeemModel, RedeemModel } from "./redeem";
import { initRewardModel, RewardModel } from "./reward";
import { initRewardFileModel, RewardFileModel } from "./rewardFile";
import { initRuleBookModel, RuleBookModel } from "./ruleBook";
import { initUserModel, UserModel } from "./user";

export const initModels = (sequelize: Sequelize) => {
  initAppMasterModel(sequelize);
  initCustomerMasterModel(sequelize);
  initRewardModel(sequelize);

  //* User
  initUserModel(sequelize);
  AppMasterModel.hasMany(UserModel, { as: "users", foreignKey: "appMasterId" });
  UserModel.belongsTo(AppMasterModel, {
    as: "appMaster",
    foreignKey: "appMasterId",
  });

  initRewardFileModel(sequelize);
  RewardModel.hasMany(RewardFileModel, {
    as: "rewardFiles",
    foreignKey: "rewardId",
  });
  RewardFileModel.belongsTo(RewardModel, {
    as: "reward",
    foreignKey: "rewardId",
  });

  //* RuleBook
  initRuleBookModel(sequelize);
  RuleBookModel.belongsTo(AppMasterModel, {
    as: "app",
    foreignKey: "appMasterId",
  });

  //* Game
  initGameModel(sequelize);
  RuleBookModel.hasMany(GameModel, {
    as: "games",
    foreignKey: "ruleBookId",
  });
  GameModel.belongsTo(AppMasterModel, {
    as: "app",
    foreignKey: "appMasterId",
  });
  GameModel.belongsTo(RuleBookModel, {
    as: "ruleBook",
    foreignKey: "ruleBookId",
  });

  //* Redeem
  initRedeemModel(sequelize);
  AppMasterModel.hasMany(RedeemModel, {
    as: "redeems",
    foreignKey: "appMasterId",
  });
  RedeemModel.belongsTo(AppMasterModel, {
    as: "appMaster",
    foreignKey: "appMasterId",
  });
  UserModel.hasMany(RedeemModel, {
    as: "redeems",
    foreignKey: "userId",
  });
  RedeemModel.belongsTo(UserModel, {
    as: "user",
    foreignKey: "userId",
  });
  RewardModel.hasMany(RedeemModel, {
    as: "redeems",
    foreignKey: "rewardId",
  });
  RedeemModel.belongsTo(RewardModel, {
    as: "reward",
    foreignKey: "rewardId",
  });
};
