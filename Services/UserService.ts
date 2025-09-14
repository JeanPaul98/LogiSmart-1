// src/server/storage.typeorm.user.ts
import { AppDataSource } from "../dbContext/db";
import { User as UserEntity } from "../Models/User";
import type { User, InsertUser } from "@shared/schema"; // DTO Zod
import { IUser } from "../Interface/IUser";

/**
 * Service TypeORM pour la gestion des utilisateurs.
 * Ici on ajoute une méthode createUser pour l’inscription.
 */
export class UserService implements IUser {
  private repo = AppDataSource.getRepository(UserEntity);

  /**
   * Création d’un nouvel utilisateur.
   *
   * Logique métier :
   * - Reçoit un DTO validé (InsertUser) depuis la couche API.
   * - Crée une nouvelle instance UserEntity.
   * - Hash du mot de passe recommandé avant sauvegarde (non inclus ici).
   * - Retourne l’utilisateur persistant avec son id généré.
   */
  async createUser(userData: InsertUser): Promise<User> {
    const entity = this.repo.create({
      ...userData,
      role: userData.role ?? "user", // par défaut "user"
    });
    const saved = await this.repo.save(entity);
    return saved as unknown as User;
  }

  // Exemple méthode existante
  async getUser(id: string): Promise<User | undefined> {
    const row = await this.repo.findOne({ where: { id } });
    return (row ?? undefined) as unknown as User | undefined;
  }
}

export const userService = new UserService();
