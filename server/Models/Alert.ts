import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class Alert extends Model<
  InferAttributes<Alert>,
  InferCreationAttributes<Alert>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare title: string;
  declare description: string;
  declare type: string;
  declare affectedCountries: string[] | null;
  declare affectedProducts: string[] | null;
  declare effectiveDate: Date | null;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Alert.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING(64), allowNull: false },
    affectedCountries: { type: DataTypes.JSON, allowNull: true },
    affectedProducts: { type: DataTypes.JSON, allowNull: true },
    effectiveDate: { type: DataTypes.DATE, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "alert" }
);
