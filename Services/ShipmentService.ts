// src/server/storage.typeorm.shipment.ts
import { AppDataSource } from "../dbContext/db";
import { Shipment as ShipmentEntity } from "../Models/Shipment";
import type { InsertShipment, Shipment } from "@shared/schema";
import { IShipment } from "../Interface/IShipment";

// helper: conversions sûres vers number
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};


export class ShipmentService implements IShipment {
  private repo = AppDataSource.getRepository(ShipmentEntity);

  // SHIPMENTS
  async createShipment(shipmentData: InsertShipment): Promise<Shipment> {
    const trackingNumber = genTracking();

    const entity = this.repo.create({
      ...shipmentData,
      trackingNumber,
      status: (shipmentData as any).status ?? "draft", // garde le défaut si omis
    });

    const saved = await this.repo.save(entity);
    // Entité ≈ DTO : mapping direct
    return saved as unknown as Shipment;
  }

  async getShipment(id: string | number): Promise<Shipment | undefined> {
    const row = await this.repo.findOne({ where: { id: toNum(id) } });
    return (row ?? undefined) as unknown as Shipment | undefined;
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const row = await this.repo.findOne({ where: { trackingNumber } });
    return (row ?? undefined) as unknown as Shipment | undefined;
  }

  async getUserShipments(userId: string): Promise<Shipment[]> {
    const rows = await this.repo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return rows as unknown as Shipment[];
  }

  async updateShipment(id: string | number, updates: Partial<Shipment>): Promise<Shipment> {
    const numericId = toNum(id);
    const existing = await this.repo.findOne({ where: { id: numericId } });
    if (!existing) throw new Error("Shipment not found");

    // merge ne modifie pas id/trackingNumber sauf si explicitement passé
    const merged = this.repo.merge(existing, updates);
    const saved = await this.repo.save(merged);
    return saved as unknown as Shipment;
  }
}

// helper: génération simple d'un tracking number
const genTracking = () =>
  `LS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;


export const shipment = new ShipmentService();
