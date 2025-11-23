import { BannerCollection } from "../models/Banner.js"; // New Data API collection
import fs from "fs";
import path from "path";
import { ObjectId } from "@datastax/astra-db-ts"; // Required for ID-based queries

// --- UPLOAD OR UPDATE BANNER IMAGE ---
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No banner image uploaded." });
    }

    const newImagePath = req.file.path.replace(/\\/g, "/");

    // Check if a banner already exists
    const existingBanner = await BannerCollection.findOne({});

    if (existingBanner) {
      // Delete previously stored banner file
      const oldImagePath = path.join(__dirname, "..", existingBanner.imagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Update existing banner document
      await BannerCollection.updateOne(
        { _id: new ObjectId(existingBanner._id) },
        { $set: { imagePath: newImagePath, uploadedAt: new Date() } }
      );

      return res.json({ msg: "Banner image updated successfully." });
    }

    // Create new banner
    await BannerCollection.insertOne({
      imagePath: newImagePath,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      msg: "Banner image uploaded successfully.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner upload.");
  }
};

// --- GET BANNER IMAGE ---
export const getBanner = async (req, res) => {
  try {
    const banner = await BannerCollection.findOne({});
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
export const deleteBanner = async (req, res) => {
  try {
    const banner = await BannerCollection.findOne({});
    if (!banner) {
      return res.status(404).json({ msg: "No banner to delete." });
    }

    // Delete physical file
    const filePath = path.join(__dirname, "..", banner.imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the document
    await BannerCollection.deleteOne({ _id: new ObjectId(banner._id) });

    res.json({ msg: "Banner image deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner deletion.");
  }
};
