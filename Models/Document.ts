import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class Document extends Model<
  InferAttributes<Document>,
  InferCreationAttributes<Document>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare shipmentId: number;           // FK INT
  declare type: string;
  declare filename: string;             // aligné avec Zod
  declare url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Document.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    shipmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.STRING(64), allowNull: false },
    filename: { type: DataTypes.STRING(255), allowNull: false },
    url: { type: DataTypes.STRING(1024), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "document" }
);
