const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    date: { type: Date, default: Date.now },
    taxType: { 
      type: String, 
      enum: ["GST", "VAT", "NONE", "item"], // added "item" for your sample data
      default: "GST" 
    },
    deliveryLocation: { type: String, required: true },

    biddingStartDate: { type: Date, required: true },
    biddingEndDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },

    materials: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
          required: true,
        },
        hsn: { type: String, trim: true }, 
        quantity: { type: Number, required: true },
        unit: { type: String, default: "pcs" },
        deliveryDate: { type: Date, required: true },
      },
    ],

    terms: { type: String },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    status: {
      type: String, 
      enum: ["draft", "published"], 
      default: "draft"
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("RFQ", RFQSchema);

