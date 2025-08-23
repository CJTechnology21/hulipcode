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
      enum: ["Vendor", "Client", "Contractor", "Miss"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ["AdvancePaid", "ToPay"], // restrict values to these two
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Party", PartySchema);
