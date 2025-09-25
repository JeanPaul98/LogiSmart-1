import { service } from "../Auth/auth.service";
import type { Request, Response } from "express";

    export const register = async (req: Request, res: Response) => {
        try {
        const { email, password, firstName, lastName, role } = req.body || {};
        if (!email || !password) return res.status(400).json({ error: "email et password requis" });
        const user = await service.register({ email, password, firstName, lastName, role });
        return res.status(201).json({ id: user.id, email: user.email, role: user.role });
        } catch (e: any) {
        return res.status(400).json({ error: e.message || "Bad Request" });
        }
    };


    export const oauthToken = async (req: Request, res: Response) => {
    try {
      const { grant_type } = req.body || {};
      if (grant_type === "password") {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ error: "username et password requis" });
        const tokens = await service.login(username, password);
        return res.json(tokens);
      }
      if (grant_type === "refresh_token") {
        const { refresh_token } = req.body || {};
        if (!refresh_token) return res.status(400).json({ error: "refresh_token requis" });
        const tokens = await service.refresh(refresh_token);
        return res.json(tokens);
      }
      return res.status(400).json({ error: "grant_type non supporté" });
    } catch (e: any) {
      return res.status(400).json({ error: e.message || "Bad Request" });
    }
  };


  export const logout = async (req: Request, res: Response) => {
    try {
      const { refresh_token } = req.body || {};
      if (!refresh_token) return res.status(400).json({ error: "refresh_token requis" });
      const out = await service.logout(refresh_token);
      return res.json(out);
    } catch (e: any) {
      return res.status(400).json({ error: e.message || "Bad Request" });
    }
  };


