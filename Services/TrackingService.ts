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
import { ITracking } from "Interface/ITracking";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class TrackingService implements ITracking {

    // TRACKING

    async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
      const s = await ShipmentModel.findOne({ where: { trackingNumber } });
      return s?.toJSON() as Shipment | undefined;
    }

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

}

export const tracking = new TrackingService();
