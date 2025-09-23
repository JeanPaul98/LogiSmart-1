// server/dtos/ShipmentDTO.ts
import { Shipment } from "../Models/Shipment";
import { Document } from "../Models/Document";

export type ShipmentDTO = Shipment & {
  // IDs des documents associés, utile côté frontend
  documentIds?: number[];
  // Optionnel : on peut aussi inclure les documents complets
  documents?: Document[];
};
