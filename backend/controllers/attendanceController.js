// controllers/attendanceController.js
const Attendance = require("../models/Attendance");

// Create new attendance record
const createAttendance = async (req, res) => {
  try {
    const { name, date, status, projectId } = req.body;

    const attendance = new Attendance({
      name,
      date,
      status,
      projectId,
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all attendance records
const getAttendance = async (req, res) => {
  try {
    const { projectId } = req.query; // optional filtering by project
    const query = projectId ? { projectId } : {};
    const records = await Attendance.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports={getAttendance,createAttendance}
