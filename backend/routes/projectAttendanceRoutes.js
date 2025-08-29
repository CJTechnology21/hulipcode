// routes/projectAttendanceRoutes.js
const express = require("express");
const router = express.Router();

const {
  createProjectAttendance,
  getProjectAttendance,
  updateProjectAttendance,
  deleteProjectAttendance,
  getCurrentMonthProjectAttendance,
} = require("../controllers/projectAttendanceController");

//  Create a new project attendance record
router.post("/", createProjectAttendance);

//  Get all project attendance records (optional filter by projectId)
router.get("/", getProjectAttendance);

//  Get current month's project attendance (1st → today)
router.get("/current-month", getCurrentMonthProjectAttendance);

//  Update a project attendance record by ID
router.put("/:id", updateProjectAttendance);

//  Delete a project attendance record by ID
router.delete("/:id", deleteProjectAttendance);

module.exports = router;
