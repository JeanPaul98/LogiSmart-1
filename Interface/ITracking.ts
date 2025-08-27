import {
    type InsertTrackingEvent,
    type TrackingEvent,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface ITracking {
   
    // Tracking
    addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
    getShipmentTracking(shipmentId: number | string): Promise<TrackingEvent[]>;
 
  }
  
  export type {
    InsertTrackingEvent,
    TrackingEvent,
  };
  