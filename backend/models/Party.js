const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", 
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
      enum: ["AdvancePaid", "ToPay"], 
      required: true,
    },
     description: [
      {
        date: { type: Date, required: true },
        desc: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Party", PartySchema);

// const mongoose = require("mongoose");

// const PartySchema = new mongoose.Schema(
//   {
//     projectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project", 
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     type: {
//       type: String,
//       enum: ["Vendor", "Client", "Contractor", "Miss"],
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     paymentType: {
//       type: String,
//       enum: ["AdvancePaid", "ToPay"], 
//       required: true,
//     },
    
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Party", PartySchema);
