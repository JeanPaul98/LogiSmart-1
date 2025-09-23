// src/server/Services/ShipmentService.ts
import { AppDataSource } from "../dbContext/db";                    // ⬅️ assure le bon chemin
import { Shipment as ShipmentEntity } from "../Models/Shipment"; // ⬅️ entité TypeORM
import type { InsertShipmentWithDocs, Shipment } from "@shared/schema";
import { IShipment } from "../Interface/IShipment";
import { Document } from "../Models/Document";
import { In } from "typeorm";
import { ShipmentDTO } from "../DTO/ShipmentDTO";

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
  private docRepo = AppDataSource.getRepository(Document);
  
  async createShipment(shipmentData: InsertShipmentWithDocs): Promise<ShipmentDTO> {
    const trackingNumber = genTracking();
  
    // 1️⃣ Créer l’expédition
    const entity = this.repo.create({
      ...shipmentData,
      trackingNumber,
      status: shipmentData.status ?? "draft",
    });
    const saved = await this.repo.save(entity);
  
    let docs: Document[] = [];
    if (shipmentData.documentIds && shipmentData.documentIds.length > 0) {
      docs = await this.docRepo.findBy({
        id: In(shipmentData.documentIds),
        shipmentId: undefined, // récupère uniquement les temporaires
      });
  
      for (const doc of docs) {
        doc.shipmentId = saved.id;
      }
      await this.docRepo.save(docs);
    }
  
    const shipmentDTO: ShipmentDTO = {
      ...saved,
      documents: docs,
      documentIds: docs.map((d) => d.id),
    };
  
    return shipmentDTO;
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

}

export const shipment = new ShipmentService();
