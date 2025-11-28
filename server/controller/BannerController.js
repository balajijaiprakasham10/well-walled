import { BannerCollection } from "../models/Banner.js";
import { cloudinary } from "../middleware/uploadCloud.js";

// ✅ Normalize Page Key (Single Source of Truth)
const normalizePage = (page) => page.toLowerCase();

// =======================
// UPLOAD OR UPDATE BANNER
// =======================
export const uploadBanner = async (req, res) => {
  try {
    let { page } = req.body;

    // 1. Validation
    if (!page) return res.status(400).json({ msg: "Page name is required." });
    if (!req.file)
      return res.status(400).json({ msg: "No banner file uploaded." });

    // ✅ Normalize page name
    page = normalizePage(page);

    const { path: mediaUrl, filename: publicId } = req.file;
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    // 2. Check if Existing Banner
    const existingBanner = await BannerCollection.findOne({ page });

    // ✅ DELETE OLD FILE FIRST
    if (existingBanner?.publicId) {
      await cloudinary.uploader.destroy(existingBanner.publicId, {
        resource_type: existingBanner.mediaType || "image",
        invalidate: true,
      });
    }

    // 3. UPDATE OR INSERT
    const bannerPayload = {
      page,
      mediaUrl,
      publicId,
      mediaType,
      uploadedAt: new Date(),
    };

    if (existingBanner) {
      await BannerCollection.updateOne(
        { _id: existingBanner._id },
        { $set: bannerPayload }
      );
      return res.json({ msg: `Banner updated for ${page}` });
    }

    await BannerCollection.insertOne(bannerPayload);
    res.status(201).json({ msg: `Banner uploaded for ${page}` });
  } catch (err) {
    console.error("Banner Upload Error:", err.message);
    res.status(500).send("Banner upload failed.");
  }
};

// =======================
// GET BANNER
// =======================
export const getBanner = async (req, res) => {
  try {
    let { page } = req.query;

    if (!page) return res.status(400).json({ msg: "Page is required." });

    // ✅ Normalize page for lookup
    page = normalizePage(page);

    const banner = await BannerCollection.findOne({ page });
    if (!banner) return res.status(404).json({ msg: `No banner for ${page}` });

    res.json(banner);
  } catch (err) {
    console.error("Banner Fetch Error:", err.message);
    res.status(500).send("Failed to fetch banner.");
  }
};

// =======================
// DELETE BANNER
// =======================
export const deleteBanner = async (req, res) => {
  try {
    let { page } = req.query;

    if (!page) return res.status(400).json({ msg: "Page is required." });

    // ✅ Normalize page
    page = normalizePage(page);

    const banner = await BannerCollection.findOne({ page });
    if (!banner) return res.status(404).json({ msg: "Banner not found." });

    // ✅ Destroy from Cloudinary
    if (banner.publicId) {
      await cloudinary.uploader.destroy(banner.publicId, {
        resource_type: banner.mediaType || "image",
        invalidate: true,
      });
    }

    await BannerCollection.deleteOne({ _id: banner._id });
    res.json({ msg: `Banner deleted for ${page}` });
  } catch (err) {
    console.error("Banner Delete Error:", err.message);
    res.status(500).send("Delete failed.");
  }
};
