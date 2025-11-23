import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controller/ProjectController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

router.post(
  "/",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  verifyAdmin,
  createProject
);

router.put(
  "/:id",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "cad", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  verifyAdmin,
  updateProject
);

router.delete("/:id", verifyAdmin, deleteProject);

export default router;
