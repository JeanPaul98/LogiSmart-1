// src/server/controllers/shipment.controller.ts
import type { Request, Response } from "express";
import { shipment } from "../Services/ShipmentService";      // Service Shipment (TypeORM)
import { tracking } from "../Services/TrackingService";      // ⬅️ AJOUT : Service Tracking (TypeORM)
import { insertShipmentSchema } from "@shared/schema";

// POST /api/shipments
export const createShipments = async (req: any, res: Response) => {
  try {
    const userId = req.user?.claims?.sub; // adapte si ton middleware met ailleurs
    const shipmentData = insertShipmentSchema.parse({ ...req.body, userId });

    // 1) créer le shipment
    const created = await shipment.createShipment(shipmentData);

    // 2) créer l’événement de tracking initial (⚠️ on utilise le service Tracking)
    const shipmentId =
      typeof created.id === "number" ? created.id : Number(created.id);
    if (!Number.isFinite(shipmentId)) {
      console.error("Shipment created without numeric id:", created.id);
      return res
        .status(500)
        .json({ message: "Shipment created but ID is invalid" });
    }

    await tracking.addTrackingEvent({
      shipmentId,
      status: "confirmed",
      location: created.originCity,
      description: "Shipment has been registered in the system",
      timestamp: new Date(),
    });

    // 3) renvoyer le shipment créé
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Failed to create shipment" });
  }
};

// GET /api/shipments
export const getShipments = async (req: any, res: Response) => {
  try {
    const userId = req.user?.claims?.sub;
    const list = await shipment.getUserShipments(userId);
    res.json(list);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Failed to fetch shipments" });
  }
};

// GET /api/shipments/:id
export const getShipmentById = async (req: any, res: Response) => {
  try {
    const ship = await shipment.getShipment(req.params.id);
    if (!ship) return res.status(404).json({ message: "Shipment not found" });

    // Verify ownership
    const userId = req.user?.claims?.sub;
    if (ship.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(ship);
  } catch (error) {
    console.error("Error fetching shipment:", error);
    res.status(500).json({ message: "Failed to fetch shipment" });
  }
};
