// server/controllers/bannerController.js

const BannerImage = require("../models/BannerImage");
const fs = require("fs");
const path = require("path");

// --- UPLOAD OR UPDATE BANNER IMAGE ---
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No banner image uploaded." });
    }

    const newImagePath = req.file.path.replace(/\\/g, "/"); // Normalize path

    // 1. Check if a banner image already exists
    let existingBanner = await BannerImage.findOne();

    if (existingBanner) {
      // 2. If exists, delete the old file
      const oldImagePath = path.join(__dirname, "..", existingBanner.imagePath);
      fs.unlink(oldImagePath, (err) => {
        if (err)
          console.error(
            `Failed to delete old banner file: ${oldImagePath}`,
            err
          );
      });

      // 3. Update the existing banner record
      existingBanner.imagePath = newImagePath;
      await existingBanner.save();
      return res.json({
        msg: "Banner image updated successfully.",
        banner: existingBanner,
      });
    } else {
      // 4. If no banner exists, create a new one
      const newBanner = new BannerImage({ imagePath: newImagePath });
      await newBanner.save();
      return res
        .status(201)
        .json({
          msg: "Banner image uploaded successfully.",
          banner: newBanner,
        });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner upload.");
  }
};

// --- GET BANNER IMAGE ---
exports.getBanner = async (req, res) => {
  try {
    const banner = await BannerImage.findOne();
    if (!banner) {
      return res.status(404).json({ msg: "No banner image found." });
    }
    res.json(banner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner fetch.");
  }
};

// --- DELETE BANNER IMAGE ---
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await BannerImage.findOne();
    if (!banner) {
      return res.status(404).json({ msg: "No banner image to delete." });
    }

    // Delete the file from the uploads directory
    const imagePath = path.join(__dirname, "..", banner.imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) console.error(`Failed to delete banner file: ${imagePath}`, err);
    });

    // Delete the record from the database
    await BannerImage.deleteOne({ _id: banner._id }); // Use deleteOne with query or findByIdAndDelete

    res.json({ msg: "Banner image deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner deletion.");
  }
};
