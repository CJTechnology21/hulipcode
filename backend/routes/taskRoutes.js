const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
  getTaskName,
  submitTask,
  approveTask,
  rejectTask,
} = require("../controllers/taskController");

//  Create new task
router.post("/", protect, createTask);

//  Get all tasks (with optional filters: ?projectId=xxx, ?status=TODO)
router.get("/", protect, getTasksByProject); // Added protect for ACL check

//get tasknames
router.get("/taskname", protect, getTaskName); // Added protect for ACL check

//  Get single task by ID
router.get("/:id", protect, getTaskById); // Added protect for ACL check

//  Full update (PUT)
router.put("/:id", protect, updateTask);

//  Partial update (PATCH)
router.patch("/:id", protect, patchTask);

//  Delete task
router.delete("/:id", protect, deleteTask);

// Task submission and approval routes
router.post("/:id/submit", protect, submitTask);
router.post("/:id/approve", protect, approveTask);
router.post("/:id/reject", protect, rejectTask);

module.exports = router;