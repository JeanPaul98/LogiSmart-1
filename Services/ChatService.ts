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
} from "../Models";

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

import { IStorage } from "../Interface/IStorage";
import { IChat } from "Interface/IChat";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class ChatService implements IChat {

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

export const chat = new ChatService();
