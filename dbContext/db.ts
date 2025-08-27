// server/db.ts
import { Sequelize } from "sequelize";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "logismart",
  NODE_ENV = "development",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging: NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: false,
    freezeTableName: false,
    timestamps: true,
  },
});
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};