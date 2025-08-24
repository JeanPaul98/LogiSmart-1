import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare trackingNumber: string;
  declare userId: string | null;        // FK -> users.id (UUID string)
  declare senderName: string;
  declare senderEmail: string;
  declare senderAddress: string;
  declare senderPhone: string | null;
  declare recipientName: string;
  declare recipientEmail: string;
  declare recipientAddress: string;
  declare recipientPhone: string | null;
  declare description: string;
  declare weight: number;
  declare volume: number | null;
  declare value: number;
  declare hsCode: string | null;
  declare transportMode: "air" | "sea" | "road";
  declare originCity: string;
  declare destinationCity: string;
  declare estimatedDelivery: Date | null;
  declare status: "draft" | "confirmed" | "in_transit" | "customs_clearance" | "delivered" | "cancelled";
  declare totalCost: number | null;
  declare customsDuty: number | null;
  declare vat: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Shipment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    trackingNumber: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: true },
    senderName: { type: DataTypes.STRING(255), allowNull: false },
    senderEmail: { type: DataTypes.STRING(255), allowNull: false },
    senderAddress: { type: DataTypes.STRING(1024), allowNull: false },
    senderPhone: { type: DataTypes.STRING(64), allowNull: true },
    recipientName: { type: DataTypes.STRING(255), allowNull: false },
    recipientEmail: { type: DataTypes.STRING(255), allowNull: false },
    recipientAddress: { type: DataTypes.STRING(1024), allowNull: false },
    recipientPhone: { type: DataTypes.STRING(64), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    volume: { type: DataTypes.DECIMAL(10, 4), allowNull: true },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    hsCode: { type: DataTypes.STRING(32), allowNull: true },
    transportMode: { type: DataTypes.ENUM("air", "sea", "road"), allowNull: false },
    originCity: { type: DataTypes.STRING(255), allowNull: false },
    destinationCity: { type: DataTypes.STRING(255), allowNull: false },
    estimatedDelivery: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("draft", "confirmed", "in_transit", "customs_clearance", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
    },
    totalCost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    customsDuty: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    vat: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "shipment" }
);
