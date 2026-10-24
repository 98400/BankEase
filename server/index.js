import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

await initDb();
app.listen(process.env.PORT, () => console.log("API running on port", process.env.PORT));