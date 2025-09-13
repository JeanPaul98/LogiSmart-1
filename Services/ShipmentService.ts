// src/server/Services/ShipmentService.ts
import { AppDataSource } from "../dbContext/db";                    // ⬅️ assure le bon chemin
import { Shipment as ShipmentEntity } from "../entities/Shipment"; // ⬅️ entité TypeORM
import type { InsertShipment, Shipment } from "@shared/schema";
import { IShipment } from "../Interface/IShipment";

// helper conversion
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

// génération simple d’un tracking number
const genTracking = () =>
  `LS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

export class ShipmentService implements IShipment {
  private repo = AppDataSource.getRepository(ShipmentEntity);

  async createShipment(shipmentData: InsertShipment): Promise<Shipment> {
    const trackingNumber = genTracking();
    const entity = this.repo.create({
      ...shipmentData,
      trackingNumber,
      status: (shipmentData as any).status ?? "draft",
    });
    const saved = await this.repo.save(entity);
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
    const merged = this.repo.merge(existing, updates);
    const saved = await this.repo.save(merged);
    return saved as unknown as Shipment;
  }
}

export const shipment = new ShipmentService();
