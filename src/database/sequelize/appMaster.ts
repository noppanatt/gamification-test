import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

export class AppMasterModel extends Model<
  InferAttributes<AppMasterModel>,
  InferCreationAttributes<AppMasterModel>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initAppMasterModel(sequelize: Sequelize) {
  AppMasterModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (instance: AppMasterModel) => {
          if (!instance.id) {
            const max = await AppMasterModel.max("id").catch(() => 0);
            instance.id = (Number(max) || 0) + 1;
          }
        },
      },
      sequelize,
      modelName: "app_master",
      tableName: "app_master",
      paranoid: true,
    }
  );
}
