// src/server/storage/IStorage.ts
import {
    type HSCode,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IHSCodes {
    // HS Codes
    searchHSCodes(query: string): Promise<HSCode[]>;
    getHSCode(code: string): Promise<HSCode | undefined>;

  }
  
  export type { HSCode};
  