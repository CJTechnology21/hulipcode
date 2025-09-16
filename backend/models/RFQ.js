const mongoose = require("mongoose");

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
      enum: ["GST", "VAT", "NONE", "item", "bill"],
      default: "GST",
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
        name: { type: String, required: true, trim: true },
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
      default: "draft",
    },

    // ✅ Supplier responses
    responses: [
      {
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quotes: [
          {
            material: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            productName: { type: String, required: true }, // ✅ added
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            remarks: { type: String },
          },
        ],
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["submitted", "withdrawn"],
          default: "submitted",
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RFQ", RFQSchema);

// const mongoose = require('mongoose');

// const RFQSchema = new mongoose.Schema(
//   {
//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },

//     date: { type: Date, default: Date.now },
//     taxType: {
//       type: String,
//       enum: ["GST", "VAT", "NONE", "item","bill"], 
//       default: "GST"
//     },
//     deliveryLocation: { type: String, required: true },

//     biddingStartDate: { type: Date, required: true },
//     biddingEndDate: { type: Date, required: true },
//     deliveryDate: { type: Date, required: true },

//     materials: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         name: { type: String, required: true, trim: true },
//         hsn: { type: String, trim: true },
//         quantity: { type: Number, required: true },
//         unit: { type: String, default: "pcs" },
//         deliveryDate: { type: Date, required: true },
//       },
//     ],

//     terms: { type: String },

//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft"
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("RFQ", RFQSchema);

