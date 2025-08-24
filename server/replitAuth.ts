// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";

// ⚠️ Utilisé seulement si DATABASE_URL est défini ; sinon on prend MemoryStore
import connectPg from "connect-pg-simple";

import { storage } from "./storage";

/** Helpers */
const hasOidcEnv =
  !!process.env.REPLIT_DOMAINS &&
  !!process.env.REPL_ID &&
  // ISSUER_URL facultatif (par défaut replit.com/oidc), mais on considère OK
  !!process.env.SESSION_SECRET;

const isProd = process.env.NODE_ENV === "production";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

/** Session store:
 * - PROD / avec DATABASE_URL -> Postgres session store (connect-pg-simple)
 * - DEV (sans DATABASE_URL) -> MemoryStore (à n'utiliser qu'en dev)
 */
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  const common = {
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // en dev sur http://localhost, secure:false ; en prod, true
      secure: isProd,
      maxAge: sessionTtl,
    },
  } as const;

  if (process.env.DATABASE_URL) {
    const pgStore = (connectPg as any)(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    return session({
      ...common,
      store: sessionStore,
    });
  }

  // Fallback dev: MemoryStore (pas pour la prod !)
  return session(common);
}

/** Met à jour l'objet user stocké en session */
function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

/** Upsert de l'utilisateur dans ta DB applicative */
async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"] ?? null,
    firstName: claims["first_name"] ?? null,
    lastName: claims["last_name"] ?? null,
    profileImageUrl: claims["profile_image_url"] ?? null,
    preferredLanguage: (claims["locale"] as string | undefined)?.slice(0, 2) ?? "fr",
  });
}

/** =========
 *  SETUP AUTH
 *  =========
 *
 * - PROD (vars présentes): OIDC Replit + Passport
 * - DEV (vars absentes): fake login/logout + user en session
 */
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  if (!hasOidcEnv) {
    // ----- DEV FALLBACK -----
    console.warn(
      "[Auth] OIDC environment variables not found. Enabling DEV fallback auth (no Passport)."
    );

    // faux "login": set un user en session et redirige
    app.get("/api/login", (req, res) => {
      const nowSec = Math.floor(Date.now() / 1000);
      (req as any).user = {
        claims: {
          sub: "dev-user-001",
          email: "dev@example.com",
          first_name: "Dev",
          last_name: "User",
          profile_image_url: null,
          locale: "fr-FR",
          exp: nowSec + 60 * 60 * 24, // +24h
        },
        expires_at: nowSec + 60 * 60 * 24,
      };
      // sauvegarde dans la session
      (req as any).session.passport = { user: (req as any).user };
      res.redirect("/");
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        req.session.destroy(() => {
          res.redirect("/");
        });
      });
    });

    // Pas de callback en dev fallback
    app.get("/api/callback", (_req, res) => res.redirect("/"));
    return;
  }

  // ----- PROD / VRAI OIDC -----
  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user: any = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", async (req, res) => {
    const oidcConfig = await getOidcConfig();
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(oidcConfig, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

/** ============
 *  isAuthenticated
 *  ============
 *  - En mode OIDC: utilise req.isAuthenticated + refresh token si expiré
 *  - En mode DEV fallback: considère authentifié si req.user existe et n’est pas expiré
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.user as any) || (req.session as any)?.passport?.user;

  // Fallback DEV (pas d'OIDC)
  if (!hasOidcEnv) {
    if (!user || !user.expires_at) {
      return res.status(401).json({ message: "Unauthorized (dev)" });
    }
    const now = Math.floor(Date.now() / 1000);
    if (now <= user.expires_at) return next();
    return res.status(401).json({ message: "Session expired (dev)" });
  }

  // Mode OIDC normal
  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    // réinjecter le user mis à jour en session
    (req as any).session.passport = { user };
    return next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
