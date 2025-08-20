// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const {createAttendance,getAttendance} = require("../controllers/attendanceController");

// @route   POST /api/attendance
router.post("/", createAttendance);

// @route   GET /api/attendance
router.get("/", getAttendance);

module.exports = router;
