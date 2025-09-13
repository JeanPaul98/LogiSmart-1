import type { Response, Request } from "express";
import { hscodeService } from "../Services/HSCodeService";

  // HS Code search
  export const search =  async (req:Request , res:Response) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter required" });
      }

      const hsCodes = await hscodeService.searchHSCodes(query);
      res.json(hsCodes);
    } catch (error) {
      console.error("Error searching HS codes:", error);
      res.status(500).json({ message: "Failed to search HS codes" });
    }
  };

  export const create = async (req:Request, res:Response) => {
    try {
      const hsCode = await hscodeService.getHSCode(req.params.code);
      if (!hsCode) {
        return res.status(404).json({ message: "HS code not found" });
      }
      res.json(hsCode);
    } catch (error) {
      console.error("Error fetching HS code:", error);
      res.status(500).json({ message: "Failed to fetch HS code" });
    }
  };
