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
  declare phoneNumber: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare address: string;

  declare shippingAddressId: CreationOptional<string>;
  declare userId: ForeignKey<UserModel["id"]>;
  declare rewardId: ForeignKey<RewardModel["id"]>;
  declare appMasterId: ForeignKey<AppMasterModel["id"]>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
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
      phoneNumber: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      shippingAddressId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize, paranoid: true, modelName: "redeem" }
  );
}
