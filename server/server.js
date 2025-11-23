import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// CHANGE: Import db from config simply to ensure connection starts
import { db } from "./config/data.js";
import itemRoutes from "./routes/itemRoutes.js";
import bannerRoutes from "./routes/Banneroutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Standard Node.js path setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration (Note: You may need to update 'origin' to your Vercel URL later)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://well-walled.vercel.app"],
    credentials: true,
  })
);


// JSON + Static uploads
app.use(express.json());

// NOTE: Vercel does not serve static files via express.static().
// For production, the 'uploads' folder should be served from Vercel's /public directory
// or uploaded to a dedicated storage service like Vercel Blob or AWS S3.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);

// --- Vercel Serverless Function Export ---
// Vercel automatically wraps this exported app instance in its own serverless handler.
// We no longer need app.listen(PORT, ...).
export default app;
