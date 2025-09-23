import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Obtenir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier temporaire
const uploadDir = path.join(__dirname, "..", "uploads", "documents", "tmp");

// 📂 Config Multer
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/documents");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });


// Dossier temporaire pour les documents uploadés
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const documentUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // max 20 Mo
});