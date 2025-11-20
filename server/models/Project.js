// backend/models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  // Store the paths/URLs to the uploaded images
  images: {
    before: { type: String, required: true },
    cad: { type: String, required: true },
    after: { type: String, required: true },
  },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
