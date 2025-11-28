import express from "express";
import { uploadProjects } from "../middleware/uploadCloud.js";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getHomeProjects, // ✅ ADD THIS
  getProjectById,
  getProjectBySlug,
} from "../controller/ProjectController.js";

import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/home", getHomeProjects);

router.post(
  "/",
  uploadProjects.array("images", 10), // ✅ allow up to 10 images
  verifyAdmin,
  createProject
);

router.put(
  "/:id",
  uploadProjects.array("images", 10), // ✅ allow update images
  verifyAdmin,
  updateProject
);

router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);



router.delete("/:id", verifyAdmin, deleteProject);

export default router;
