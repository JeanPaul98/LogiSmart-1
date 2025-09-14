import type { Request, Response } from "express";
import { userService } from "../Services/UserService";
import { insertUserSchema } from "@shared/schema"; // ✅ ton DTO Zod pour validation

/**
 * Controller pour la gestion des utilisateurs.
 * Chaque méthode reçoit req/res, valide les données (Zod), et appelle le service.
 */

// ✅ Création d’un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  try {
    // 1. Validation avec Zod
    const userData = insertUserSchema.parse(req.body);

    // 2. Appel du service
    const newUser = await userService.createUser(userData);

    // 3. Réponse JSON
    res.status(201).json(newUser);
  } catch (err: any) {
    console.error("Error creating user:", err);
    res.status(400).json({ message: err.message ?? "Invalid data" });
  }
};

// ✅ Récupération d’un utilisateur par ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err: any) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
