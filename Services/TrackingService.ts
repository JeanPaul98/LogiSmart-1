// src/server/storage.typeorm.tracking.ts
import { AppDataSource } from "../dbContext/db";
import { Shipment as ShipmentEntity } from "../Models/Shipment";
import { TrackingEvent as TrackingEventEntity } from "../Models/TrackingEvent";

import type {
  InsertTrackingEvent,
  TrackingEvent as TrackingEventDTO,
  Shipment as ShipmentDTO,
} from "@shared/schema";

import { ITracking } from "../Interface/ITracking";

// helper: conversion sûre vers number
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class TrackingService implements ITracking {
  /** Retourne un shipment par trackingNumber */
  async getShipmentByTracking(trackingNumber: string): Promise<ShipmentDTO | undefined> {
    const repo = AppDataSource.getRepository(ShipmentEntity);
    const row = await repo.findOne({ where: { trackingNumber } });
    return (row ?? undefined) as unknown as ShipmentDTO | undefined;
  }

  /** Ajoute un TrackingEvent et met à jour le statut du Shipment (transactionnel) */
  async addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEventDTO> {
    const shipmentId = toNum(event.shipmentId as number | string);

    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const teRepo = qr.manager.getRepository(TrackingEventEntity);
      const shRepo = qr.manager.getRepository(ShipmentEntity);

      // ⚠️ Vérifier que le shipment existe
      const shipment = await shRepo.findOne({ where: { id: shipmentId } });
      if (!shipment) {
        throw Object.assign(new Error("Shipment not found"), { status: 404 });
      }

      // Créer l’événement (timestamp par défaut: now)
      const teEntity = teRepo.create({
        ...event,
        shipmentId,
        timestamp: event.timestamp ?? new Date(),
      });
      const saved = await teRepo.save(teEntity);

      // Mettre à jour le statut si présent
      if (event.status) {
        await shRepo.update({ id: shipmentId }, { status: event.status as any });
      }

      await qr.commitTransaction();
      return saved as unknown as TrackingEventDTO;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  /** Liste des TrackingEvents d’un shipment (ordonnés par timestamp DESC puis id DESC) */
  async getShipmentTracking(shipmentId: number | string): Promise<TrackingEventDTO[]> {
    const repo = AppDataSource.getRepository(TrackingEventEntity);
    const rows = await repo.find({
      where: { shipmentId: toNum(shipmentId) },
      order: { timestamp: "DESC", id: "DESC" },
    });
    return rows as unknown as TrackingEventDTO[];
  }
}

export const tracking = new TrackingService();
