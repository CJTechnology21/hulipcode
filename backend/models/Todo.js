const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: [true, "Please provide a task name"],
            trim: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        assigned: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        project: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Plumbing", "Electrical", "Other"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
