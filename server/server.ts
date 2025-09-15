import "reflect-metadata";
import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { routes } from "../Routes/routes";
import { AppDataSource } from "../dbContext/db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(`[BOOT] NODE_ENV=${process.env.NODE_ENV} PORT=${process.env.PORT || 5000}`);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, time: new Date().toISOString() });
});

(async () => {
  try {
    // Initialisation DB TypeORM
    await AppDataSource.initialize();
    console.log("[DB] TypeORM connected");

    const server = await routes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("[ERROR]", status, message, err?.stack);
      res.status(status).json({ message });
    });

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
