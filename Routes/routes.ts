import type { Express } from "express";
import { createServer, type Server } from "http";
import { calcul } from "../Controller/CalculateController";
import { alert } from "../Controller/AlertController"
import { createchipments, getchipments, chimentid } from "../Controller/ChipmentsController"
import { chat } from "../Controller/ChatController"
import { create, search } from "../Controller/HsCodesController"
import { gettracking, createtracking } from "../Controller/TrackingController"
import { register, login, refreshToken, logout, listuser } from "../Auth/AuthController/AuthController";

export async function routes(app: Express): Promise<Server> {

  //Authentication routes
  app.post("/api/register", register);
  app.post("/api/login", login);
  app.get("/api/list", listuser);
  app.post("/api/refresh-token", refreshToken);
  app.post("/api/logout", logout);

  //Chipments routes
  app.post('/api/shipments', createchipments);
  app.get('/api/shipments/list', getchipments);
  app.get('/api/shipments/:id', chimentid);

  //Alert route
  app.get('/api/alerts', alert);
  app.get('/api/shipments/list',);

  //Calculate route
  app.post('/api/calculate-tariff', calcul);

  //Chat route
  app.post('/api/chat', chat);


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