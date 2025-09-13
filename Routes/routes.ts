import type { Express } from "express";
import { createServer, type Server } from "http";
import { calcul } from "../Controller/CalculateController";
import { alert } from "../Controller/AlertController"
import { createShipments, getShipments, getShipmentById } from "../Controller/ChipmentsController"
import { create, search } from "../Controller/HsCodesController"
import { gettracking, createtracking } from "../Controller/TrackingController"

export async function routes(app: Express): Promise<Server> {


  //Chipments routes
  app.post('/api/shipments', createShipments);
  app.get('/api/shipments/list', getShipments);
  app.get('/api/shipments/:id', getShipmentById);

  //Alert route
  app.get('/api/alerts', alert);
  app.get('/api/shipments/list',);

  //Calculate route
  app.post('/api/calculate-tariff', calcul);


  //HS codes routes
  app.get('/api/hs-codes/search', search);
  app.get('/api/hs-codes/:code', create);


  // Tracking routes
  app.get('/api/tracking/:trackingNumber', gettracking);
  app.post('/api/tracking/:shipmentId/events', createtracking);

  // Crée et retourne le serveur HTTP
  const server = createServer(app);
  return server;
}