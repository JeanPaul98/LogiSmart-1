import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class HSCode extends Model<
  InferAttributes<HSCode>,
  InferCreationAttributes<HSCode>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare code: string;
  declare description: string;
  declare dutyRate: number | null;
  declare vatRate: number | null;
  declare category: string | null;
  declare restrictions: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

HSCode.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    dutyRate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    vatRate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    category: { type: DataTypes.STRING(255), allowNull: true },
    restrictions: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "hs_code" }
);
