// server/routes/projectRoutes.js

const express = require("express");
const router = express.Router();
const projectController = require("../controller/ProjectController");
const { upload } = require("../middleware/uploadMiddleware"); // Assuming this exists

// GET all projects
router.get("/", projectController.getProjects);

// POST new project (uses upload.fields and createProject)
router.post(
  "/",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  projectController.createProject
);

// --- NEW: UPDATE Project (PUT) ---
router.put(
  "/:id",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  projectController.updateProject // <-- New controller function
);

// --- NEW: DELETE Project (DELETE) ---
router.delete("/:id", projectController.deleteProject); // <-- New controller function

module.exports = router;
