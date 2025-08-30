// models/Attendance.js
const mongoose = require("mongoose"); const projectattendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personType: { type: String, enum: ["Site Staff", "Labour", "Contractor", "Subcon"] },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Full Day", "Half Day", "Paid Leave", "Week Off"], default: "Full Day" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  lastMonthAttendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Full Day", "Half Day", "Absent"], required: true },
    }
  ],
}, { timestamps: true });



module.exports = mongoose.model("Projecttendance", projectattendanceSchema);

// // models/Attendance.js
// const mongoose = require("mongoose");

// const projectattendanceSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Full Day", "Half Day", "Paid Leave", "Week Off"],
//     default: "Full Day",
//   },
//   projectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Project", // optional, if you have a project collection
//     required: false,
//   },

//   // ✅ New fields
//   lastMonthAttendance: {
//     type: [ // Array of objects for storing daily attendance in last month
//       {
//         date: { type: Date, required: true },
//         status: { type: String, enum: ["Full Day", "Half Day", "Absent"], required: true }
//       }
//     ],
//     default: []
//   },

//   personType: {
//     type: String,
//     enum: ["Site Staff", "Labour", "Contractor", "Subcon"],
//     required: false
//   }

// }, { timestamps: true });

// module.exports = mongoose.model("Projecttendance", projectattendanceSchema); 