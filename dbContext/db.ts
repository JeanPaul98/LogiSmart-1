// src/db/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Shipment } from "../entities/Shipment";
import { TrackingEvent } from "../entities/TrackingEvent";
import { Document } from "../entities/Document";
import { Alert } from "../entities/Alert";
import { HSCode } from "../entities/HSCode";
import { ChatSession } from "../entities/ChatSession";
import { ChatMessage } from "../entities/ChatMessage";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "logismart",
  // ajoutez vos entités ici
  entities: [User, Shipment, TrackingEvent, Document, Alert, HSCode, ChatSession, ChatMessage],
  synchronize: true, // ✅ en prod: toujours false
  dropSchema: true, // ❌ en prod: toujours false

  logging: process.env.NODE_ENV === "development",
});
