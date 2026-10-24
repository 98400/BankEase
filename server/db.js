import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";

pg.types.setTypeParser(20, Number);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      customer_id TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      balance BIGINT NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT,
      amount BIGINT NOT NULL,
      counterparty TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cards (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      last4 TEXT NOT NULL,
      type TEXT NOT NULL,
      frozen BOOLEAN NOT NULL DEFAULT false
    );
  `);

  const demoUsers = [
    ["Swapnil", "BANK123", "bank@123", "BE0000000001", 7500000],
    ["Siddhesh", "BANK456", "bank@456", "BE0000000002", 2000000],
  ["Aniket", "BANK789", "bank@789", "BE0000000003", 500000],
  ["Shraddha", "BANK248", "bank@248", "BE0000000004", 22000000],
  ["Priya", "BANK225", "bank@225", "BE0000000005", 3000000],
  ["Harsh", "BANK226", "bank@226", "BE0000000006", 1000000],
];
  

  for (const [name, cid, pass, acct, bal] of demoUsers) {
    await pool.query(
      `INSERT INTO users (name, customer_id, password_hash, account_number, balance)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (customer_id) DO NOTHING`,
      [name, cid, bcrypt.hashSync(pass, 10), acct, bal]
    );
  }

  // Give every user without cards a debit and a credit card
  const { rows: users } = await pool.query(
    "SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM cards)"
  );
  for (const u of users) {
    await pool.query(
      "INSERT INTO cards (user_id, last4, type) VALUES ($1, '4821', 'Debit'), ($1, '9034', 'Credit')",
      [u.id]
    );
  }
}

export default pool;