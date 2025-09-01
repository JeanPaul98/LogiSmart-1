import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/User";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

const generateAccessToken = (user: any) =>
  jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user: any) =>
  jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });



export const listuser = async (req: Request, res: Response) => {
  try {
    const existingUser  = await User.findAll();
    if (existingUser ) return res.status(200).json({ existingUser });

    res.status(201).json({ message: "Liste utilisateur" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const existingUser  = await User.findOne({ where: { email } });
    if (existingUser ) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, firstName, lastName, preferredLanguage: "fr" });

    res.status(201).json({success: true, message: "Utilisateur créé",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        preferredLanguage: user.preferredLanguage,
        createdAt: user.createdAt,
       }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    res.status(500).json({succes: false, message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const validPassword = await bcrypt.compare(password, user.password || "");
    if (!validPassword) return res.status(400).json({ message: "Mot de passe incorrect" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token manquant" });

  try {
    const payload: any = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || user.refreshToken !== token) return res.status(403).json({ message: "Refresh token invalide" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Refresh token invalide ou expiré" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const payload: any = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch {
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  }
};