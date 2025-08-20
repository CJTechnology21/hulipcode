const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    firm: {
      type: String,
      required: [true, "Firm name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Invoice date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"], // link to project
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
