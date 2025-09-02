const mongoose = require("mongoose");

// Allowed categories
const categories = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Hall",
  "Study Room",
  "Balcony",
  "Toilet",
];

// Sub-schema for openings (doors/windows)
const OpeningSchema = new mongoose.Schema({
  type: { type: String, enum: ["Door", "Window"], required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
});

// Sub-schema for individual spaces in a site measurement
const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: categories, required: true }, // enum validation
  length: { type: Number, required: true },
  breadth: { type: Number, required: true },
  height: { type: Number, required: true },
  openings: [OpeningSchema],
  custom: { type: Boolean, default: false },
  perimeter: { type: Number },
  floorArea: { type: Number },
  wallArea: { type: Number },
});

// Main schema for site measurements
const SiteMeasurementSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spaces: [SpaceSchema],
    notes: { type: String },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteMeasurement", SiteMeasurementSchema);
