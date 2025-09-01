import type { Request, Response } from "express";
import { alertService } from "../Services/AlertService";


  // Regulatory alerts
  export const alert = async (req: Request, res: Response) => {
    try {
      const alerts = await alertService.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  };


