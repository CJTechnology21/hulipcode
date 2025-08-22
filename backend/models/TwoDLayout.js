

const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  image: { type: String, required: true },
});

const TwoDLayoutSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    area: { type: String, required: true },
    fileTypes: [{ type: String, enum: ["Flooring", "Electrical", "Plumbing"] }],
    versions: [VersionSchema],
    assigned: {
      name: String,
      color: String,
    },
    uploaded: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Draft", "Review"],
      default: "Draft",
    },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TwoDLayout", TwoDLayoutSchema);
