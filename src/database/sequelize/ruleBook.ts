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

export class RuleBookModel extends Model<
  InferAttributes<RuleBookModel>,
  InferCreationAttributes<RuleBookModel>
> {
  declare id: CreationOptional<string>;
  declare fileName: CreationOptional<string>;
  declare active: Boolean;
  declare appMasterId: ForeignKey<AppMasterModel["id"]>;

  declare createdAt: NonAttribute<Date>;
  declare updatedAt: NonAttribute<Date>;
  declare deletedAt: NonAttribute<Date>;
}

export function initRuleBookModel(sequelize: Sequelize) {
  RuleBookModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "rule_book",
      paranoid: true,
    }
  );
}
