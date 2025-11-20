const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  // Stores the relative path where the file is served from Express (e.g., 'uploads/banner/...')
  imagePath: {
    type: String,
    required: true,
    unique: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Exports the Banner model, which will be used in the router
module.exports = mongoose.model("Banner", BannerSchema);
