import { Sequelize } from "sequelize";
import { AppMasterModel, initAppMasterModel } from "./appMaster";
import { initCustomerMasterModel } from "./customerMaster";
import { GameModel, initGameModel } from "./game";
import { initRewardModel, RewardModel } from "./reward";
import { initRewardFileModel, RewardFileModel } from "./rewardFile";
import { initRuleBookModel, RuleBookModel } from "./ruleBook";

export const initModels = (sequelize: Sequelize) => {
  initAppMasterModel(sequelize);
  initCustomerMasterModel(sequelize);
  initRewardModel(sequelize);

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
};
