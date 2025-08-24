import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class ChatMessage extends Model<
  InferAttributes<ChatMessage>,
  InferCreationAttributes<ChatMessage>
> {
  declare id: CreationOptional<number>; // INT AUTO_INCREMENT
  declare userId: string | null;        // UUID nullable
  declare sessionId: string;
  declare role: "user" | "assistant" | "system";
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ChatMessage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: true },
    sessionId: { type: DataTypes.STRING(64), allowNull: false },
    role: { type: DataTypes.ENUM("user", "assistant", "system"), allowNull: false, defaultValue: "user" },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "chat_message" }
);
