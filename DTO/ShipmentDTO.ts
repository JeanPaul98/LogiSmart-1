// server/dtos/ShipmentDTO.ts
import { Shipment } from "../Models/Shipment";
import { Document } from "../Models/Document";

export type ShipmentDTO = Shipment & {
  // IDs des documents associés, utile côté frontend
  documentIds?: number[];
  // Optionnel : on peut aussi inclure les documents complets
  documents?: Document[];
};



export type CreateShipmentDTO = {
  userId: string;
  trackingNumber: string;
  senderName: string; senderEmail: string; senderAddress: string; senderPhone: string;
  recipientName: string; recipientEmail: string; recipientAddress: string; recipientPhone: string;
  description: string; sensTransi: string;
  weight: number; volume?: number | null; value: number; nbColis: number | string; hsCode?: string | null;
  enlevDate?: string;
  transportMode: "air" | "sea" | "road" | string;
  originCity: string; destinationCity: string;
  status?: "draft" | "confirmed" | "in_transit" | "customs_clearance" | "delivered" | "cancelled";
  totalCost: number; customsDuty?: number | null; vat?: number | null;
  documentIds?: number[];
};
