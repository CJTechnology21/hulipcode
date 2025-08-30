const mongoose = require("mongoose");

const attendanceEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Full date (e.g., 2025-08-30)
  status: {
    type: String,
    enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
    required: true,
  },
});

const monthlyAttendanceSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., "2025-08"
  records: [attendanceEntrySchema], // All days for this month
});

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
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
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    // ✅ Current day's attendance
    attendance: {
      date: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
        default: "Full Day",
      },
    },

    // ✅ Attendance history grouped by month
    attendanceHistory: [monthlyAttendanceSchema],
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

//     // ✅ Attendance for the current day
//     attendance: {
//       date: { type: Date, default: Date.now },
//       status: {
//         type: String,
//         enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
//         default: "Full Day",
//       },
//     },

//     // ✅ Attendance history (e.g., last month / past records)
//     attendanceHistory: [
//       {
//         date: { type: Date, required: true },
//         status: {
//           type: String,
//           enum: ["Full Day", "Half Day", "Paid Leave", "Week Off", "Absent"],
//           required: true,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Staff", staffSchema);