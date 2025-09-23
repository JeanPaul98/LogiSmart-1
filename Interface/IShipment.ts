// src/server/storage/IStorage.ts
import {
    type InsertShipment,
    type Shipment,
    type InsertShipmentWithDocs,
    type InsertTrackingEvent,
  } from "@shared/schema";

  import { ShipmentDTO } from "../DTO/ShipmentDTO";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IShipment {
    // Shipments
    createShipment(shipmentData: InsertShipmentWithDocs): Promise<ShipmentDTO>
    getShipment(id: string | number): Promise<Shipment | undefined>;
    getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
    getUserShipments(userId: string): Promise<Shipment[]>;

  }
  
  export type {
    InsertShipment,
    Shipment,
    InsertTrackingEvent,
  };
  