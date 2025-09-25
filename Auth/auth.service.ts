import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { DataSource } from "typeorm";
import { User } from "../Models/User";
import { RefreshToken } from "../Models/RefreshToken";
import { AppDataSource } from "../dbContext/db";                    // ⬅️ assure le bon chemin


const ACCESS_SECRET: Secret = (process.env.JWT_ACCESS_SECRET ?? "dev-access") as Secret;
const REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET ?? "dev-refresh") as Secret;

const toExpiresIn = (v: string | number | undefined, fallback: string | number) =>
  ((v ?? fallback) as unknown) as SignOptions["expiresIn"];

const ACCESS_OPTS: SignOptions = { expiresIn: toExpiresIn(process.env.JWT_ACCESS_EXPIRES, "900s") };
const REFRESH_OPTS: SignOptions = { expiresIn: toExpiresIn(process.env.JWT_REFRESH_EXPIRES, "30d") };

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? "12");

type JWTPayload = {
  sub: string;
  email?: string | null;
  role?: string | null;
  typ: "access" | "refresh";
};

export class AuthService {
  
  private userRepo = AppDataSource.getRepository(User);
  private rtRepo = AppDataSource.getRepository(RefreshToken);

  private signAccess(user: User) {
    const payload: JWTPayload = { sub: user.id, email: user.email, role: user.role, typ: "access" };
    return jwt.sign(payload, ACCESS_SECRET, ACCESS_OPTS);
  }

  private signRefresh(user: User) {
    const payload: JWTPayload = { sub: user.id, typ: "refresh" };
    return jwt.sign(payload, REFRESH_SECRET, REFRESH_OPTS);
  }

  private async persistRefresh(user: User, token: string) {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 3600 * 1000);
    const rec = this.rtRepo.create({ user, token, expiresAt, revoked: false });
    await this.rtRepo.save(rec);
    return rec;
  }

  async register(params: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) {
    const exists = await this.userRepo.findOne({ where: { email: params.email } });
    if (exists) throw new Error("Email déjà utilisé");
    const hashed = await bcrypt.hash(params.password, BCRYPT_ROUNDS);
    const user = this.userRepo.create({
      email: params.email,
      password: hashed,
      firstName: params.firstName ?? null,
      lastName: params.lastName ?? null,
      role: params.role ?? "user",
    });
    await this.userRepo.save(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error("Identifiants invalides");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Identifiants invalides");

    const access_token = this.signAccess(user);
    const refresh_token = this.signRefresh(user);
    await this.persistRefresh(user, refresh_token);

    return {
      token_type: "Bearer",
      access_token,
      expires_in: this.seconds(String(ACCESS_OPTS.expiresIn ?? "0")),
      refresh_token,
      refresh_expires_in: this.seconds(String(REFRESH_OPTS.expiresIn ?? "0")),
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    };
  }

  async refresh(refreshToken: string) {
    const found = await this.rtRepo.findOne({ where: { token: refreshToken, revoked: false }, relations: ["user"] });
    if (!found) throw new Error("Refresh token invalide");
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JWTPayload;
      if (decoded.typ !== "refresh") throw new Error("Type de token invalide");
    } catch {
      found.revoked = true;
      await this.rtRepo.save(found);
      throw new Error("Refresh token expiré ou invalide");
    }

    const user = found.user;
    const access_token = this.signAccess(user);
    // rotation
    const new_refresh = this.signRefresh(user);
    found.revoked = true;
    await this.rtRepo.save(found);
    await this.persistRefresh(user, new_refresh);

    return {
      token_type: "Bearer",
      access_token,
      expires_in: this.seconds(String(ACCESS_OPTS.expiresIn ?? "0")),
      refresh_token: new_refresh,
      refresh_expires_in: this.seconds(String(REFRESH_OPTS.expiresIn ?? "0")),
    };
  }

  async logout(refreshToken: string) {
    const found = await this.rtRepo.findOne({ where: { token: refreshToken, revoked: false } });
    if (found) {
      found.revoked = true;
      await this.rtRepo.save(found);
    }
    return { success: true };
  }

  private seconds(expr: string) {
    const m = String(expr).match(/^(\d+)\s*([smhd])$/i);
    if (!m) return 0;
    const n = Number(m[1]);
    const u = m[2].toLowerCase();
    return u === "s" ? n : u === "m" ? n * 60 : u === "h" ? n * 3600 : n * 86400;
  }
}


export const service =  new AuthService();