const mongoose = require("mongoose");

// Version schema with multiple images
const VersionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  images: [
    { type: String, required: true } // Array of image URLs
  ],
});

// TwoDLayout schema with comments referencing User
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
    // Comments array with author referencing User model
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

// const mongoose = require("mongoose");

// const VersionSchema = new mongoose.Schema({
//   label: { type: String, required: true },
//   image: { type: String, required: true },
// });

// const TwoDLayoutSchema = new mongoose.Schema(
//   {
//     projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
//     name: { type: String, required: true },
//     area: { type: String, required: true },
//     fileTypes: [{ type: String, enum: ["Flooring", "Electrical", "Plumbing"] }],
//     versions: [VersionSchema],
//     assigned: {
//       name: String,
//       color: String,
//     },
//     uploaded: { type: Date, default: Date.now },
//     status: {
//       type: String,
//       enum: ["Approved", "Rejected", "Draft", "Review"],
//       default: "Draft",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("TwoDLayout", TwoDLayoutSchema);
