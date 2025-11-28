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

// Field name here must match your form / frontend
// e.g. formData.append("bannerFile", file)
router.post("/", verifyAdmin, uploadBanners.single("bannerFile"), uploadBanner);


router.delete("/", verifyAdmin, deleteBanner);

export default router;
