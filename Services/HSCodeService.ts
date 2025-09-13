// src/server/services/hscode.service.ts
import { AppDataSource } from "../dbContext/db";
import { HSCode as HSCodeEntity } from "../entities/HSCode";
import type { HSCode as HSCodeDTO, InsertHSCode } from "@shared/schema";
import { insertHSCodeSchema } from "@shared/schema";
import { Like } from "typeorm";


export class HSCodeService {
  private repo = AppDataSource.getRepository(HSCodeEntity);


  /** Crée un HSCode à partir du DTO validé */
  async createHSCode(input: InsertHSCode): Promise<HSCodeDTO> {
    // 1) Validation/normalisation (au cas où l'appelant n'a pas déjà validé)
    const data = insertHSCodeSchema.parse(input);

    // 2) Optionnel: vérifier l'unicité applicative (en plus de l'unique DB)
    const exists = await this.repo.findOne({ where: { code: data.code } });
    if (exists) {
      throw Object.assign(new Error(`HSCode '${data.code}' existe déjà`), { status: 409 });
    }

    // 3) Créer + sauver
    const entity = this.repo.create({
      code: data.code,
      description: data.description,
      dutyRate: data.dutyRate ?? null,
      vatRate: data.vatRate ?? null,
      category: data.category ?? null,
      restrictions: data.restrictions ?? null,
    });

    try {
      const saved = await this.repo.save(entity);
      return saved as unknown as HSCodeDTO;
    } catch (err: any) {
      // Gestion propre de l'unicité côté DB (MySQL: ER_DUP_ENTRY)
      if (err?.code === "ER_DUP_ENTRY") {
        throw Object.assign(new Error(`HSCode '${data.code}' existe déjà`), { status: 409 });
      }
      throw err;
    }
  }



  /** Recherche par code OU description (LIKE %query%), limité à 25, trié par code ASC */
  async searchHSCodes(query: string): Promise<HSCodeDTO[]> {
    const like = `%${query}%`;
    const rows = await this.repo.find({
      where: [
        { code: Like(like) },
        { description: Like(like) },
      ],
      take: 25,
      order: { code: "ASC" },
    });

    // Entité == DTO (mêmes champs) → cast typé pour la couche sup
    return rows as unknown as HSCodeDTO[];
  }

  /** Récupère un HSCode par son code exact (ex: "870899") */
  async getHSCode(code: string): Promise<HSCodeDTO | undefined> {
    const row = await this.repo.findOne({ where: { code } });
    return (row ?? undefined) as unknown as HSCodeDTO | undefined;
  }
}

export const hscodeService = new HSCodeService();
