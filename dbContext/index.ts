// src/db/index.ts  (NEW: safe, single init)
import "dotenv/config";
import { AppDataSource } from "../dbContext/db";
import type { DataSource } from "typeorm";

let initPromise: Promise<DataSource> | null = null;

export async function connectDB(): Promise<DataSource> {
  if (AppDataSource.isInitialized) return AppDataSource;
  if (!initPromise) {
    initPromise = AppDataSource.initialize()
      .then(ds => {
        console.log("[DB] connected");
        return ds;
      })
      .catch(err => {
        // reset so a future retry can happen
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}
