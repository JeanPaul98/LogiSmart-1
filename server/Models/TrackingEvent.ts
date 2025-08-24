import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class TrackingEvent extends Model<
  InferAttributes<TrackingEvent>,
  InferCreationAttributes<TrackingEvent>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare shipmentId: number;           // FK INT
  declare status: string;
  declare location: string;
  declare description: string | null;
  declare timestamp: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TrackingEvent.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    shipmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.STRING(64), allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "tracking_event" }
);
