import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l’utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      preferredLanguage: ""
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Vérifier si user existe
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Générer token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error });
  }
};
