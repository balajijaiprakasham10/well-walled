import express from "express";
import { uploadProjects } from "../middleware/uploadCloud.js";
import {
  getItems,
  addItem,
  deleteItem,
  getItemsByCategory,
  getItemById, // 1. IMPORT THIS
} from "../controller/itemController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL ITEMS
router.get("/", getItems);

// GET ITEMS BY CATEGORY
router.get("/category/:category", getItemsByCategory);

// ⭐ GET SINGLE ITEM BY ID (2. ADD THIS ROUTE)
// Important: Keep this below /category/ or specific routes to avoid conflicts,
// though here the paths are distinct enough so it's safe.
router.get("/:id", getItemById);

// ADD ITEM
router.post("/", verifyAdmin, uploadProjects.array("images", 10), addItem);

// DELETE ITEM
router.delete("/:id", verifyAdmin, deleteItem);

export default router;
