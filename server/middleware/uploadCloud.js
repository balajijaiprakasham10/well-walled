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

/* ===============================
   PROJECT IMAGES ONLY (MULTI)
================================ */
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadProjects = multer({ storage: projectStorage });

/* ===============================
   BANNERS / VIDEOS UPLOAD
================================ */
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "banners",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export const uploadBanners = multer({ storage: bannerStorage });

export { cloudinary };
