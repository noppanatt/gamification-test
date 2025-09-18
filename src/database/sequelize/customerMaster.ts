import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { ESegment } from "src/enums/segment.enum";

export class CustomerMasterModel extends Model<
  InferAttributes<CustomerMasterModel>,
  InferCreationAttributes<CustomerMasterModel>
> {
  declare id: CreationOptional<number>;
  declare segment: CreationOptional<ESegment>;
  declare score: CreationOptional<string>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initCustomerMasterModel(sequelize: Sequelize) {
  return CustomerMasterModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      segment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      score: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (instance: CustomerMasterModel) => {
          if (!instance.id) {
            const max = await CustomerMasterModel.max("id").catch(() => 0);
            instance.id = (Number(max) || 0) + 1;
          }
        },
      },
      sequelize,
      modelName: "customer_master",
      tableName: "customer_master",
      paranoid: true,
    }
  );
}
