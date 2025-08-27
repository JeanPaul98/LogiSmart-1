// src/server/storage/IStorage.ts
import {
    type User,
    type UpsertUser,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IUser{
    // Users
    getUser(id: string): Promise<User | undefined>;
    upsertUser(user: UpsertUser): Promise<User>;

  }
  
  export type {
    User,
    UpsertUser,
  };
  