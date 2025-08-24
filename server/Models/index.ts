// server/Models/index.ts
import { sequelize } from "../sever_config";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

/* ========== MODELS ========== */

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
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: true },
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    profileImageUrl: { type: DataTypes.STRING, allowNull: true },
    preferredLanguage: { type: DataTypes.STRING, allowNull: false, defaultValue: "fr" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "user", timestamps: true }
);

export class Shipment extends Model<InferAttributes<Shipment>, InferCreationAttributes<Shipment>> {
  declare id: CreationOptional<number>;
  declare trackingNumber: string;
  declare userId: string | null; // FK -> user.id (UUID)
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
    trackingNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: true },

    senderName: { type: DataTypes.STRING, allowNull: false },
    senderEmail: { type: DataTypes.STRING, allowNull: false },
    senderAddress: { type: DataTypes.TEXT, allowNull: false },
    senderPhone: { type: DataTypes.STRING, allowNull: true },

    recipientName: { type: DataTypes.STRING, allowNull: false },
    recipientEmail: { type: DataTypes.STRING, allowNull: false },
    recipientAddress: { type: DataTypes.TEXT, allowNull: false },
    recipientPhone: { type: DataTypes.STRING, allowNull: true },

    description: { type: DataTypes.TEXT, allowNull: false },
    weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    volume: { type: DataTypes.DECIMAL(10, 4), allowNull: true },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    hsCode: { type: DataTypes.STRING, allowNull: true },

    transportMode: { type: DataTypes.ENUM("air", "sea", "road"), allowNull: false },
    originCity: { type: DataTypes.STRING, allowNull: false },
    destinationCity: { type: DataTypes.STRING, allowNull: false },
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
  { sequelize, tableName: "shipment", timestamps: true }
);

export class TrackingEvent extends Model<InferAttributes<TrackingEvent>, InferCreationAttributes<TrackingEvent>> {
  declare id: CreationOptional<number>;
  declare shipmentId: number; // FK -> shipment.id (INT)
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
    status: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "tracking_event", timestamps: true }
);

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

export class Document extends Model<InferAttributes<Document>, InferCreationAttributes<Document>> {
  declare id: CreationOptional<number>;
  declare shipmentId: number; // FK -> shipment.id
  declare type: string;
  declare filename: string;
  declare url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Document.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    shipmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "document", timestamps: true }
);

export class HSCode extends Model<InferAttributes<HSCode>, InferCreationAttributes<HSCode>> {
  declare id: CreationOptional<number>;
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
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    dutyRate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    vatRate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    restrictions: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "hs_code", timestamps: true }
);

export class ChatSession extends Model<InferAttributes<ChatSession>, InferCreationAttributes<ChatSession>> {
  declare id: string; // ex: STRING(64)
  declare userId: string; // FK -> user.id (UUID)
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
ChatSession.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "chat_session", timestamps: true }
);

export class ChatMessage extends Model<InferAttributes<ChatMessage>, InferCreationAttributes<ChatMessage>> {
  declare id: CreationOptional<number>;
  declare userId: string | null; // FK -> user.id
  declare sessionId: string; // FK -> chat_session.id
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
  { sequelize, tableName: "chat_message", timestamps: true }
);

/* ========== ASSOCIATIONS ========== */

let _associated = false;

export function applyAssociations() {
  if (_associated) return;
  _associated = true;

  // User -> Shipments
  User.hasMany(Shipment, { as: "shipments", foreignKey: "userId", sourceKey: "id", onDelete: "SET NULL", onUpdate: "CASCADE" });
  Shipment.belongsTo(User, { as: "shipper", foreignKey: "userId", targetKey: "id" }); // alias unique "shipper"

  // Shipment -> TrackingEvents & Documents
  Shipment.hasMany(TrackingEvent, { as: "trackingEvents", foreignKey: "shipmentId", sourceKey: "id", onDelete: "CASCADE", onUpdate: "CASCADE" });
  TrackingEvent.belongsTo(Shipment, { as: "shipment", foreignKey: "shipmentId", targetKey: "id" });

  Shipment.hasMany(Document, { as: "documents", foreignKey: "shipmentId", sourceKey: "id", onDelete: "CASCADE", onUpdate: "CASCADE" });
  Document.belongsTo(Shipment, { as: "shipment", foreignKey: "shipmentId", targetKey: "id" });

  // Chat sessions/messages
  User.hasMany(ChatSession, { as: "chatSessions", foreignKey: "userId", sourceKey: "id", onDelete: "CASCADE", onUpdate: "CASCADE" });
  ChatSession.belongsTo(User, { as: "sessionUser", foreignKey: "userId", targetKey: "id" }); // alias unique "sessionUser"

  ChatSession.hasMany(ChatMessage, { as: "messages", foreignKey: "sessionId", sourceKey: "id", onDelete: "CASCADE", onUpdate: "CASCADE" });
  ChatMessage.belongsTo(ChatSession, { as: "session", foreignKey: "sessionId", targetKey: "id" });

  User.hasMany(ChatMessage, { as: "sentMessages", foreignKey: "userId", sourceKey: "id", onDelete: "SET NULL", onUpdate: "CASCADE" });
  ChatMessage.belongsTo(User, { as: "sender", foreignKey: "userId", targetKey: "id" }); // alias unique "sender"
}

/* Helper pour index.ts */
export async function initModelsAndAssociations() {
  applyAssociations();
  // la sync se fait ailleurs (server/index.ts)
}
