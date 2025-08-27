// @shared/schema.ts
import { z } from "zod";

/* ===========================
  Enums
  =========================== */
export const transportModeEnum = z.enum(["air", "sea", "road"]);
export const shipmentStatusEnum = z.enum([
  "draft",
  "confirmed",
  "in_transit",
  "customs_clearance",
  "delivered",
  "cancelled",
]);

/* ===========================
  Sessions
  =========================== */
export const sessionSchema = z.object({
  sid: z.string(),
  sess: z.unknown(),
  expire: z.coerce.date(),
});
export type Session = z.infer<typeof sessionSchema>;

/* ===========================
  Users (id reste UUID)
  =========================== */
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional().nullable(),
  password: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  preferredLanguage: z.string().default("fr"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type User = z.infer<typeof userSchema>;
export type UpsertUser = z.infer<typeof insertUserSchema> & { id?: string };

/* ===========================
  Shipments (id en int auto)
  =========================== */
export const shipmentSchema = z.object({
  id: z.number().int().optional(),          // INT AUTO_INCREMENT
  trackingNumber: z.string(),
  userId: z.string().uuid().optional().nullable(),  // FK -> users.id (UUID)

  senderName: z.string(),
  senderEmail: z.string().email(),
  senderAddress: z.string(),
  senderPhone: z.string().optional().nullable(),

  recipientName: z.string(),
  recipientEmail: z.string().email(),
  recipientAddress: z.string(),
  recipientPhone: z.string().optional().nullable(),

  description: z.string(),
  weight: z.coerce.number(),
  volume: z.coerce.number().optional().nullable(),
  value: z.coerce.number(),
  hsCode: z.string().optional().nullable(),

  transportMode: transportModeEnum,
  originCity: z.string(),
  destinationCity: z.string(),
  estimatedDelivery: z.coerce.date().optional().nullable(),

  status: shipmentStatusEnum.default("draft"),
  totalCost: z.coerce.number().optional().nullable(),
  customsDuty: z.coerce.number().optional().nullable(),
  vat: z.coerce.number().optional().nullable(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const insertShipmentSchema = shipmentSchema.omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type Shipment = z.infer<typeof shipmentSchema>;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;

/* ===========================
  Tracking Events (id en int auto)
  =========================== */
export const trackingEventSchema = z.object({
  id: z.number().int().optional(),
  shipmentId: z.coerce.number().int(),   // FK int
  status: z.string(),
  location: z.string(),
  description: z.string().optional().nullable(),
  timestamp: z.coerce.date().default(new Date()),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
});

export const insertTrackingEventSchema = trackingEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type TrackingEvent = z.infer<typeof trackingEventSchema>;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;

/* ===========================
  Documents (id en int auto)
  =========================== */
export const documentSchema = z.object({
  id: z.number().int().optional(),
  shipmentId: z.coerce.number().int(),   // FK int
  type: z.string(),
  filename: z.string(),
  url: z.string().url(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
});

export const insertDocumentSchema = documentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type Document = z.infer<typeof documentSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

/* ===========================
  HS Codes (id en int auto)
  =========================== */
export const hsCodeSchema = z.object({
  id: z.number().int().optional(),
  code: z.string(),
  description: z.string(),
  dutyRate: z.coerce.number().optional().nullable(),
  vatRate: z.coerce.number().optional().nullable(),
  category: z.string().optional().nullable(),
  restrictions: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
});

export const insertHSCodeSchema = hsCodeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type HSCode = z.infer<typeof hsCodeSchema>;
export type InsertHSCode = z.infer<typeof insertHSCodeSchema>;

/* ===========================
  Regulatory Alerts (id en int auto)
  =========================== */
export const regulatoryAlertSchema = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  affectedCountries: z.array(z.string()).optional().nullable(),
  affectedProducts: z.array(z.string()).optional().nullable(),
  effectiveDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
});

export const insertRegulatoryAlertSchema = regulatoryAlertSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type RegulatoryAlert = z.infer<typeof regulatoryAlertSchema>;
export type InsertRegulatoryAlert = z.infer<typeof insertRegulatoryAlertSchema>;

/* ===========================
  Chat Messages (id en int auto)
  =========================== */
export const chatMessageSchema = z.object({
  id: z.number().int().optional(),
  userId: z.string().uuid().optional().nullable(),
  sessionId: z.string(),
  role: z.enum(["user", "assistant", "system"]).default("user"),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
});

export const insertChatMessageSchema = chatMessageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
