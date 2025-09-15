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

  async addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEventDTO> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const shipmentId = toNum(event.shipmentId);
      const teRepo = qr.manager.getRepository(TrackingEventEntity);
      const shRepo = qr.manager.getRepository(ShipmentEntity);

      const shipment = await shRepo.findOne({ where: { id: shipmentId } });
      if (!shipment) throw new Error("Shipment not found");

      const teEntity = teRepo.create({
        ...event,
        shipmentId,
        timestamp: event.timestamp ?? new Date(),
      });
      const saved = await teRepo.save(teEntity);

      if (event.status) {
        await shRepo.update({ id: shipmentId }, { status: event.status as any });
      }

      await qr.commitTransaction();
      return saved as TrackingEventDTO;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async getShipmentTracking(shipmentId: number | string): Promise<TrackingEventDTO[]> {
    const repo = AppDataSource.getRepository(TrackingEventEntity);
    const rows = await repo.find({
      where: { shipmentId: toNum(shipmentId) },
      order: { timestamp: "DESC", id: "DESC" },
    });
    return rows as TrackingEventDTO[];
  }

  async getShipmentByTracking(trackingNumber: string): Promise<ShipmentDTO | null> {
    const repo = AppDataSource.getRepository(ShipmentEntity);
    const shipment = await repo.findOne({ where: { trackingNumber } });
    return shipment ? (shipment as ShipmentDTO) : null;
  }
}

export const tracking = new TrackingService();
