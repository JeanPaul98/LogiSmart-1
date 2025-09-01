import type { Response , Request } from "express";

  // Tariff calculation
  export const calcul = async (req:Request, res: Response) => {
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
  };

