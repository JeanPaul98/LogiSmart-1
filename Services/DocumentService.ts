// src/server/storage.typeorm.document.ts
import { AppDataSource } from "../dbContext/db";
import { Document as DocumentEntity } from "../entities/Document";
import type { InsertDocument, Document as DocumentDTO } from "@shared/schema";
import { IDocument } from "../Interface/IDocument";

// helper: convertir proprement vers number
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

/**
 * Service TypeORM pour la gestion des documents rattachés aux shipments.
 * Implémente l’interface IDocument.
 */
export class DocumentService implements IDocument {
  private repo = AppDataSource.getRepository(DocumentEntity);

  /**
   * Crée un nouveau document lié à un shipment existant.
   *
   * Métier :
   * - Chaque document correspond à une pièce jointe logistique
   *   (ex. facture, packing list, bill of lading).
   * - On rattache obligatoirement ce document à un `shipmentId`.
   * - Permet de centraliser la traçabilité documentaire pour un envoi.
   *
   * Cas d’usage :
   * - Lorsqu’un utilisateur ou un agent ajoute un justificatif
   *   à un envoi (PDF, image, etc.).
   */
  async addDocument(input: InsertDocument): Promise<DocumentDTO> {
    const payload = {
      ...input,
      shipmentId: toNum(input.shipmentId as unknown as number | string),
    };

    const entity = this.repo.create(payload);
    const saved = await this.repo.save(entity);
    return saved as unknown as DocumentDTO;
  }

  /**
   * Récupère tous les documents liés à un shipment.
   *
   * Métier :
   * - Permet de visualiser l’historique documentaire associé à un envoi.
   * - Les documents sont triés par `createdAt` décroissant
   *   → les plus récents apparaissent en premier.
   *
   * Cas d’usage :
   * - Afficher la liste des documents dans le suivi d’un colis.
   * - Vérifier qu’un envoi contient bien tous les justificatifs requis.
   */
  async getShipmentDocuments(shipmentId: number | string): Promise<DocumentDTO[]> {
    const rows = await this.repo.find({
      where: { shipmentId: toNum(shipmentId) },
      order: { createdAt: "DESC" },
    });
    return rows as unknown as DocumentDTO[];
  }
}

export const document = new DocumentService();
