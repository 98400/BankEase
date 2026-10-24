import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const r = Router();

r.post("/login", async (req, res) => {
  const { customerId, password } = req.body;
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE customer_id = $1",
    [customerId]
  );
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    return res.status(401).json({ error: "Invalid Customer ID or Password" });

  const token = jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { name: u.name, customerId: u.customer_id } });
});

export default r;