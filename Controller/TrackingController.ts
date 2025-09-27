// src/server/controllers/tracking.controller.ts
import type { Request, Response } from "express";
import { trackingService } from "../Services/TrackingService";
import { insertTrackingEventSchema } from "@shared/schema";

/**
 * POST /api/shipment/:shipmentId/tracking
 */
export const createTrackingEvent = async (req: Request, res: Response) => {
  try {
    const eventData = insertTrackingEventSchema.parse({
      ...req.body,
      shipmentId: req.params.shipmentId,
    });

    const savedEvent = await trackingService.addTrackingEvent(eventData);

    res.status(201).json({
      success: true,
      message: "Tracking event created",
      data: savedEvent,
    });
  } catch (err: any) {
    console.error("Error adding tracking event:", err);
    res.status(err.message === "Shipment not found" ? 404 : 500).json({
      success: false,
      message: err.message || "Failed to add tracking event",
    });
  }
};

/**
 * GET /api/shipment/:shipmentId/tracking
 */
export const getShipmentTracking = async (req: Request, res: Response) => {
  try {
    const shipmentId = req.params.shipmentId;
    const trackingEvents = await trackingService.getShipmentTracking(shipmentId);

    res.status(200).json({
      success: true,
      message: "Shipment tracking events retrieved",
      data: trackingEvents,
    });
  } catch (err: any) {
    console.error("Error fetching shipment tracking:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch tracking events",
    });
  }
};

/**
 * GET /api/shipment/tracking/:trackingNumber
 */
export const getShipmentByTrackingNumber = async (req: Request, res: Response) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    const shipment = await trackingService.getShipmentByTracking(trackingNumber);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment retrieved",
      data: shipment,
    });
  } catch (err: any) {
    console.error("Error fetching shipment by tracking number:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch shipment",
    });
  }
};
