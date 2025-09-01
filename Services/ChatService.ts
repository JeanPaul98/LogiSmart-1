// src/server/storage.sequelize.ts
import { Op } from "sequelize";
import {
  ChatMessage as ChatMessageModel,
} from "../Models";

import {
  type InsertChatMessage,
  type ChatMessage,
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

export const chatService = new ChatService();
