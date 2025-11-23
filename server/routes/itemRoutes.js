import express from "express";
import { upload } from "../middleware/uploadCloud.js";
import {
  getItems,
  addItem,
  deleteItem,
  getItemsByCategory,
} from "../controller/itemController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL ITEMS
router.get("/", getItems);

// ⭐ GET ITEMS BY CATEGORY
router.get("/category/:category", getItemsByCategory);

// ADD ITEM — multiple images
router.post("/", verifyAdmin, upload.array("images", 10), addItem);

// DELETE ITEM
router.delete("/:id", verifyAdmin, deleteItem);

export default router;
