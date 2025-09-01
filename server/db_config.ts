import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

// Masque le mot de passe dans les logs
const mask = (s?: string) => (s ? s.replace(/.(?=.{3})/g, "*") : s);

function configFromEnv() {
  if (process.env.DATABASE_URL) {
    console.log("[DB] Using DATABASE_URL");
    return {
      url: process.env.DATABASE_URL!,
      options: {
        dialect: "mysql" as const,
        logging: false,
      },
    };
  }

  const host = process.env.MYSQL_HOST || "localhost";
  const port = Number(process.env.MYSQL_PORT || 3306);
  const database = process.env.MYSQL_DB || "logismart";
  const username = process.env.MYSQL_USER || "logismart";
  const password = process.env.MYSQL_PASSWORD || "superSecretPwd!123";

  console.log("[DB] ENV loaded:",
    { host, port, database, username, password: mask(password) });

  const url = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  return {
    url,
    options: {
      dialect: "mysql" as const,
      logging: false,
    },
    host,
    port,
    database,
    username,
    password,
  };
}

const cfg = configFromEnv();

export const sequelize = new Sequelize(cfg.url, cfg.options);

// Fonction pour créer la base si elle n'existe pas
export async function createDatabaseIfNotExists() {
  // Connexion sans base de données
  const connection = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.username,
    password: cfg.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.end();
}

export async function assertDbConnection() {
  await sequelize.authenticate();
}