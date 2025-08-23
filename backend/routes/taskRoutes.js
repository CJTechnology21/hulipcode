const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware")
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
} = require("../controllers/taskController");

//  Create new task
router.post("/", protect, createTask);

//  Get all tasks (with optional filters: ?projectId=xxx, ?status=TODO)
router.get("/", getTasksByProject);

//  Get single task by ID
router.get("/:id", getTaskById);

//  Full update (PUT)
router.put("/:id", protect, updateTask);

//  Partial update (PATCH)
router.patch("/:id", protect, patchTask);

//  Delete task
router.delete("/:id", protect ,deleteTask);

module.exports = router;
