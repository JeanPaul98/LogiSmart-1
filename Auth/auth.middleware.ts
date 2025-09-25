import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = (process.env.JWT_ACCESS_SECRET ?? "dev-access") as jwt.Secret;

export type AuthUser = { id: string; email?: string | null; role?: string | null };

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export function authenticate() {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as any;
      if (decoded.typ !== "access") throw new Error("Invalid token type");
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (roles.length && !roles.includes(req.user.role || "")) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
