const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
