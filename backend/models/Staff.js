const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    personType: {
      type: String,
      enum: ["Site Staff", "Labour Contractor", "Subcon"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // ✅ Attendance for the current day
    attendance: {
      date: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
        default: "Full Day",
      },
    },

    // ✅ Attendance history (e.g., last month / past records)
    attendanceHistory: [
      {
        date: { type: Date, required: true },
        status: {
          type: String,
          enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
// const mongoose = require("mongoose");

// const staffSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     personType: {
//       type: String,
//       enum: ["Site Staff", "Labour Contractor", "Subcon"],
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Active", "Inactive"],
//       default: "Active",
//     },
//     projectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Staff", staffSchema);
