import express from "express";
import {
  uploadBanner,
  getBanner,
  deleteBanner,
} from "../controller/BannerController.js";
import { uploadBannerMedia } from "../middleware/uploadCloud.js"; // 👈 from step 1
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBanner);

// Field name here must match your form / frontend
// e.g. formData.append("bannerFile", file)
router.post(
  "/",
  verifyAdmin,
  uploadBannerMedia.single("bannerFile"), // <--- change field name as you like
  uploadBanner
);

router.delete("/", verifyAdmin, deleteBanner);

export default router;
