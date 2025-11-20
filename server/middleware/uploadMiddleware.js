// server/middleware/uploadMiddleware.js
const multer = require("multer");

// Define storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the 'uploads/' directory exists in the server root
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use a unique name to prevent collisions
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize Multer upload instance
const upload = multer({ storage: storage });

// Export the upload instance
module.exports = { upload };
// Note: We export it as an object property named 'upload'
// to match the destructuring import: const { upload } = require(...)
