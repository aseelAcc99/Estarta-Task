import { pool } from "../config/db.js";
import HttpError from "../utils/HttpError.js";

async function retryDB(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw new HttpError("Unexpected Database Failure", 503);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return await retryDB(fn, retries - 1, delay);
  }
}

export async function validateUser(username, nationalNumber) {
  return retryDB(async () => {
    const query = `
      SELECT ID
      FROM Users
      WHERE Username = $1 AND NationalNumber= $2
    `;
    const { rows } = await pool.query(query, [username, nationalNumber]);
    return rows[0] || null;
  });
}

export async function getSalariesByUserID(userId) {
  return retryDB(async () => {
    const query = `
      SELECT Salary, Month, Year
      FROM Salaries
      WHERE UserId = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  });
}

export async function getUserByNationalNumber(nationalNumber) {
  return retryDB(async () => {
    const nationalNumberStr = String(nationalNumber);
    const query = `
      SELECT ID, IsActive, Username
      FROM Users
      WHERE NationalNumber = $1
    `;
    const { rows } = await pool.query(query, [nationalNumberStr]);
    return rows[0] || null;
  });
}
