const mongoose = require("mongoose");
const Counter = require("./Counter");

// Deliverables schema
const deliverableSchema = new mongoose.Schema(
  {
    code: String,
    category: String,
    description: String,
    spec: String,
    photo: String,
    hsn: String,
    unit: String,
    qty: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
  },
  { _id: true } // keep _id to match controllers
);

// Doors & Windows schema
const openingSchema = new mongoose.Schema(
  {
    name: String,
    h: Number,
    w: Number,
  },
  { _id: true } // keep _id
);

// Space details inside summary
const spaceDetailSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    length: Number,
    breadth: Number,
    height: Number,
    unit: { type: String, default: "Feet" },
    perimeter: Number,
    floorArea: Number,
    wallArea: Number,
  },
  { _id: true } // keep _id
);

// Summary schema
const summarySchema = new mongoose.Schema(
  {
    space: { type: String, required: true },
    workPackages: Number,
    items: Number,
    amount: Number,
    tax: Number,
    spaces: [spaceDetailSchema],
    deliverables: [deliverableSchema],
    openings: [openingSchema],
  },
  { timestamps: true } // each summary row has its own _id
);

// Quote schema
const quoteSchema = new mongoose.Schema(
  {
    qid: String,
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    quoteAmount: { type: Number, default: 0 },
    city: { type: String, default: "N/A" },
    assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
      default: "Send",
    },
    summary: [summarySchema], // summary array
  },
  { timestamps: true }
);

// Auto QID generator
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

//schema with Id but some wrong assumptions
// const mongoose = require("mongoose");
// const Counter = require("./Counter");

// // Deliverables schema
// const deliverableSchema = new mongoose.Schema(
//   {
//     code: String,
//     category: String,
//     description: String,
//     spec: String,
//     photo: String,
//     hsn: String,
//     unit: String,
//     qty: { type: Number, default: 0 },
//     rate: { type: Number, default: 0 },
//     gst: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// // Doors & Windows schema
// const openingSchema = new mongoose.Schema(
//   {
//     name: String, // Door 1, Window 2, etc.
//     h: Number,
//     w: Number,
//   },
//   { _id: false }
// );

// // Space schema (⚡ now has its own _id)
// const spaceSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },     // e.g. "Master Bedroom Toilet"
//     category: { type: String, required: true }, // e.g. "Toilet"

//     // Dimensions
//     length: Number,
//     breadth: Number,
//     height: Number,
//     unit: { type: String, default: "Feet" },

//     // Derived values
//     perimeter: Number,
//     floorArea: Number,
//     wallArea: Number,

//     // Doors / windows
//     openings: [openingSchema],

//     // Deliverables
//     deliverables: [deliverableSchema],

//     // Subtotal for this space
//     spaceAmount: { type: Number, default: 0 },
//   },
//   { timestamps: true } // ⚡ keep _id enabled by default
// );

// // Main Quote Schema
// const quoteSchema = new mongoose.Schema(
//   {
//     qid: { type: String },
//     leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
//     quoteAmount: { type: Number, default: 0 }, // 👌 keep numeric
//     city: { type: String, default: "N/A" },
//     assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     status: {
//       type: String,
//       enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
//       default: "Send",
//     },
//     // Summary references spaceId
//     summary: [
//       {
//         spaceId: { type: mongoose.Schema.Types.ObjectId }, 
//         spaceName: String, // denormalized for quick access
//         workPackages: Number,
//         items: Number,
//         amount: Number,
//         tax: Number,
//       },
//     ],  
//   },
//   { timestamps: true }
// );

// // Auto QID generator
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



//schema with spaces based on indices
// const mongoose = require("mongoose");
// const Counter = require("./Counter");

// // Deliverables schema
// const deliverableSchema = new mongoose.Schema(
//   {
//     code: String,
//     category: String,
//     description: String,
//     spec: String,
//     photo: String,
//     hsn: String,
//     unit: String,
//     qty: { type: Number, default: 0 },
//     rate: { type: Number, default: 0 },
//     gst: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// // Doors & Windows schema
// const openingSchema = new mongoose.Schema(
//   {
//     name: String, // Door 1, Window 2, etc.
//     h: Number,
//     w: Number,
//   },
//   { _id: false }
// );

// // Space schema
// const spaceSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true }, // e.g. "Master Bedroom Toilet"
//     category: { type: String, required: true }, // e.g. "Toilet"

//     // Dimensions
//     length: Number,
//     breadth: Number,
//     height: Number,
//     unit: { type: String, default: "Feet" },

//     // Derived values
//     perimeter: Number,
//     floorArea: Number,
//     wallArea: Number,

//     // Doors / windows
//     openings: [openingSchema],

//     // Deliverables
//     deliverables: [deliverableSchema],

//     // Subtotal for this space
//     spaceAmount: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// // Main Quote Schema
// const quoteSchema = new mongoose.Schema(
//   {
//     qid: { type: String },
//     leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
//     quoteAmount: { type: Number, default: 0 }, // 👈 better to keep as Number, not String
//     city: { type: String, default: "N/A" },
//     assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     status: {
//       type: String,
//       enum: ["Send", "In Review", "Shortlisted", "Approved", "Rejected"],
//       default: "Send",
//     },

//     //  New field for spaces
//     spaces: [spaceSchema],

//     // Existing summary (can keep for faster lookups, or compute dynamically)
//     summary: [
//       {
//         space: String,
//         workPackages: Number,
//         items: Number,
//         amount: Number,
//         tax: Number,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Auto QID generator
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
