import type { Express } from "express";
import { createServer, type Server } from "http";
import { calculShipment, estimationShipment } from "../Controller/CalculateController";
import { alert } from "../Controller/AlertController"
import { logout,oauthToken,register } from "../Controller/AuthController"
import { createShipments, getShipments, getShipmentById } from "../Controller/ChipmentsController"
import { create, search } from "../Controller/HsCodesController"
import { createTrackingEvent, getShipmentTracking, getShipmentByTrackingNumber} from "../Controller/TrackingController"
import { createUser, getUserById } from "../Controller/UserController"
import { getfile,displayDoc, saveDoc, uploadTemp} from "../Controller/DocumentController"
import {storage, documentUpload} from "../shared/Utils";
import multer from "multer";


export async function routes(app: Express): Promise<Server> {

  const upload = multer({ storage });
  // User
  app.post('/api/user/create', createUser);
  app.get('/api/user/:id', getUserById);

  // Shipments
  app.post('/api/shipments/create', createShipments);
  app.get('/api/shipments/list', getShipments);
  app.get('/api/shipments/:id', getShipmentById);

  // Alerts
  app.get('/api/alerts', alert);

  // Calculate
  app.post("/api/tariff/estimate", estimationShipment);
  app.post("/api/shipment/:id/tariff", calculShipment);

  // HS codes
  app.get('/api/hs-codes/search', search);
  app.get('/api/hs-codes/:code', create);

  // Tracking
  app.post("/api/shipment/:shipmentId/tracking", createTrackingEvent);
  app.get("/api/shipment/:shipmentId/tracking", getShipmentTracking);
  app.get("/api/shipment/tracking/:trackingNumber", getShipmentByTrackingNumber);

  //Documents
  // 2️⃣ Télécharger un fichier
  app.post("/api/upload/:shipmentId", upload.array("files", 5), saveDoc);
  app.get("/api/download/:id", getfile);
  app.get("/api/preview/:id", displayDoc);
  app.post("/api/upload", documentUpload.single("file"), uploadTemp);

  //Authentification
  app.post("/api/auth/register", register);
  app.post("/api/oauth/token", oauthToken);
  app.post("/api/auth/logout", logout);


  // Crée et retourne le serveur HTTP
  const server = createServer(app);
  return server;
}
