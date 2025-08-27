import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../sever_config";
import { User } from "./User";

export class ChatSession extends Model<InferAttributes<ChatSession>, InferCreationAttributes<ChatSession>> {
  declare id: CreationOptional<string>;
  declare userId: string;                 // doit matcher User.id (UUID)
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ChatSession.init(
  {
    id: {
      type: DataTypes.STRING(64),         // OK pour l’id de session
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,               // <= ICI: même type que User.id
      allowNull: false,
      references: { model: "user", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "chat_session",
    underscored: false,
    timestamps: true,
  }
);

// Association (si tu les déclares ici)
ChatSession.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ChatSession, { foreignKey: "userId", as: "sessions" });
