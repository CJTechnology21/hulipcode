const Task = require("../models/Tasks");

// ==============================
// Create Task (flexible fields)
// ==============================
const createTask = async (req, res) => {
  try {
    const { name, projectId, ...rest } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        message: "Task name and projectId are required",
      });
    }

    const task = await Task.create({
      name,
      projectId,
      ...rest, // take any other optional fields
    });

    res.status(201).json({
      task,
    });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// ==============================
// Get All Tasks (with optional project filter)
// ==============================
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    let filter = {};
    if (projectId) filter.projectId = projectId;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role") // populate assigned user
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// ==============================
// Get Single Task
// ==============================
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate("assignedTo", "name email role");
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ task });
  } catch (err) {
    console.error("Get Task Error:", err);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

// ==============================
// Update Task (full update)
// ==============================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ task });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// ==============================
// Patch Task (partial update)
// ==============================
const patchTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: req.body }, // only update passed fields
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ task });
  } catch (err) {
    console.error("Patch Task Error:", err);
    res.status(500).json({ message: "Server error while patching task" });
  }
};

// ==============================
// Delete Task
// ==============================
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
};
