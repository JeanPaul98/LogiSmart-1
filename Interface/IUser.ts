// src/server/storage/IStorage.ts
import {
    type User,
    type InsertUser,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IUser{
    // Users
    createUser(userData: InsertUser): Promise<User>;
    getUser(id: string): Promise<User | undefined>;

  }
  
  export type {
    User,
  };
  