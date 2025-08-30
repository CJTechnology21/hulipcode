const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createStaff,
  getStaffByProject,
  updateStaff,
  deleteStaff,
  markAttendance,   // ✅ new controller
} = require("../controllers/staffController");

// Create new staff
router.post("/", protect, createStaff);

// Get all staff for a project (use ?projectId=xxx)
router.get("/", getStaffByProject);

// Full update (PUT)
router.put("/:id", protect, updateStaff);

// Delete staff
router.delete("/:id", protect, deleteStaff);

// ✅ New route to mark attendance
// Example: PUT /api/staff/:id/attendance  { "status": "Full Day" }
router.put("/:id/attendance", protect, markAttendance);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const {
//   createStaff,
//   getStaffByProject,
//   updateStaff,
//   deleteStaff,
// } = require("../controllers/staffController");

// // Create new staff
// router.post("/", protect, createStaff);

// // Get all staff for a project (use ?projectId=xxx)
// router.get("/", getStaffByProject);



// // Full update (PUT)
// router.put("/:id", protect, updateStaff);

// // Delete staff
// router.delete("/:id", protect, deleteStaff);

// module.exports = router;
