// src/db/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../Models/User";
import { Shipment } from "../Models/Shipment";
import { TrackingEvent } from "../Models/TrackingEvent";
import { Document } from "../Models/Document";
import { Alert } from "../Models/Alert";
import { HSCode } from "../Models/HSCode";
import { ChatSession } from "../Models/ChatSession";
import { ChatMessage } from "../Models/ChatMessage";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "logismart",
  // ajoutez vos entités ici
  entities: [User, Shipment, TrackingEvent, Document, Alert, HSCode, ChatSession, ChatMessage],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  synchronize: false, // ✅ en prod: toujours false
  logging: process.env.NODE_ENV === "development",
});
