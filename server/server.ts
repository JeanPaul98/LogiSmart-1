// server/server.ts (or server/index.ts)
import "dotenv/config";
import express from "express";
import { connectDB } from "../dbContext";
import { setupVite, serveStatic, log } from "./vite";


const app = express();

(async () => {
  try {
    await connectDB();  

    const port = Number(process.env.PORT ?? 5000);
    app.listen(port, () =>
      console.log(`[BOOT] listening on http://localhost:${port}`)
    );

    // Front: Vite en dev, static en prod
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
      console.log("[VITE] dev middleware enabled");
    } else {
      serveStatic(app);
      console.log("[STATIC] serving built files");
    }

    
  } catch (e) {
    console.error("[BOOT ERROR]", e);
    process.exit(1);
  }
})();


