import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertShipmentSchema, insertTrackingEventSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Shipment routes
  app.post('/api/shipments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const shipmentData = insertShipmentSchema.parse({
        ...req.body,
        userId,
      });
      
      const shipment = await storage.createShipment(shipmentData);
      
      // Add initial tracking event
      await storage.addTrackingEvent({
        shipmentId: shipment.id,
        status: 'Shipment created',
        location: shipment.originCity,
        description: 'Shipment has been registered in the system',
      });
      
      res.json(shipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ message: "Failed to create shipment" });
    }
  });

  app.get('/api/shipments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const shipments = await storage.getUserShipments(userId);
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  app.get('/api/shipments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const shipment = await storage.getShipment(req.params.id);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      // Verify ownership
      const userId = req.user.claims.sub;
      if (shipment.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  // Tracking routes
  app.get('/api/tracking/:trackingNumber', async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTracking(req.params.trackingNumber);
      if (!shipment) {
        return res.status(404).json({ message: "Tracking number not found" });
      }
      
      const trackingEvents = await storage.getShipmentTracking(shipment.id);
      const documents = await storage.getShipmentDocuments(shipment.id);
      
      res.json({
        shipment,
        trackingEvents,
        documents,
      });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      res.status(500).json({ message: "Failed to track shipment" });
    }
  });

  app.post('/api/tracking/:shipmentId/events', isAuthenticated, async (req: any, res) => {
    try {
      const shipmentId = req.params.shipmentId;
      const eventData = insertTrackingEventSchema.parse({
        ...req.body,
        shipmentId,
      });
      
      const trackingEvent = await storage.addTrackingEvent(eventData);
      res.json(trackingEvent);
    } catch (error) {
      console.error("Error adding tracking event:", error);
      res.status(500).json({ message: "Failed to add tracking event" });
    }
  });

  // Tariff calculation
  app.post('/api/calculate-tariff', async (req, res) => {
    try {
      const { origin, destination, weight, volume, transportMode } = req.body;
      
      // Basic tariff calculation logic
      let baseCost = 0;
      switch (transportMode) {
        case 'air':
          baseCost = weight * 8.5 + (volume || 0) * 150;
          break;
        case 'sea':
          baseCost = weight * 2.2 + (volume || 0) * 80;
          break;
        case 'road':
          baseCost = weight * 4.1 + (volume || 0) * 100;
          break;
        default:
          baseCost = weight * 5;
      }
      
      // Add distance factor (simplified)
      const distanceFactor = 1.2;
      const totalCost = Math.round(baseCost * distanceFactor * 100) / 100;
      
      // Estimated delivery time
      let estimatedDays = 0;
      switch (transportMode) {
        case 'air':
          estimatedDays = Math.floor(Math.random() * 3) + 3; // 3-5 days
          break;
        case 'sea':
          estimatedDays = Math.floor(Math.random() * 10) + 15; // 15-25 days
          break;
        case 'road':
          estimatedDays = Math.floor(Math.random() * 4) + 7; // 7-10 days
          break;
      }
      
      res.json({
        totalCost,
        transportMode,
        estimatedDays,
        breakdown: {
          baseCost,
          distanceFactor,
          weight,
          volume,
        },
      });
    } catch (error) {
      console.error("Error calculating tariff:", error);
      res.status(500).json({ message: "Failed to calculate tariff" });
    }
  });

  // HS Code search
  app.get('/api/hs-codes/search', async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter required" });
      }
      
      const hsCodes = await storage.searchHSCodes(query);
      res.json(hsCodes);
    } catch (error) {
      console.error("Error searching HS codes:", error);
      res.status(500).json({ message: "Failed to search HS codes" });
    }
  });

  app.get('/api/hs-codes/:code', async (req, res) => {
    try {
      const hsCode = await storage.getHSCode(req.params.code);
      if (!hsCode) {
        return res.status(404).json({ message: "HS code not found" });
      }
      res.json(hsCode);
    } catch (error) {
      console.error("Error fetching HS code:", error);
      res.status(500).json({ message: "Failed to fetch HS code" });
    }
  });

  // Regulatory alerts
  app.get('/api/alerts', async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, content } = req.body;
      
      // Add user message
      const userMessage = await storage.addChatMessage({
        userId,
        sessionId,
        role: 'user',
        content,
      });
      
      // Generate AI response (simplified)
      let aiResponse = "Je suis désolé, je ne peux pas traiter votre demande pour le moment. Veuillez contacter notre service client.";
      
      if (content.toLowerCase().includes('taxe') || content.toLowerCase().includes('tax')) {
        aiResponse = "Les taxes d'importation varient selon le produit et le pays d'origine. Pour obtenir des informations précises, veuillez utiliser notre recherche de codes HS ou fournir plus de détails sur votre marchandise.";
      } else if (content.toLowerCase().includes('délai') || content.toLowerCase().includes('time')) {
        aiResponse = "Les délais de dédouanement varient selon le mode de transport et la destination :\n• Aérien : 3-5 jours\n• Maritime : 15-25 jours\n• Routier : 7-10 jours";
      } else if (content.toLowerCase().includes('document')) {
        aiResponse = "Les documents requis pour l'importation incluent généralement :\n• Facture commerciale\n• Déclaration en douane\n• Certificat d'origine\n• Documents spécifiques selon le produit (CE, sanitaire, etc.)";
      }
      
      // Add AI response
      const assistantMessage = await storage.addChatMessage({
        userId,
        sessionId,
        role: 'assistant',
        content: aiResponse,
      });
      
      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process chat" });
    }
  });

  app.get('/api/chat/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.params.sessionId;
      
      const messages = await storage.getChatHistory(userId, sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
