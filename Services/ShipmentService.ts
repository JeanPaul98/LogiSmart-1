// src/server/Services/ShipmentService.ts
import { AppDataSource } from "../dbContext/db";                    // ⬅️ assure le bon chemin
import { Shipment as ShipmentEntity } from "../Models/Shipment"; // ⬅️ entité TypeORM
import type { Shipment } from "@shared/schema";
import { IShipment } from "../Interface/IShipment";
import { Document } from "../Models/Document";
import {  } from "../Models/Shipment";
import { In, IsNull } from "typeorm";
import { CreateShipmentDTO } from "../DTO/ShipmentDTO";



export type ShipmentStatus =
  | "draft"
  | "registered"
  | "confirmed"
  | "in_transit"
  | "customs_clearance"
  | "delivered"
  | "cancelled";

const normalize = (v: string): ShipmentStatus => {
  const s = v.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  // protège si statut inconnu → on jette une erreur plus claire
  const known: ShipmentStatus[] = [
    "draft",
    "registered",
    "confirmed",
    "in_transit",
    "customs_clearance",
    "delivered",
    "cancelled",
  ];
  if (!known.includes(s as ShipmentStatus)) {
    throw new Error(`Statut "${v}" invalide. Autorisés: ${known.join(", ")}`);
  }
  return s as ShipmentStatus;
};

// transitions métier autorisées
const ALLOWED: Partial<Record<ShipmentStatus, ShipmentStatus[]>> = {
  draft: ["registered", "cancelled"],
  registered: ["confirmed", "cancelled"],
  confirmed: ["in_transit", "cancelled"],
  in_transit: ["customs_clearance", "delivered", "cancelled"],
  customs_clearance: ["in_transit", "delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};




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

  async createShipment(payload: CreateShipmentDTO) {

    const trackingNumber = genTracking();

      // 1) Création du shipment
      const shipment = this.repo.create({
        userId: payload.userId,

        senderName:       payload.senderName,
        senderEmail:      payload.senderEmail,
        senderAddress:    payload.senderAddress,
        senderPhone:      payload.senderPhone,
        trackingNumber,
        recipientName:    payload.recipientName,
        recipientEmail:   payload.recipientEmail,
        recipientAddress: payload.recipientAddress,
        recipientPhone:   payload.recipientPhone,

        description:      payload.description,
        sensTransi:       payload.sensTransi,

        weight:           Number(payload.weight) || 0,
        volume:           payload.volume ?? null,
        value:            Number(payload.value) || 0,
        nbColis:          Number(payload.nbColis) || 0,
        hsCode:           payload.hsCode ?? null,

        enlevDate:        payload.enlevDate ? new Date(payload.enlevDate) : null,
        transportMode:    payload.transportMode,
        originCity:       payload.originCity,
        destinationCity:  payload.destinationCity,

        status:           payload.status,

        totalCost:        Number(payload.totalCost) || 0,
        customsDuty:      payload.customsDuty ?? null,
        vat:              payload.vat ?? null,
      });

      const saved = await this.repo.save(shipment);

      // 2) Rattacher les documents temporaires si fournis
      if (Array.isArray(payload.documentIds) && payload.documentIds.length > 0) {
        // On ne rattache que les documents non liés (shipmentId IS NULL)
        const docs = await this.docRepo.find({
          where: {
            id: In(payload.documentIds),
            shipmentId: IsNull(),
          },
        });

        if (docs.length !== payload.documentIds.length) {
          throw new Error(
            "Un ou plusieurs documents sont introuvables ou déjà rattachés à un envoi."
          );
        }

        await this.docRepo
          .createQueryBuilder()
          .update(Document)
          .set({ shipmentId: saved.id })
          .whereInIds(payload.documentIds)
          .execute();
      }

      // 3) Relire le shipment avec ses documents liés
      const withDocs = await this.repo.findOne({
        where: { id: saved.id },
        relations: ["documents"],
      });

      return withDocs!; // on sait qu'il existe
    };
  

     async updateStatus(shipmentId: number, nextStatusRaw: string) {
    if (!Number.isFinite(shipmentId)) throw new Error("shipmentId invalide");

    const shipment = await this.repo.findOne({ where: { id: shipmentId } });
    if (!shipment) throw new Error("Shipment introuvable");

    const current = normalize(String(shipment.status || "draft"));
    const next = normalize(nextStatusRaw);

    if (current === next) return shipment; // rien à faire

    const allowedNext = ALLOWED[current] || [];
    if (!allowedNext.includes(next)) {
      throw new Error(`Transition interdite: ${current} → ${next}`);
    }

    shipment.status = next;
    await this.repo.save(shipment);
    return shipment;
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

export const shipmentService = new ShipmentService();
