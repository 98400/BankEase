import { Router } from "express";
import pool from "../db.js";
import auth from "../middleware/auth.js";

const r = Router();
r.use(auth);

const validAmount = (a) => Number.isInteger(a) && a > 0;

// ----- Account and transactions -----
r.get("/me", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT name, customer_id, account_number, balance FROM users WHERE id = $1",
    [req.user.id]
  );
  res.json(rows[0]);
});

r.get("/transactions", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT 100",
    [req.user.id]
  );
  res.json(rows);
});

// ----- Deposit and withdraw -----
r.post("/deposit", async (req, res) => {
  const { amount } = req.body;
  if (!validAmount(amount)) return res.status(400).json({ error: "Invalid amount" });

  await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, req.user.id]);
  await pool.query(
    "INSERT INTO transactions (user_id, type, title, amount) VALUES ($1, 'deposit', 'Deposit', $2)",
    [req.user.id, amount]
  );
  res.json({ ok: true });
});

r.post("/withdraw", async (req, res) => {
  const { amount } = req.body;
  if (!validAmount(amount)) return res.status(400).json({ error: "Invalid amount" });

  const { rows } = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
  if (rows[0].balance < amount) return res.status(400).json({ error: "Insufficient funds" });

  await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, req.user.id]);
  await pool.query(
    "INSERT INTO transactions (user_id, type, title, amount) VALUES ($1, 'withdraw', 'Withdrawal', $2)",
    [req.user.id, amount]
  );
  res.json({ ok: true });
});

// ----- Transfer money -----
r.post("/transfer", async (req, res) => {
  const { toAccount, amount } = req.body;
  if (!validAmount(amount)) return res.status(400).json({ error: "Invalid amount" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // all steps succeed together or none do

    const toRes = await client.query(
      "SELECT id, account_number FROM users WHERE account_number = $1",
      [toAccount]
    );
    const to = toRes.rows[0];
    if (!to) throw new Error("Recipient account not found");
    if (to.id === req.user.id) throw new Error("You cannot transfer to yourself");

    const fromRes = await client.query(
      "SELECT account_number, balance FROM users WHERE id = $1 FOR UPDATE",
      [req.user.id]
    );
    const from = fromRes.rows[0];
    if (from.balance < amount) throw new Error("Insufficient funds");

    await client.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, req.user.id]);
    await client.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, to.id]);
    await client.query(
      "INSERT INTO transactions (user_id, type, title, amount, counterparty) VALUES ($1, 'transfer_out', $2, $3, $4)",
      [req.user.id, "Transfer to " + to.account_number, amount, to.account_number]
    );
    await client.query(
      "INSERT INTO transactions (user_id, type, title, amount, counterparty) VALUES ($1, 'transfer_in', $2, $3, $4)",
      [to.id, "Transfer from " + from.account_number, amount, from.account_number]
    );

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});

// ----- Pay bills -----
r.post("/pay-bill", async (req, res) => {
  const { biller, amount } = req.body;
  if (!biller || !validAmount(amount)) return res.status(400).json({ error: "Invalid input" });

  const { rows } = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
  if (rows[0].balance < amount) return res.status(400).json({ error: "Insufficient funds" });

  await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, req.user.id]);
  await pool.query(
    "INSERT INTO transactions (user_id, type, title, amount) VALUES ($1, 'bill', $2, $3)",
    [req.user.id, biller + " Bill", amount]
  );
  res.json({ ok: true });
});

// ----- Cards -----
r.get("/cards", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, last4, type, frozen FROM cards WHERE user_id = $1 ORDER BY id",
    [req.user.id]
  );
  res.json(rows);
});

r.patch("/cards/:id/freeze", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE cards SET frozen = NOT frozen WHERE id = $1 AND user_id = $2 RETURNING id, frozen",
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Card not found" });
  res.json(rows[0]);
});

export default r;