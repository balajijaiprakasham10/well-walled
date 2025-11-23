import express from "express";
import {
  uploadBanner,
  getBanner,
  deleteBanner,
} from "../controller/BannerController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBanner);
router.post("/", verifyAdmin, upload.single("bannerImage"), uploadBanner);
router.delete("/", verifyAdmin, deleteBanner);

export default router;
