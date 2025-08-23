const Todo = require("../models/Todo");
const Project = require("../models/Project");
const User = require("../models/User");

// Create
const createTodo = async (req, res) => {
    try {
        const { itemName, dueDate, assigned, projectId, type, status, description } = req.body;

        if (!itemName || !dueDate || !projectId || !type) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check project exists
        const projectExists = await Project.findById(projectId);
        if (!projectExists) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Validate assigned users
        if (assigned && assigned.length > 0) {
            const usersExist = await User.find({ _id: { $in: assigned } });
            if (usersExist.length !== assigned.length) {
                return res.status(404).json({ message: "One or more assigned users not found" });
            }
        }

        const todo = await Todo.create({
            itemName,
            dueDate,
            assigned,
            projectId,
            project: projectExists.name,
            type,
            status,
            description: description || "", // default to empty string if not provided
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Read All (by projectId)
const getTodosByProject = async (req, res) => {
    try {
        const { projectId } = req.query;
        const todos = await Todo.find({ projectId })
            .populate("assigned", "name email")
            .populate("projectId", "name");

        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read One
const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
            .populate("assigned", "name email")
            .populate("projectId", "name");
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update (PATCH)
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;

        // if projectId is updated, sync project name also
        if (req.body.projectId) {
            const projectExists = await Project.findById(req.body.projectId);
            if (!projectExists) {
                return res.status(404).json({ message: "Project not found" });
            }
            req.body.project = projectExists.name;
        }

        const updated = await Todo.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("assigned", "name email")
            .populate("projectId", "name");

        if (!updated) return res.status(404).json({ message: "Todo not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Todo.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTodo,
    getTodosByProject,
    getTodoById,
    updateTodo,
    deleteTodo,
};
