import express from "express";
import multer from "multer";
import path from "path";
import type { Request, Response } from "express";
import { DocumentService } from "../Services/DocumentService";

const router = express.Router();
const documentService = new DocumentService(/* repo injection */);


// 1️⃣ Upload d’un ou plusieurs fichiers
export const saveDoc = async (req: any, res:Response) => {
  try {
    const shipmentId = parseInt(req.params.shipmentId, 10);
    const files = req.files as Express.Multer.File[];
    const results = [];
    for (const file of files) {
      const saved = await documentService.saveDocument(file, shipmentId);
      results.push(saved);
    }
    res.json({ success: true, documents: results });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

//Route Express pour uploader un document temporaire
export const uploadTemp = async (req:any, res:Response) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const savedDoc = await documentService.saveTemporary(req.file);
      res.json(savedDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  };

//get file by id
export const getfile = async (req: any, res: Response) => {
  try {
    await documentService.downloadDocument(parseInt(req.params.id, 10), res);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
};

// 3️⃣ Visualiser un fichier
export const displayDoc = async (req:any, res: Response) => {
  try {
    await documentService.previewDocument(parseInt(req.params.id, 10), res);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
};

