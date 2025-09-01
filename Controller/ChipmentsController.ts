import type { Request, Response } from "express";
import { storage } from "../Services/storage";
import {shipment} from "../Services/ShipmentService"
import { insertShipmentSchema, insertTrackingEventSchema } from "@shared/schema";
 


  // Shipment routes
  export const createchipments = async (req: any, res:Response) => {
    try {
      const userId = req.user.claims.sub;
      const shipmentData = insertShipmentSchema.parse({
        ...req.body,
        userId,
      });

      const shipments = await shipment.createShipment(shipmentData);

      // ✅ BORNER l’ID (number) avant de l’utiliser
      // après la création du shipment
      const shipmentId = typeof shipments.id === 'number' ? shipments.id : Number(shipments.id);
      if (!Number.isFinite(shipmentId)) {
        console.error("Shipment created without numeric id:", shipments.id);
        return res.status(500).json({ message: "Shipment created but ID is invalid" });
      }

      await storage.addTrackingEvent({
        shipmentId,
        status: 'confirmed',                // statut valide de ton enum
        location: shipments.originCity,
        description: 'Shipment has been registered in the system',
        timestamp: new Date(),              // ✅ AJOUTÉ pour satisfaire le type InsertTrackingEvent
      });


      res.json(shipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ message: "Failed to create shipment" });
    }
  };

  
  export const getchipments =  async (req: any, res:Response) => {
    try {
      const userId = req.user.claims.sub;
      const ship = await shipment.getUserShipments(userId);
      res.json(ship);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  };


  export const chimentid = async (req: any, res:Response) => {
    try {
      const ship = await shipment.getShipment(req.params.id);
      if (!ship) {
        return res.status(404).json({ message: "Shipment not found" });
      }

      // Verify ownership
      const userId = req.user.claims.sub;
      if (ship.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(ship);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  };

 
