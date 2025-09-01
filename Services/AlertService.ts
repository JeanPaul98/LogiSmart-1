// src/server/storage.sequelize.ts
import { Alert as RegulatoryAlertModel} from "../Models";
import { type RegulatoryAlert } from "@shared/schema";
import { IAlerts } from "Interface/IAlerts";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
  return n;
};

export class SequelizeStorage implements IAlerts {


    // REGULATORY ALERTS
    async getActiveAlerts(): Promise<RegulatoryAlert[]> {
      // Si ton modèle utilise `isActive`, on filtre simplement dessus.
      // Si tu as un champ `validUntil`, tu peux ajouter une condition date ici.
      const rows = await RegulatoryAlertModel.findAll({
        where: { isActive: true },
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
      return rows.map(r => r.toJSON() as RegulatoryAlert);
    }

}

export const alertService = new SequelizeStorage();
