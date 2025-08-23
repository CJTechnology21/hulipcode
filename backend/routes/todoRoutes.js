const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTodo,
  getTodoById,
  getTodosByProject,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

// Get all todos by projectId (optional query: ?projectId=xxx)
router.get("/", getTodosByProject);

// Create new todo
router.post("/", createTodo);

// Get single todo by ID
router.get("/:id", getTodoById);

// Update todo
router.put("/:id", updateTodo);

// Delete todo
router.delete("/:id", deleteTodo);

module.exports = router;
