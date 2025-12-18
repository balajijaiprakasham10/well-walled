import { BannerCollection } from "../models/Banner.js";
import { cloudinary } from "../middleware/uploadCloud.js";

const normalizePage = (page) => page.toLowerCase();

// =======================
// UPLOAD OR UPDATE BANNER
// =======================
export const uploadBanner = async (req, res) => {
  try {
    let { page } = req.body;

    // 1. Validation
    if (!page) return res.status(400).json({ msg: "Page name is required." });

    // Check if at least one file is uploaded
    const files = req.files || {};
    if (!files.bannerFile && !files.mobileFile) {
      return res.status(400).json({ msg: "No files uploaded." });
    }

    page = normalizePage(page);

    // 2. Find Existing Banner Document
    const existingBanner = await BannerCollection.findOne({ page });

    // Prepare update payload
    const updatePayload = {
      page,
      updatedAt: new Date(),
    };

    // --- HANDLE DESKTOP BANNER ---
    if (files.bannerFile && files.bannerFile[0]) {
      const file = files.bannerFile[0];

      // Delete old desktop image if exists
      if (existingBanner?.publicId) {
        await cloudinary.uploader.destroy(existingBanner.publicId);
      }

      updatePayload.mediaUrl = file.path;
      updatePayload.publicId = file.filename;
      updatePayload.mediaType = file.mimetype.startsWith("video")
        ? "video"
        : "image";
    }

    // --- HANDLE MOBILE BANNER ---
    if (files.mobileFile && files.mobileFile[0]) {
      const file = files.mobileFile[0];

      // Delete old mobile image if exists
      if (existingBanner?.mobilePublicId) {
        await cloudinary.uploader.destroy(existingBanner.mobilePublicId);
      }

      updatePayload.mobileMediaUrl = file.path;
      updatePayload.mobilePublicId = file.filename;
      updatePayload.mobileMediaType = file.mimetype.startsWith("video")
        ? "video"
        : "image";
    }

    // 3. Update Database
    if (existingBanner) {
      await BannerCollection.updateOne(
        { _id: existingBanner._id },
        { $set: updatePayload }
      );
      return res.json({ msg: `Banner updated for ${page}` });
    } else {
      // Create new document if it doesn't exist
      // Note: If uploading only mobile for the first time, desktop fields will be undefined (handled by frontend checks)
      await BannerCollection.insertOne({
        ...updatePayload,
        uploadedAt: new Date(),
      });
      return res.status(201).json({ msg: `Banner created for ${page}` });
    }
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
    let { page, type } = req.query; // Add 'type' query param (optional) to delete specific image

    if (!page) return res.status(400).json({ msg: "Page is required." });
    page = normalizePage(page);

    const banner = await BannerCollection.findOne({ page });
    if (!banner) return res.status(404).json({ msg: "Banner not found." });

    // Helper to delete from cloudinary
    const deleteCloudinary = async (pid, mType) => {
      if (pid) {
        await cloudinary.uploader.destroy(pid, {
          resource_type: mType || "image",
          invalidate: true,
        });
      }
    };

    // If type is specified (e.g., 'mobile' or 'desktop'), delete only that field
    if (type === "mobile") {
      await deleteCloudinary(banner.mobilePublicId, banner.mobileMediaType);
      await BannerCollection.updateOne(
        { _id: banner._id },
        {
          $unset: {
            mobileMediaUrl: "",
            mobilePublicId: "",
            mobileMediaType: "",
          },
        }
      );
      return res.json({ msg: `Mobile banner deleted for ${page}` });
    }

    if (type === "desktop") {
      await deleteCloudinary(banner.publicId, banner.mediaType);
      await BannerCollection.updateOne(
        { _id: banner._id },
        {
          $unset: { mediaUrl: "", publicId: "", mediaType: "" },
        }
      );
      return res.json({ msg: `Desktop banner deleted for ${page}` });
    }

    // Default: Delete EVERYTHING (Document and both images)
    await deleteCloudinary(banner.publicId, banner.mediaType);
    await deleteCloudinary(banner.mobilePublicId, banner.mobileMediaType);

    await BannerCollection.deleteOne({ _id: banner._id });
    res.json({ msg: `All banners deleted for ${page}` });
  } catch (err) {
    console.error("Banner Delete Error:", err.message);
    res.status(500).send("Delete failed.");
  }
};
