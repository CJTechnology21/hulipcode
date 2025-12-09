const mongoose = require("mongoose");

// Proof schema for task submission
const proofSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["photo", "video", "checklist"],
    required: true,
  },
  url: { type: String, required: true }, // S3 URL or file path
  thumbnail: { type: String }, // For videos
  gps: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number }, // GPS accuracy in meters
  },
  timestamp: { type: Date, required: true }, // When proof was captured
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Additional metadata (file size, duration, etc.)
  },
}, { _id: true });

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
    },
    startDate: { type: Date },
    endDate: { type: Date },
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "REJECTED"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    // ✅ New fields for Task Manager module
    value: {
      type: Number,
      min: 0,
      default: 0,
      // Value of this task in project currency (e.g., ₹50,000)
    },
    weight_pct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      // Weight percentage for progress calculation (e.g., 15% of project)
    },
    proofs: {
      type: [proofSchema],
      default: [],
      // Array of proof objects (photos, videos, or checklist items)
    },
    rejection_reason: {
      type: String,
      // Reason for rejection when status is REJECTED
    },
    submittedAt: { type: Date }, // When task was submitted for review
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: { type: Date }, // When task was approved
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: { type: Date }, // When task was rejected
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    checklist: {
      type: [
        {
          item: { type: String, required: true },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes for performance
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);
