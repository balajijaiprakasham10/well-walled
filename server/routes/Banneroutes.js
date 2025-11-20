const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises"); // Node's file system for deleting files

// Import Model
const Banner = require("../models/BannerImage");

// Define the static paths
const UPLOAD_FOLDER = path.join(__dirname, "..", "uploads", "banner");

// Ensure the upload folder exists
fs.mkdir(UPLOAD_FOLDER, { recursive: true });

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    // Create a unique filename based on the timestamp to avoid naming conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// --- HELPER FUNCTION: Deletes the physical image file ---
const deletePhysicalImage = async (imagePath) => {
  // Convert the relative path (e.g., 'uploads/banner/...') to an absolute path for fs.unlink
  const absolutePath = path.join(__dirname, "..", imagePath);
  try {
    await fs.unlink(absolutePath);
    console.log(`Successfully deleted old file: ${absolutePath}`);
  } catch (error) {
    // Ignore if the file was not found (ENOENT)
    if (error.code !== "ENOENT") {
      console.error("Error deleting physical image file:", error);
    }
  }
};

// @route   GET /api/banner
// @desc    Get the current banner image metadata (Expected 404 if not found, 200 if found)
router.get("/", async (req, res) => {
  try {
    // Use findOne({}) to retrieve the single active banner document
    const banner = await Banner.findOne({});

    if (banner) {
      return res.json(banner);
    } else {
      // Returns 404 Not Found, which your React component handles correctly
      return res.status(404).json({ msg: "No banner image found" });
    }
  } catch (error) {
    console.error("Error fetching banner:", error.message);
    res.status(500).json({ msg: "Server Error while fetching banner" });
  }
});

// @route   POST /api/banner
// @desc    Upload/Update the banner image
router.post("/", upload.single("bannerImage"), async (req, res) => {
  // 'bannerImage' must match the FormData key in the React component
  if (!req.file) {
    return res
      .status(400)
      .json({
        msg: "No file uploaded or file type is unsupported/too large (max 5MB).",
      });
  }

  try {
    // Path used for the database (e.g., 'uploads/banner/...')
    const filePath = `uploads/banner/${req.file.filename}`;

    // Find existing banner to potentially delete the old image
    const existingBanner = await Banner.findOne({});

    if (existingBanner) {
      // 1. Delete the old physical image file
      await deletePhysicalImage(existingBanner.imagePath);

      // 2. Update the existing MongoDB document
      existingBanner.imagePath = filePath;
      existingBanner.uploadedAt = Date.now();
      await existingBanner.save();
      return res.json({
        msg: "Banner image updated successfully!",
        banner: existingBanner,
      });
    } else {
      // 1. Create a new MongoDB document
      const newBanner = await Banner.create({ imagePath: filePath });
      return res.json({
        msg: "Banner image uploaded successfully!",
        banner: newBanner,
      });
    }
  } catch (error) {
    console.error("Banner upload failed:", error.message);
    // If DB save fails, delete the newly uploaded file to clean up
    deletePhysicalImage(req.file.path);
    res.status(500).json({ msg: "Server Error during banner upload/update" });
  }
});

// @route   DELETE /api/banner
// @desc    Delete the current banner image
router.delete("/", async (req, res) => {
  try {
    const banner = await Banner.findOne({});

    if (!banner) {
      return res.status(404).json({ msg: "No banner to delete" });
    }

    // 1. Delete the physical image file
    await deletePhysicalImage(banner.imagePath);

    // 2. Delete the MongoDB document
    await Banner.deleteOne({ _id: banner._id });

    res.json({ msg: "Banner image deleted successfully" });
  } catch (error) {
    console.error("Banner deletion failed:", error.message);
    res.status(500).json({ msg: "Server Error during banner deletion" });
  }
});

module.exports = router;
