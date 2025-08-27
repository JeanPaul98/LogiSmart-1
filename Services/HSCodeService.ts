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
import { IHSCodes } from "Interface/IHSCodes";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class HSCodeService implements IHSCodes {

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


}

export const hscode = new HSCodeService();
