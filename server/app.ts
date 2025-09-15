// server/index.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { routes } from "../Routes/routes";
import { connectDB } from "../dbContext";

const app = express();

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, time: new Date().toISOString() });
});

(async () => {
  try {
    // Connexion DB (TypeORM)
    await connectDB();

    // Routes applicatives
    const server = await routes(app);

    // Gestion d'erreurs minimale
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    });

    // Démarrage HTTP
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({ port, host: "0.0.0.0" }, () => {
      console.log(`[BOOT] Server listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.error("[BOOT ERROR]", e);
    process.exit(1);
  }
})();

export default app;

