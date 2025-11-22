import pg from "pg";
import "dotenv/config";

export const pool = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT || 5433,
});
