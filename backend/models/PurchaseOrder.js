// models/PurchaseOrder.js
const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    architect: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    quotes: [
      {
        material: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ.materials" },
        productName: String,
        price: Number,
        quantity: Number,
        remarks: String,
      },
    ],

    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["draft", "confirmed", "completed", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
