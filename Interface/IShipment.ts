// src/server/storage/IStorage.ts
import {
    type InsertShipment,
    type Shipment,
    type InsertTrackingEvent,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IShipment {
    // Shipments
    createShipment(shipment: InsertShipment): Promise<Shipment>;
    getShipment(id: string | number): Promise<Shipment | undefined>;
    getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
    getUserShipments(userId: string): Promise<Shipment[]>;
    updateShipment(id: string | number, updates: Partial<Shipment>): Promise<Shipment>;

  }
  
  export type {
    InsertShipment,
    Shipment,
    InsertTrackingEvent,
  };
  