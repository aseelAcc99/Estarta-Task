import { pool } from "../config/db.js";
import fs from "fs";

async function runSQL() {
  try {
    const sql = fs.readFileSync("src/database/database.sql").toString();
    await pool.query(sql);
    console.log("database initialized successfully");
  } catch (err) {
    console.error("error running SQL file:", err);
  } finally {
    pool.end();
  }
}

runSQL();
