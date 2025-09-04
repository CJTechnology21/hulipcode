const mongoose = require("mongoose");
const Counter = require("./Counter"); // shared counter model

const quoteSchema = new mongoose.Schema(
  {
    qid: { type: String }, // auto-generated display ID (Q001, Q002, ...)
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true }, // reference Lead
    // budget: { type: String, required: true },
    // contact: { type: String, required: true },
    quoteAmount: { type: String, required: true },
    city: { type: String, default: "N/A" },

    // multiple users assigned to this quote
    assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
      default: "Send",
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate auto QID
quoteSchema.pre("save", async function (next) {
  if (!this.qid) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "quoteId" }, // separate counter for quotes
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format -> Q001, Q002, ...
      this.qid = "Q" + String(counter.seq).padStart(3, "0");
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Quote", quoteSchema);

// const mongoose = require("mongoose");
// const Counter = require("./Counter"); // same counter schema you're using for projects

// const quoteSchema = new mongoose.Schema(
//   {
//     qid: { type: String }, 
//     name: { type: String, required: true },
//     leadId: { type: String, required: true },
//     budget: { type: String, required: true },
//     contact: { type: String, required: true },
//     quoteAmount: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
//       default: "Send",
//     },
//   },
//   { timestamps: true }
// );

// // Pre-save hook to generate auto QID
// quoteSchema.pre("save", async function (next) {
//   if (!this.qid) {
//     try {
//       const counter = await Counter.findOneAndUpdate(
//         { name: "quoteId" }, // keep this separate from project counter
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );

//       // Format -> Q001, Q002, ...
//       this.qid = "Q" + String(counter.seq).padStart(3, "0");
//       next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("Quote", quoteSchema);
