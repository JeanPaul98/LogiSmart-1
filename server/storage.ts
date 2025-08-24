// src/server/storage.sequelize.ts
import { Op } from "sequelize";
import {
  User as UserModel,
  Shipment as ShipmentModel,
  TrackingEvent as TrackingEventModel,
  Document as DocumentModel,
  HSCode as HSCodeModel,
  Alert as RegulatoryAlertModel,
  ChatMessage as ChatMessageModel,
} from "./Models";

import {
  type User,
  type UpsertUser,
  type InsertShipment,
  type Shipment,
  type InsertTrackingEvent,
  type TrackingEvent,
  type InsertDocument,
  type Document,
  type HSCode,
  type InsertChatMessage,
  type ChatMessage,
  type RegulatoryAlert,
} from "@shared/schema";

import { IStorage } from "./Interface/IStorage";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class SequelizeStorage implements IStorage {


  // USERS
  async getUser(id: string): Promise<User | undefined> {
    const u = await UserModel.findByPk(id);
    return u?.toJSON() as User | undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // MySQL n’utilise pas réellement `returning`. Sequelize fera un select ensuite si besoin.
    const [u] = await UserModel.upsert({ ...userData });
    // Selon le dialecte, upsert peut retourner l’instance ou pas. On sécurise :
    if (!u) {
      // fallback: relire
      const reread = await UserModel.findByPk(userData.id);
      if (!reread) throw new Error("Failed to upsert user");
      return reread.toJSON() as User;
    }
    return u.toJSON() as User;
  }

  // SHIPMENTS
  async createShipment(shipmentData: InsertShipment): Promise<Shipment> {
    // Génère un trackingNumber stable si non fourni côté schéma
    const trackingNumber =
      `LS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

        const s = await ShipmentModel.create({
          ...shipmentData,
          trackingNumber,
          status: shipmentData.status ?? "draft", // <- au lieu de "Shipment created"
        });
    return s.toJSON() as Shipment;
  }

  async getShipment(id: string | number): Promise<Shipment | undefined> {
    const s = await ShipmentModel.findByPk(toNum(id));
    return s?.toJSON() as Shipment | undefined;
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const s = await ShipmentModel.findOne({ where: { trackingNumber } });
    return s?.toJSON() as Shipment | undefined;
  }

  async getUserShipments(userId: string): Promise<Shipment[]> {
    const rows = await ShipmentModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return rows.map(r => r.toJSON() as Shipment);
  }

  async updateShipment(id: string | number, updates: Partial<Shipment>): Promise<Shipment> {
    const s = await ShipmentModel.findByPk(toNum(id));
    if (!s) throw new Error("Shipment not found");
    await s.update({ ...updates });
    return s.toJSON() as Shipment;
  }

  // TRACKING
  async addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent> {
    // s’assurer que shipmentId est numérique
    const shipmentId = toNum(event.shipmentId as number | string);

    const te = await TrackingEventModel.create({
      ...event,
      shipmentId,
      timestamp: event.timestamp ?? new Date(),
    });
    
    // maj statut
    if (event.status) {
      await ShipmentModel.update(
        { status: event.status as any }, // ou cast typé
        { where: { id: shipmentId } }    // <- utilise shipmentId (number), pas event.shipmentId string
      );
    }

    return te.toJSON() as TrackingEvent;
  }

  async getShipmentTracking(shipmentId: number | string): Promise<TrackingEvent[]> {
    const rows = await TrackingEventModel.findAll({
      where: { shipmentId: toNum(shipmentId) },
      order: [["timestamp", "DESC"], ["id", "DESC"]],
    });
    return rows.map(r => r.toJSON() as TrackingEvent);
  }

  // DOCUMENTS
  async addDocument(document: InsertDocument): Promise<Document> {
    const d = await DocumentModel.create({
      ...document,
      shipmentId: toNum(document.shipmentId as unknown as number | string),
    });
    return d.toJSON() as Document;
  }

  async getShipmentDocuments(shipmentId: number | string): Promise<Document[]> {
    const rows = await DocumentModel.findAll({
      where: { shipmentId: toNum(shipmentId) },
      order: [["createdAt", "DESC"]],
    });
    return rows.map(r => r.toJSON() as Document);
  }

  // HS CODES
  async searchHSCodes(query: string): Promise<HSCode[]> {
    const like = `%${query}%`;
    const rows = await HSCodeModel.findAll({
      where: {
        [Op.or]: [
          { code: { [Op.like]: like } },
          { description: { [Op.like]: like } },
        ],
      },
      limit: 25,
      order: [["code", "ASC"]],
    });
    return rows.map(r => r.toJSON() as HSCode);
  }

  async getHSCode(code: string): Promise<HSCode | undefined> {
    const row = await HSCodeModel.findOne({ where: { code } }); // <- pas findByPk
    return row?.toJSON() as HSCode | undefined;
  }

  // REGULATORY ALERTS
  async getActiveAlerts(): Promise<RegulatoryAlert[]> {
    // Si ton modèle utilise `isActive`, on filtre simplement dessus.
    // Si tu as un champ `validUntil`, tu peux ajouter une condition date ici.
    const rows = await RegulatoryAlertModel.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return rows.map(r => r.toJSON() as RegulatoryAlert);
  }

  // CHAT
  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const m = await ChatMessageModel.create({ ...message });
    return m.toJSON() as ChatMessage;
  }

  async getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]> {
    const rows = await ChatMessageModel.findAll({
      where: { userId, sessionId },
      order: [["createdAt", "ASC"], ["id", "ASC"]],
    });
    return rows.map(r => r.toJSON() as ChatMessage);
  }
}

export const storage = new SequelizeStorage();
