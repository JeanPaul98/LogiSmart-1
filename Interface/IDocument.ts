import {
    type InsertDocument,
    type Document,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IDocument {
    // Documents
    addDocument(document: InsertDocument): Promise<Document>;
    getShipmentDocuments(shipmentId: number | string): Promise<Document[]>;
  
  }
  
  export type {
    InsertDocument,
    Document,
  };
  