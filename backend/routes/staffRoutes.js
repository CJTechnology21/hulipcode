const express = require("express");
const {
  createStaff,
  getStaffByProject,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

router.post("/", protect, createStaff);
router.get("/:projectId", getStaffByProject);
router.put("/:id", protect, updateStaff);
router.delete("/:id", protect, deleteStaff);

module.exports = router;
