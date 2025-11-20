// C:\wellwalled\server\server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import the route file
const projectRoutes = require("./routes/ProjectRoutes");
const bannerRoutes = require("./routes/Banneroutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

// --- INTEGRATE PROJECT ROUTES ---
// All requests starting with /api/projects will be handled by projectRoutes.js
app.use("/api/banner", bannerRoutes);
app.use("/api/projects", projectRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
