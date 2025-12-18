import express from "express";
import {
  uploadBanner,
  getBanner,
  deleteBanner,
} from "../controller/BannerController.js";
import { uploadBanners } from "../middleware/uploadCloud.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBanner);

// ✅ FIX: Explicitly define the allowed fields
router.post(
  "/",
  verifyAdmin,
  uploadBanners.fields([
    { name: "bannerFile", maxCount: 1 }, // Matches frontend desktop file
    { name: "mobileFile", maxCount: 1 }, // Matches frontend mobile file
  ]),
  uploadBanner
);

router.delete("/", verifyAdmin, deleteBanner);

export default router;
