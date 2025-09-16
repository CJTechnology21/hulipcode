const mongoose = require('mongoose');

const PendingMaterialSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // who’s adding these pending materials
    },

    materials: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true, trim: true },
        hsn: { type: String, trim: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: "pcs" },
        deliveryDate: { type: Date, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "converted","approved","rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingMaterial", PendingMaterialSchema);
