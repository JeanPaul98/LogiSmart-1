import type { Request, Response } from "express";
import { createServer, type Server } from "http";
import { tracking } from "../Services/TrackingService";
import { document } from "../Services/DocumentService";
import { insertShipmentSchema, insertTrackingEventSchema } from "@shared/schema";

  // Tracking routes
  export const gettracking = async (req:Request, res:Response) => {
    try {
      const shipment = await tracking.getShipmentByTracking(req.params.trackingNumber);
      if (!shipment) {
        return res.status(404).json({ message: "Tracking number not found" });
      }

      // ✅ BORNER l’ID
      const shipmentId = typeof shipment.id === 'number' ? shipment.id : Number(shipment.id);
      if (!Number.isFinite(shipmentId)) {
        return res.status(500).json({ message: "Invalid shipment id" });
      }

      const trackingEvents = await tracking.getShipmentTracking(shipmentId);
      const documents = await document.getShipmentDocuments(shipmentId);

      res.json({ shipment, trackingEvents, documents });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      res.status(500).json({ message: "Failed to track shipment" });
    }
  };

  export const createtracking = async (req:Request, res:Response) => {
    try {
      const eventData = insertTrackingEventSchema.parse({
        ...req.body,
        shipmentId: req.params.shipmentId, // z.coerce.number() va convertir
      });
      const trackingEvent = await tracking.addTrackingEvent(eventData);
      res.json(trackingEvent);
    } catch (error) {
      console.error("Error adding tracking event:", error);
      res.status(500).json({ message: "Failed to add tracking event" });
    }
  };

