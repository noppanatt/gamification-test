import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  literal,
  Model,
  Sequelize,
  UUIDV4,
} from "sequelize";

export class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare id: CreationOptional<string>;
  declare detail: CreationOptional<string>;
}

export const orderColumns = {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  detail: { type: DataTypes.STRING, allowNull: true },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP"),
  },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
};

export function initOrderModel(sequelize: Sequelize) {
  return OrderModel.init(orderColumns, {
    sequelize,
    modelName: "order",
    paranoid: true,
  });
}
