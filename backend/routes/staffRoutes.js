const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createStaff,
  getStaffByProject,
  updateStaff,
  deleteStaff,
  markAttendance,
  getStaffByType,
} = require("../controllers/staffController");

// Create new staff
router.post("/", protect, createStaff);

// Get all staff for a project (use ?projectId=xxx)
router.get("/", getStaffByProject);

//Get staff and labour
router.get("/person", getStaffByType)

// Full update (PUT)
router.put("/:id", protect, updateStaff);

// Delete staff
router.delete("/:id", protect, deleteStaff);

// Example: PUT /api/staff/:id/attendance  { "status": "Full Day" }
router.put("/:id/attendance", protect, markAttendance);

module.exports = router;
