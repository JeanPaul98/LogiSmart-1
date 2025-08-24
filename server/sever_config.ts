// server/server_config.ts
import { Sequelize } from "sequelize";

// Masque le mot de passe dans les logs
const mask = (s?: string) => (s ? s.replace(/.(?=.{3})/g, "*") : s);

function configFromEnv() {
  // Si DATABASE_URL est défini, on le prend en priorité
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

  // LOGS DE DEBUG (sans afficher le vrai mot de passe)
  console.log("[DB] ENV loaded:",
    { host, port, database, username, password: mask(password) });

  const url = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  return {
    url,
    options: {
      dialect: "mysql" as const,
      logging: false,
    },
  };
}

const cfg = configFromEnv();
export const sequelize = new Sequelize(cfg.url, cfg.options);

export async function assertDbConnection() {
  await sequelize.authenticate();
}
