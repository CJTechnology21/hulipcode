const mongoose = require("mongoose");

const subconOrderSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("SubconOrder", subconOrderSchema);

// const mongoose = require('mongoose')

// const subconOrderSchema = new mongoose.Schema(
//     {
//         projectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Project",
//             required: true,
//         },
//         architectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         todo: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Todo",
//             required: true,
//         },
//         task: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Task",
//             required: true,
//         },
//         staff: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Staff",
//             required: true,
//         },
//         amount: {
//             type: Number,
//             required: true,
//         },
//         startDate: {
//             type: Date,
//         },
//         endDate: {
//             type: Date,
//         },
//         notes: {
//             type: String,
//             trim: true,
//         },
//         status: {
//             type: String,
//             enum: ["pending", "in-progress", "completed", "cancelled"],
//             default: "pending",
//         },
//     },
//     { timestamps: true }
// );

//  mongoose.model("SubconOrder", subconOrderSchema);
