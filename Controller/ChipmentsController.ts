// src/server/controllers/shipment.controller.ts
import type { Request, Response } from "express";
import { shipmentService } from "../Services/ShipmentService";      // Service Shipment (TypeORM)
import { trackingService } from "../Services/TrackingService";      // ⬅️ AJOUT : Service Tracking (TypeORM)
import { insertShipmentSchema } from "@shared/schema";
import { CreateShipmentDTO } from "../DTO/ShipmentDTO";



/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Gestion des expéditions
 */

/**
 * @swagger
 * /api/shipments/create:
 *   post:
 *     summary: Créer une nouvelle expédition
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - recipient
 *               - weight
 *             properties:
 *               sender:
 *                 type: string
 *                 example: "Jean Dupont"
 *               recipient:
 *                 type: string
 *                 example: "Marie Claire"
 *               weight:
 *                 type: number
 *                 example: 12.5
 *               address:
 *                 type: string
 *                 example: "123 Rue Principale, Montréal, QC"
 *     responses:
 *       201:
 *         description: Expédition créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "ship_12345"
 *                 sender:
 *                   type: string
 *                 recipient:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 address:
 *                   type: string
 *       400:
 *         description: Données invalides
 */

    // POST /api/shipments
    export const createShipments = async (req: any, res: Response) => {
      try {
        // 1) créer le shipment
        const created = await shipmentService.createShipment(req.body);
        // 2) créer l’événement de tracking initial (⚠️ on utilise le service Tracking)
        const shipmentId =
          typeof created.id === "number" ? created.id : Number(created.id);
        if (!Number.isFinite(shipmentId)) {
          console.error("Shipment created without numeric id:", created.id);
          return res
            .status(500)
            .json({ message: "Shipment created but ID is invalid" });
        }
        await trackingService.addTrackingEvent({
          shipmentId,
          status: "Registered",
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


    export const createShipment = async (req: Request, res: Response) => {
      try {
        const dto = req.body as CreateShipmentDTO;
    
        // --- Validations minimales ---
        const missing: string[] = [];
        if (!dto.userId) missing.push("userId");
        if (!dto.senderName) missing.push("senderName");
        if (!dto.recipientName) missing.push("recipientName");
        if (!dto.transportMode) missing.push("transportMode");
        if (!dto.originCity) missing.push("originCity");
        if (!dto.destinationCity) missing.push("destinationCity");
    
        if (missing.length) {
          return res.status(400).json({ error: `Champs requis manquants: ${missing.join(", ")}` });
        }
    
        // optionnel: s'assurer que documentIds est un array<number> si présent
        if (dto.documentIds && !Array.isArray(dto.documentIds)) {
          return res.status(400).json({ error: "documentIds doit être un tableau d'IDs" });
        }
    
        // --- Création du shipment (et rattachement des documents temporaires) ---
        const ship = await shipmentService.createShipment(dto);
    
        // --- Ajout d'un 1er événement de tracking (best-effort) ---
        const shipmentId = Number((ship as any)?.id);
        if (Number.isFinite(shipmentId)) {
          try {
            await trackingService.addTrackingEvent({
              shipmentId,
              status: "Registered",
              location: ship.originCity,
              description: "Shipment has been registered in the system",
              timestamp: new Date(),
            });
          } catch (err) {
            // on log seulement; on ne casse pas la création
            console.error("Failed to create initial tracking event:", err);
          }
        } else {
          console.warn("Shipment created but ID is not numeric:", (ship as any)?.id);
        }
    
        // --- Réponse UNIQUE ---
        return res.status(201).json({
          success: true,
          shipment: ship, // contient déjà les documents liés si ton service les charge via relations
        });
    
      } catch (e: any) {
        return res.status(400).json({
          success: false,
          error: e?.message || "Bad Request",
        });
      }
    };

    // GET /api/shipments
    export const getShipments = async (req: any, res: Response) => {
      try {
        const userId = req.user?.claims?.sub;
        const list = await shipmentService.getUserShipments(userId);
        res.json(list);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        res.status(500).json({ message: "Failed to fetch shipments" });
      }
    };

    // GET /api/shipments/:id
    export const getShipmentById = async (req: any, res: Response) => {
      try {
        const ship = await shipmentService.getShipment(req.params.id);
        if (!ship) return res.status(404).json({ message: "Shipment not found" });
        res.json(ship);
      } catch (error) {
        console.error("Error fetching shipment:", error);
        res.status(500).json({ message: "Failed to fetch shipment" });
      }
    };


/**
 * PATCH /api/shipments/:id/status
 * Body: { status: "registered" | "confirmed" | ... , meta?: any }
 * -> Force le statut à une valeur donnée (normalisée dans le service)
 */
export async function patchShipmentStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Paramètre id invalide" });
    }

    const { status} = req.body || {};
    if (!status || typeof status !== "string") {
      return res.status(400).json({ error: "status requis (string)" });
    }

    const updated = await shipmentService.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Shipment introuvable" });
    }

    return res.json({
      success: true,
      shipment: updated,
    });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Bad Request" });
  }
}

