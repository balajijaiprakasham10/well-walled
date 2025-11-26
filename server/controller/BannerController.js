import { BannerCollection } from "../models/Banner.js";
import { cloudinary } from "../middleware/uploadCloud.js"; // from step 1

// --- UPLOAD OR UPDATE BANNER (IMAGE OR VIDEO) ---
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No banner file uploaded." });
    }

    // Multer + Cloudinary gives us these:
const { path: mediaUrl, filename: publicId } = req.file;

// ✅ Reliable video detection
const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";



    // Check if a banner already exists
    const existingBanner = await BannerCollection.findOne({});

    if (existingBanner) {
      // Delete previous media from Cloudinary
      if (existingBanner.publicId) {
        try {
          await cloudinary.uploader.destroy(existingBanner.publicId, {
            resource_type: existingBanner.mediaType || "image",
            invalidate: true,
          });
        } catch (err) {
          console.error("Error deleting old Cloudinary banner:", err.message);
        }
      }

      // Update existing banner document
     await BannerCollection.updateOne(
       { _id: existingBanner._id },
       {
         $set: {
           mediaUrl,
           publicId,
           mediaType,
           uploadedAt: new Date(),
         },
       }
     );


      return res.json({ msg: "Banner updated successfully." });
    }

    // Create new banner
    // Create new banner
    await BannerCollection.insertOne({
      mediaUrl,
      publicId,
      mediaType,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      msg: "Banner uploaded successfully.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner upload.");
  }
};

// --- GET BANNER (IMAGE OR VIDEO) ---
export const getBanner = async (req, res) => {
  try {
    const banner = await BannerCollection.findOne({});
    if (!banner) {
      return res.status(404).json({ msg: "No banner found." });
    }
    res.json(banner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner fetch.");
  }
};

// --- DELETE BANNER MEDIA ---
export const deleteBanner = async (req, res) => {
  try {
    const banner = await BannerCollection.findOne({});
    if (!banner) {
      return res.status(404).json({ msg: "No banner to delete." });
    }

    // Delete file from Cloudinary
    if (banner.publicId) {
      try {
        await cloudinary.uploader.destroy(banner.publicId, {
          resource_type: banner.mediaType || "image",
          invalidate: true,
        });
      } catch (err) {
        console.error("Error deleting Cloudinary banner:", err.message);
      }
    }

    // Remove the document
    await BannerCollection.deleteOne({ _id: banner._id });

    res.json({ msg: "Banner deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during banner deletion.");
  }
};
