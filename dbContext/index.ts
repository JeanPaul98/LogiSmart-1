// src/db/index.ts
import { AppDataSource } from "../dbContext/db";

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log("DB connected.");
}
