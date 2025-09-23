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
  declare id: CreationOptional<number>;
  declare name: string;
  declare point: number;
  declare description: string;
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
      name: {
        type: DataTypes.STRING,
      },
      point: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
      termsAndCondition: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCreate: async (instance: RewardModel) => {
          if (!instance.id) {
            const max = await RewardModel.max("id").catch(() => 0);
            instance.id = (Number(max) || 0) + 1;
          }
        },
      },
      sequelize,
      modelName: "reward",
      paranoid: true,
    }
  );
}
