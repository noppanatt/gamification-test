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
import { RewardModel } from "./reward";

export class RewardFileModel extends Model<
  InferAttributes<RewardFileModel>,
  InferCreationAttributes<RewardFileModel>
> {
  declare id: CreationOptional<string>;
  declare fileOriginalName: string;
  declare rewardId: CreationOptional<ForeignKey<RewardModel["id"]>>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initRewardFileModel(sequelize: Sequelize) {
  return RewardFileModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        comment: "Primary key",
      },
      fileOriginalName: {
        type: DataTypes.STRING,
        comment: "File original name",
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "reward_file",
    }
  );
}
