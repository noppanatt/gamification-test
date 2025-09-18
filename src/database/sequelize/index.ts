import { Sequelize } from "sequelize";
import { appMasterModel, initAppMasterModel } from "./appMaster";
import { initCustomerMasterModel } from "./customerMaster";
import { GameModel, initGameModel } from "./game";
import { initRuleBookModel, RuleBookModel } from "./ruleBook";

export const initModels = (sequelize: Sequelize) => {
  initAppMasterModel(sequelize);
  initCustomerMasterModel(sequelize);

  //* RuleBook
  initRuleBookModel(sequelize);
  RuleBookModel.belongsTo(appMasterModel, {
    as: "app",
    foreignKey: "appMasterId",
  });

  //* Game
  initGameModel(sequelize);
  RuleBookModel.hasMany(GameModel, {
    as: "games",
    foreignKey: "ruleBookId",
  });
  GameModel.belongsTo(appMasterModel, {
    as: "app",
    foreignKey: "appMasterId",
  });
  GameModel.belongsTo(RuleBookModel, {
    as: "ruleBook",
    foreignKey: "ruleBookId",
  });
};
