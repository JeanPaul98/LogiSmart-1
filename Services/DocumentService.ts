import { Document } from "../Models/Document";
import { AppDataSource } from "../dbContext/db"; 
import fs from "fs";
import * as path from "path";
export class DocumentService {

    private repo = AppDataSource.getRepository(Document)


  // 1️⃣ Enregistrer un document après upload
  async saveDocument(file: Express.Multer.File, shipmentId: number) {
    const newDoc = this.repo.create({
      type: path.extname(file.originalname).replace(".", "").toUpperCase(),
      filename: file.originalname,
      url: `/uploads/documents/${file.filename}`,
      shipmentId,
    });
    return await this.repo.save(newDoc);
  }

  //Service Document pour enregistrer un document temporaire
  async uploadTemporaryDocument(file: Express.Multer.File): Promise<Document> {
    const doc = this.repo.create({
      type: path.extname(file.originalname).replace('.', '').toUpperCase(),
      filename: file.originalname,
      url: `/uploads/documents/${file.filename}`,
      shipmentId: null, // pas encore lié à un shipment
    });
  
    const saved = await this.repo.save(doc);
    return saved;
    }

  async attachToShipment(documentIds: number[], shipmentId: number) {
    if (!documentIds?.length) return;

    await this.repo
      .createQueryBuilder()
      .update(Document)
      .set({ shipmentId })
      .where("id IN (:...ids)", { ids: documentIds })
      .execute();
  }
  

  // 2️⃣ Télécharger un fichier
  async downloadDocument(documentId: number, res: any) {
    const doc = await this.repo.findOneBy({ id: documentId });
    if (!doc) throw new Error("Document introuvable");

    const filePath = path.join(__dirname, "../../uploads/documents", path.basename(doc.url));
    if (!fs.existsSync(filePath)) throw new Error("Fichier manquant sur le serveur");

    return res.download(filePath, doc.filename);
  }

  // 3️⃣ Visualiser (ouvrir directement dans le navigateur)
  async previewDocument(documentId: number, res: any) {
    const doc = await this.repo.findOneBy({ id: documentId });
    if (!doc) throw new Error("Document introuvable");

    const filePath = path.join(__dirname, "../../uploads/documents", path.basename(doc.url));
    if (!fs.existsSync(filePath)) throw new Error("Fichier manquant sur le serveur");

    return res.sendFile(filePath);
  }
}
