import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  literal,
  Model,
  NonAttribute,
  UUIDV4,
} from "sequelize";

export class GameMasterModel extends Model<
  InferAttributes<GameMasterModel>,
  InferCreationAttributes<GameMasterModel>
> {
  declare id: CreationOptional<number>;
  declare gameName: CreationOptional<string>;
  declare ruleDescription: CreationOptional<string>;
  declare structure: CreationOptional<string>;

  declare updatedAt: NonAttribute<Date>;
  declare createdAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export const gameMasterColumns = {
  id: {
    type: DataTypes.UUIDV4,
    default: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  gameName: "",
  ruleDescription: "",
  structure: "",

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
