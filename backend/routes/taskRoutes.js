const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
} = require("../controllers/taskController");

//  Create new task
router.post("/", createTask);

//  Get all tasks (with optional filters: ?projectId=xxx, ?status=TODO)
router.get("/", getTasksByProject);

//  Get single task by ID
router.get("/:id", getTaskById);

//  Full update (PUT)
router.put("/:id", updateTask);

//  Partial update (PATCH)
router.patch("/:id", patchTask);

//  Delete task
router.delete("/:id", deleteTask);

module.exports = router;
