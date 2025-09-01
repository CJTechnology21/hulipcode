const Task = require("../models/Tasks");
const mongoose = require("mongoose");

// Create Task (flexible fields)
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
      ...rest,
    });

    res.status(201).json({
      task,
    });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Server error while creating task" });
  }
};


// Get All Tasks (with optional project filter)
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    const tasks = await Task.find({ projectId })  // No need for new ObjectId()
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this project" });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};


// Get Single Task
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


// Update Task (full update)
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


// Patch Task (partial update)
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

// Delete Task
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
const getTaskName = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    // Find tasks by projectId and only return _id and name fields
    const tasks = await Task.find({ projectId }).select("_id name").sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this project" });
    }

    // Map to array of objects with id and name
    const taskList = tasks.map((task) => ({
      id: task._id,
      name: task.name,
    }));

    res.status(200).json({ tasks: taskList });
  } catch (err) {
    console.error("Get Task Names Error:", err);
    res.status(500).json({ message: "Server error while fetching task names" });
  }
};


module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
  getTaskName,
};
