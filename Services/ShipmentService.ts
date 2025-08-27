// src/server/storage.sequelize.ts
import { Op } from "sequelize";
import {
  Shipment as ShipmentModel,
} from "../Models";

import {
  type InsertShipment,
  type Shipment,
} from "@shared/schema";

import { IStorage } from "../Interface/IStorage";
import { IShipment } from "Interface/IShipment";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class ShipmentService implements IShipment {

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


}

export const shipment = new ShipmentService();
