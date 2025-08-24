// User peut rester en UUID string (lié à ton auth)
import {
  Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sever_config";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string | null;
  declare firstName: string | null;
  declare lastName: string | null;
  declare profileImageUrl: string | null;
  declare preferredLanguage: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,               // => CHAR(36) BINARY
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: true },
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    profileImageUrl: { type: DataTypes.STRING, allowNull: true },
    preferredLanguage: { type: DataTypes.STRING, allowNull: false, defaultValue: "fr" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "user",
    underscored: false,
    timestamps: true,
  }
);