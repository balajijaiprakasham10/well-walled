import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⚠️ This storage will accept both images & videos for banners.
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Decide resource_type based on mimetype
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "banners", // your Cloudinary folder
      resource_type: isVideo ? "video" : "image", // important!
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Use this for banner uploads
export const uploadBannerMedia = multer({ storage: bannerStorage });
export { cloudinary }; // export if you want to use it in controller
