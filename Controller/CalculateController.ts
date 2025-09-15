// server/controllers/CalculateController.ts
import type { Request, Response } from "express";
import { createEstimation,calculateTariffForShipment, TariffInput } from "../Services/TariffService";

// Estimation directe
export const estimationShipment = async (req:Request, res: Response) => {
  try {
    const tariff = await createEstimation(req.body);
    res.json({ success: true, tariff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Calcul lié à une expédition
export const calculShipment = async (req:Request, res:Response) => {
  try {
    const tariff = await calculateTariffForShipment(Number(req.params.id));
    res.json({ success: true, tariff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
