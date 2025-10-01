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

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare coin: CreationOptional<number>;
  declare referenceId: string;
  declare appMasterId: ForeignKey<AppMasterModel["id"]>;

  declare appMaster: NonAttribute<AppMasterModel>;
  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      coin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      referenceId: {
        type: DataTypes.UUID,
      },
    },
    { sequelize, paranoid: true, modelName: "user" }
  );
}
