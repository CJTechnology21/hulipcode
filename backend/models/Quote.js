const mongoose = require("mongoose");
const Counter = require("./Counter");

const summarySchema = new mongoose.Schema(
  {
    space: { type: String, required: true },
    workPackages: { type: Number, default: 0 },
    items: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    qid: { type: String },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    quoteAmount: { type: String, required: true },
    city: { type: String, default: "N/A" },
    assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
      default: "Send",
    },
    summary: [summarySchema], // 🔥 Add summary here
  },
  { timestamps: true }
);

// Pre-save hook to generate auto QID
quoteSchema.pre("save", async function (next) {
  if (!this.qid) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "quoteId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
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
// const Counter = require("./Counter"); 

// const quoteSchema = new mongoose.Schema(
//   {
//     qid: { type: String }, 
//     leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true }, 
//     quoteAmount: { type: String, required: true },
//     city: { type: String, default: "N/A" },
//     assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
//         { name: "quoteId" }, 
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
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
