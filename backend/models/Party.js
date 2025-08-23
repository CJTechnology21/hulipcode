const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // assuming you have a Project model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Vendor", "Client", "Contractor","Miss"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Party", PartySchema);
