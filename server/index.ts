// server/index.ts
import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { assertDbConnection, sequelize } from "./sever_config";
import { initModelsAndAssociations } from "./Models"; // charge modèles/associations

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🔊 Logs d’amorçage
console.log(`[BOOT] NODE_ENV=${process.env.NODE_ENV} PORT=${process.env.PORT || 5000}`);

// Endpoint santé très tôt (avant tout)
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, time: new Date().toISOString() });
});

// Logging middleware API
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson: (body: any, ...args: any[]) => Response = res.json.bind(res);
  (res as any).json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try { logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`; } catch {}
      }
      if (logLine.length > 200) logLine = logLine.slice(0, 199) + "…";
      console.log(`[API] ${logLine}`);
    }
  });

  next();
});

// 🔒 Pièges à erreurs globales utiles en dev
process.on("uncaughtException", (err) => {
  console.error("[FATAL] uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] unhandledRejection:", reason);
});

(async () => {
  try {
    // DB d’abord
    await assertDbConnection();
    initModelsAndAssociations();
    console.log("[DB] connected");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("[DB] sequelize synced (alter=true)");
    }

    // Enregistre routes applicatives
    const server = await registerRoutes(app);

    // Middleware erreurs centralisé
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("[ERROR]", status, message, err?.stack);
      res.status(status).json({ message });
    });

    // Front: Vite en dev, static en prod
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
      console.log("[VITE] dev middleware enabled");
    } else {
      serveStatic(app);
      console.log("[STATIC] serving built files");
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      console.log(`[BOOT] Server listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.error("[BOOT ERROR]", e);
    process.exit(1);
  }
})();
