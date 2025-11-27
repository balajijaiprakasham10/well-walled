import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Ensure Astra DB connection initializes
// import { db } from "./config/data.js";

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

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5174", "https://well-walled.vercel.app"],
    credentials: true,
  })
);


app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);

// ---------------------
// Serverless Export for Vercel
// ---------------------
export default app;

// ---------------------
// Local Development (runs only if not in Vercel)
// ---------------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🔥 Server running on http://localhost:${PORT}`)
  );
}
