// src/server/storage/IStorage.ts
import {
    type InsertRegulatoryAlert,
    type RegulatoryAlert,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IAlerts {
    // Alerts
    getActiveAlerts(): Promise<RegulatoryAlert[]>;
  }
  
  export type {
    InsertRegulatoryAlert,
    RegulatoryAlert,
  };
  