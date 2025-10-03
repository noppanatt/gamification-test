import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
  UUIDV4,
} from "sequelize";

export class RewardModel extends Model<
  InferAttributes<RewardModel>,
  InferCreationAttributes<RewardModel>
> {
  declare id: CreationOptional<string>;
  declare rewardId: CreationOptional<string>;
  declare name: string;
  declare points: number;
  declare description: string;
  declare active: CreationOptional<boolean>;
  declare isDraft: CreationOptional<boolean>;
  declare termsAndCondition: string;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initRewardModel(sequelize: Sequelize) {
  RewardModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      rewardId: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      points: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
      termsAndCondition: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDraft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (instance: RewardModel) => {
          if (!instance.rewardId) {
            const max = await RewardModel.max("rewardId").catch(() => 0);
            const current = Number(String(max).replace("R-", "")) || 0;
            const next = current + 1;

            instance.rewardId = `R-${String(next).padStart(3, "0")}`;
          }
        },
      },
      sequelize,
      modelName: "reward",
      paranoid: true,
    }
  );
}
