
import { Op } from "sequelize";
import {
  Document as DocumentModel,
} from "../Models";

import {
  type InsertDocument,
  type Document,
} from "@shared/schema";

import { IStorage } from "../Interface/IStorage";
import { IDocument } from "Interface/IDocument";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class DocumentService implements IDocument {


    // DOCUMENTS
    async addDocument(document: InsertDocument): Promise<Document> {
      const d = await DocumentModel.create({
        ...document,
        shipmentId: toNum(document.shipmentId as unknown as number | string),
      });
      return d.toJSON() as Document;
    }

    async getShipmentDocuments(shipmentId: number | string): Promise<Document[]> {
      const rows = await DocumentModel.findAll({
        where: { shipmentId: toNum(shipmentId) },
        order: [["createdAt", "DESC"]],
      });
      return rows.map(r => r.toJSON() as Document);
    }


}

export const document = new DocumentService();
