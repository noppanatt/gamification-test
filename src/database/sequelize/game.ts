import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
  UUIDV4,
} from "sequelize";
import { AppMasterModel } from "./appMaster";
import { RuleBookModel } from "./ruleBook";

export class GameModel extends Model<
  InferAttributes<GameModel>,
  InferCreationAttributes<GameModel>
> {
  declare id: CreationOptional<string>;
  declare gameId: CreationOptional<number>;
  declare gameMasterDataId: CreationOptional<string>;
  declare customerMasterDataId: CreationOptional<number>;
  declare version: CreationOptional<string>;
  declare trafficPercentage: CreationOptional<number>;
  //* Page maybe enums ?
  declare page: CreationOptional<string>;
  declare durationDays: CreationOptional<number>;
  declare point: CreationOptional<number>;
  declare rewardIds: CreationOptional<string>;
  declare dropOffDays: CreationOptional<string>;
  declare pushMessage: CreationOptional<string>;
  declare timeToPush: CreationOptional<Date>;
  declare startDate: CreationOptional<Date>;
  declare endDate: CreationOptional<Date>;
  declare active: CreationOptional<Boolean>;
  declare appMasterId: ForeignKey<AppMasterModel["id"]>;
  declare ruleBookId: ForeignKey<RuleBookModel["id"]>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initGameModel(sequelize: Sequelize) {
  GameModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gameMasterDataId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerMasterDataId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trafficPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      page: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      durationDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rewardIds: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dropOffDays: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pushMessage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timeToPush: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "game",
      paranoid: true,
    }
  );
}
