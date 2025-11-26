import express from "express";
import { uploadBannerMedia } from "../middleware/uploadCloud.js";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getHomeProjects, // ✅ ADD THIS
} from "../controller/ProjectController.js";

import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/home", getHomeProjects);

router.post(
  "/",
  uploadBannerMedia.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  verifyAdmin,
  createProject
);

router.put(
  "/:id",
  uploadBannerMedia.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  verifyAdmin,
  updateProject
);

router.delete("/:id", verifyAdmin, deleteProject);

export default router;
