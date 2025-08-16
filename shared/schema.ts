import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  preferredLanguage: varchar("preferred_language").default("fr"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transport modes
export const transportModeEnum = pgEnum("transport_mode", ["air", "sea", "road"]);

// Shipment status
export const shipmentStatusEnum = pgEnum("shipment_status", [
  "draft",
  "confirmed",
  "in_transit",
  "customs_clearance",
  "delivered",
  "cancelled"
]);

// Shipments table
export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: varchar("tracking_number").unique().notNull(),
  userId: varchar("user_id").references(() => users.id),
  
  // Sender information
  senderName: varchar("sender_name").notNull(),
  senderEmail: varchar("sender_email").notNull(),
  senderAddress: text("sender_address").notNull(),
  senderPhone: varchar("sender_phone"),
  
  // Recipient information
  recipientName: varchar("recipient_name").notNull(),
  recipientEmail: varchar("recipient_email").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  recipientPhone: varchar("recipient_phone"),
  
  // Package information
  description: text("description").notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  volume: decimal("volume", { precision: 10, scale: 4 }),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  hsCode: varchar("hs_code"),
  
  // Transport details
  transportMode: transportModeEnum("transport_mode").notNull(),
  originCity: varchar("origin_city").notNull(),
  destinationCity: varchar("destination_city").notNull(),
  estimatedDelivery: timestamp("estimated_delivery"),
  
  // Status and pricing
  status: shipmentStatusEnum("status").default("draft"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  customsDuty: decimal("customs_duty", { precision: 10, scale: 2 }),
  vat: decimal("vat", { precision: 10, scale: 2 }),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracking events
export const trackingEvents = pgTable("tracking_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipmentId: varchar("shipment_id").references(() => shipments.id),
  status: varchar("status").notNull(),
  location: varchar("location").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipmentId: varchar("shipment_id").references(() => shipments.id),
  type: varchar("type").notNull(), // 'commercial_invoice', 'customs_declaration', 'bill_of_lading', etc.
  filename: varchar("filename").notNull(),
  url: varchar("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// HS Codes database
export const hsCodes = pgTable("hs_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").unique().notNull(),
  description: text("description").notNull(),
  dutyRate: decimal("duty_rate", { precision: 5, scale: 2 }),
  vatRate: decimal("vat_rate", { precision: 5, scale: 2 }),
  category: varchar("category"),
  restrictions: text("restrictions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Regulatory alerts
export const regulatoryAlerts = pgTable("regulatory_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // 'duty_change', 'product_ban', 'license_requirement', etc.
  affectedCountries: jsonb("affected_countries"),
  affectedProducts: jsonb("affected_products"),
  effectiveDate: timestamp("effective_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages for AI chatbot
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  role: varchar("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  chatMessages: many(chatMessages),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  user: one(users, {
    fields: [shipments.userId],
    references: [users.id],
  }),
  trackingEvents: many(trackingEvents),
  documents: many(documents),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [trackingEvents.shipmentId],
    references: [shipments.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [documents.shipmentId],
    references: [shipments.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingEventSchema = createInsertSchema(trackingEvents).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertHSCodeSchema = createInsertSchema(hsCodes).omit({
  id: true,
  createdAt: true,
});

export const insertRegulatoryAlertSchema = createInsertSchema(regulatoryAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertHSCode = z.infer<typeof insertHSCodeSchema>;
export type HSCode = typeof hsCodes.$inferSelect;
export type InsertRegulatoryAlert = z.infer<typeof insertRegulatoryAlertSchema>;
export type RegulatoryAlert = typeof regulatoryAlerts.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
