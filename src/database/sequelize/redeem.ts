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
import { RewardModel } from "./reward";
import { UserModel } from "./user";

export class RedeemModel extends Model<
  InferAttributes<RedeemModel>,
  InferCreationAttributes<RedeemModel>
> {
  declare id: CreationOptional<string>;
  declare unit: number;
  declare redemptionPoints: number;
  declare name: string;
  declare registrationId: CreationOptional<string>;
  declare phoneNumber: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare address: string;

  declare shippingAddressId: CreationOptional<string>;
  declare userId: ForeignKey<UserModel["id"]>;
  declare rewardId: ForeignKey<RewardModel["id"]>;
  declare appMasterId: ForeignKey<AppMasterModel["id"]>;
  declare completedDate: CreationOptional<Date>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare user: NonAttribute<UserModel>;
  declare reward: NonAttribute<RewardModel>;
  declare appMaster: NonAttribute<AppMasterModel>;
}

export function initRedeemModel(sequelize: Sequelize) {
  RedeemModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      unit: {
        type: DataTypes.INTEGER,
      },
      redemptionPoints: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      registrationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shippingAddressId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, paranoid: true, modelName: "redeem" }
  );
}
