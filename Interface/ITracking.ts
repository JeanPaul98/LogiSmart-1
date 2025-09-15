import {
    type InsertTrackingEvent,
    type TrackingEvent,
    TrackingEvent as TrackingEventDTO,
    Shipment as ShipmentDTO,

  } from "@shared/schema";
  import { ApiResponse } from "../playload/ResponseApi";


  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface ITracking {
   
    // Tracking
    addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEventDTO>;
    getShipmentByTracking(trackingNumber: string): Promise<ShipmentDTO | null>;
    getShipmentTracking(shipmentId: number | string): Promise<TrackingEventDTO[]>;
  }
  
  export type {
    InsertTrackingEvent,
    TrackingEvent,
  };
  