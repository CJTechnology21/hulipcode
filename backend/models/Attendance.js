// models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Full Day", "Half Day"],
    default: "Full Day",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // optional, if you have a project collection
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
