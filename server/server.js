import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
// REMOVE: import { DataAPIClient } from "@datastax/astra-db-ts";

// CHANGE: Import db from config simply to ensure connection starts
import { db } from "./config/data.js";
import itemRoutes from "./routes/itemRoutes.js";
import bannerRoutes from "./routes/Banneroutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// REMOVE: The manual DB connection that was here.
// The connection is now handled inside config/data.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// JSON + Static uploads
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);



// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
