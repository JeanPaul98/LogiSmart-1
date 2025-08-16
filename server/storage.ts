import {
  users,
  shipments,
  trackingEvents,
  documents,
  hsCodes,
  regulatoryAlerts,
  chatMessages,
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
import { db } from "./db";
import { eq, desc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Shipment operations
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  getShipment(id: string): Promise<Shipment | undefined>;
  getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
  getUserShipments(userId: string): Promise<Shipment[]>;
  updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment>;
  
  // Tracking operations
  addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
  getShipmentTracking(shipmentId: string): Promise<TrackingEvent[]>;
  
  // Document operations
  addDocument(document: InsertDocument): Promise<Document>;
  getShipmentDocuments(shipmentId: string): Promise<Document[]>;
  
  // HS Code operations
  searchHSCodes(query: string): Promise<HSCode[]>;
  getHSCode(code: string): Promise<HSCode | undefined>;
  
  // Regulatory alerts
  getActiveAlerts(): Promise<RegulatoryAlert[]>;
  
  // Chat operations
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Shipment operations
  async createShipment(shipmentData: InsertShipment): Promise<Shipment> {
    // Generate tracking number
    const trackingNumber = `LS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const [shipment] = await db
      .insert(shipments)
      .values({
        ...shipmentData,
        trackingNumber,
      })
      .returning();
    return shipment;
  }

  async getShipment(id: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber));
    return shipment;
  }

  async getUserShipments(userId: string): Promise<Shipment[]> {
    return await db
      .select()
      .from(shipments)
      .where(eq(shipments.userId, userId))
      .orderBy(desc(shipments.createdAt));
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    const [shipment] = await db
      .update(shipments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shipments.id, id))
      .returning();
    return shipment;
  }

  // Tracking operations
  async addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent> {
    const [trackingEvent] = await db
      .insert(trackingEvents)
      .values(event)
      .returning();
    return trackingEvent;
  }

  async getShipmentTracking(shipmentId: string): Promise<TrackingEvent[]> {
    return await db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.shipmentId, shipmentId))
      .orderBy(desc(trackingEvents.timestamp));
  }

  // Document operations
  async addDocument(document: InsertDocument): Promise<Document> {
    const [doc] = await db
      .insert(documents)
      .values(document)
      .returning();
    return doc;
  }

  async getShipmentDocuments(shipmentId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.shipmentId, shipmentId))
      .orderBy(desc(documents.createdAt));
  }

  // HS Code operations
  async searchHSCodes(query: string): Promise<HSCode[]> {
    return await db
      .select()
      .from(hsCodes)
      .where(
        like(hsCodes.description, `%${query}%`)
      )
      .limit(10);
  }

  async getHSCode(code: string): Promise<HSCode | undefined> {
    const [hsCode] = await db.select().from(hsCodes).where(eq(hsCodes.code, code));
    return hsCode;
  }

  // Regulatory alerts
  async getActiveAlerts(): Promise<RegulatoryAlert[]> {
    return await db
      .select()
      .from(regulatoryAlerts)
      .where(eq(regulatoryAlerts.isActive, true))
      .orderBy(desc(regulatoryAlerts.createdAt))
      .limit(5);
  }

  // Chat operations
  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.sessionId, sessionId)
        )
      )
      .orderBy(chatMessages.createdAt);
  }
}

export const storage = new DatabaseStorage();
