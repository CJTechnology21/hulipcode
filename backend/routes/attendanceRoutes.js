const express = require("express");
const router = express.Router();
const {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getCurrentMonthAttendance, // ✅ import new controller
} = require("../controllers/attendanceController");

// @route   POST /api/attendance
// @desc    Create a new attendance record
router.post("/", createAttendance);

// @route   GET /api/attendance
// @desc    Get all attendance records (optionally filtered by projectId)
router.get("/", getAttendance);

// @route   GET /api/attendance/current-month
// @desc    Get attendance records for the current month (1st → today, optionally filtered by name)
router.get("/current-month", getCurrentMonthAttendance);

// @route   PUT /api/attendance/:id
// @desc    Update an attendance record by ID
router.put("/:id", updateAttendance);

// @route   DELETE /api/attendance/:id
// @desc    Delete an attendance record by ID
router.delete("/:id", deleteAttendance);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   createAttendance,
//   getAttendance,
//   updateAttendance,
//   deleteAttendance,
// } = require("../controllers/attendanceController");

// // @route   POST /api/attendance
// // @desc    Create a new attendance record
// router.post("/", createAttendance);

// // @route   GET /api/attendance
// // @desc    Get all attendance records (optionally filtered by projectId)
// router.get("/", getAttendance);

// // @route   PUT /api/attendance/:id
// // @desc    Update an attendance record by ID
// router.put("/:id", updateAttendance);

// // @route   DELETE /api/attendance/:id
// // @desc    Delete an attendance record by ID
// router.delete("/:id", deleteAttendance);

// module.exports = router;
