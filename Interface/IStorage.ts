// src/server/storage/IStorage.ts
import {
    type User,
    type UpsertUser,
    type InsertShipment,
    type Shipment,
    type InsertTrackingEvent,
    type TrackingEvent,
    type InsertDocument,
    type Document,
    type InsertHSCode,
    type HSCode,
    type InsertRegulatoryAlert,
    type RegulatoryAlert,
    type InsertChatMessage,
    type ChatMessage,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IStorage {
    // Users
    getUser(id: string): Promise<User | undefined>;
    upsertUser(user: UpsertUser): Promise<User>;
  
    // Shipments
    createShipment(shipment: InsertShipment): Promise<Shipment>;
    getShipment(id: string | number): Promise<Shipment | undefined>;
    getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
    getUserShipments(userId: string): Promise<Shipment[]>;
    updateShipment(id: string | number, updates: Partial<Shipment>): Promise<Shipment>;
  
    // Tracking
    addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
    getShipmentTracking(shipmentId: number | string): Promise<TrackingEvent[]>;
  
    // Documents
    addDocument(document: InsertDocument): Promise<Document>;
    getShipmentDocuments(shipmentId: number | string): Promise<Document[]>;
  
    // HS Codes
    searchHSCodes(query: string): Promise<HSCode[]>;
    getHSCode(code: string): Promise<HSCode | undefined>;
  
    // Alerts
    getActiveAlerts(): Promise<RegulatoryAlert[]>;
  
    // Chat
    addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
    getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]>;
  }
  
  export type {
    User,
    UpsertUser,
    InsertShipment,
    Shipment,
    InsertTrackingEvent,
    TrackingEvent,
    InsertDocument,
    Document,
    InsertHSCode,
    HSCode,
    InsertRegulatoryAlert,
    RegulatoryAlert,
    InsertChatMessage,
    ChatMessage,
  };
  