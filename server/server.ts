// server/server.ts (or server/index.ts)
import "dotenv/config";
import express from "express";
import { connectDB } from "../dbContext";

const app = express();

(async () => {
  try {
    await connectDB();  

    const port = Number(process.env.PORT ?? 5000);
    app.listen(port, () =>
      console.log(`[BOOT] listening on http://localhost:${port}`)
    );
  } catch (e) {
    console.error("[BOOT ERROR]", e);
    process.exit(1);
  }
})();
