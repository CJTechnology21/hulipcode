const Task = require("../models/Tasks");
const mongoose = require("mongoose");
const { checkProjectAccess, checkTaskAccess, isAdmin, isVendor } = require("../middleware/aclMiddleware");
const { validateProofs } = require("../services/taskProofValidation");
const { updateProjectProgress, calculatePayout } = require("../services/taskProgressService");
const { createCredit, createDebit, getTotalPaid } = require("../services/ledgerService");
const { notifyTaskSubmitted, notifyTaskApproved, notifyTaskRejected } = require("../services/notificationService");
const Project = require("../models/Project");
const User = require("../models/User");

// Create Task (flexible fields) - with ACL check
const createTask = async (req, res) => {
  try {
    const { name, projectId, ...rest } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        message: "Task name and projectId are required",
      });
    }

    // Check project access
    if (req.user) {
      const access = await checkProjectAccess(projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this project" });
      }
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


// Get All Tasks (with optional project filter) - with ACL check
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    // Check project access
    if (req.user) {
      const access = await checkProjectAccess(projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this project" });
      }
    }

    const tasks = await Task.find({ projectId })  // No need for new ObjectId()
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    // Return empty array instead of 404 if no tasks found
    res.status(200).json({ tasks: tasks || [] });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};


// Get Single Task - with ACL check
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate("assignedTo", "name email role");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check task access
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
    }

    res.status(200).json({ task });
  } catch (err) {
    console.error("Get Task Error:", err);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};


// Update Task (full update) - with ACL check
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check task access
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
    }

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


// Patch Task (partial update) - with ACL check
const patchTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check task access
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
    }

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

// Delete Task - with ACL check
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check task access
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
    }

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

    // Check project access
    if (req.user) {
      const access = await checkProjectAccess(projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this project" });
      }
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


// Submit Task for Review - with proof validation
const submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { proofs, checklist } = req.body;

    // Get task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check task access
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
    }

    // Check if task is in valid state for submission
    // Allow TODO, IN_PROGRESS, or REJECTED tasks to be submitted
    if (task.status !== 'IN_PROGRESS' && task.status !== 'TODO' && task.status !== 'REJECTED') {
      return res.status(400).json({ 
        message: `Task must be in TODO, IN_PROGRESS, or REJECTED status to submit. Current status: ${task.status}` 
      });
    }

    // Update proofs and checklist if provided
    const updateData = {};
    if (proofs) {
      updateData.proofs = proofs;
    }
    if (checklist) {
      updateData.checklist = checklist;
    }

    // Validate proofs
    const validation = validateProofs(task, proofs || task.proofs);
    if (!validation.valid) {
      return res.status(400).json({
        message: "Proof validation failed",
        errors: validation.errors,
      });
    }

    // Update task status to REVIEW
    updateData.status = 'REVIEW';
    updateData.submittedAt = new Date();
    updateData.submittedBy = req.user?._id;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    // Trigger notification for task submission
    try {
      const project = await Project.findById(task.projectId).populate("architectId", "name email");
      const assignedUser = updatedTask.assignedTo;
      const submitter = req.user;

      // Notify project architect/owner
      if (project?.architectId) {
        await notifyTaskSubmitted({
          task: updatedTask,
          project,
          submittedBy: submitter,
          recipient: {
            email: project.architectId.email,
            pushToken: null, // TODO: Get from user preferences
          },
        });
      }

      // Notify assigned user (if different from submitter)
      if (assignedUser && assignedUser._id.toString() !== submitter?._id?.toString()) {
        await notifyTaskSubmitted({
          task: updatedTask,
          project,
          submittedBy: submitter,
          recipient: {
            email: assignedUser.email,
            pushToken: null,
          },
        });
      }
    } catch (notifError) {
      console.error("Error sending task submission notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(200).json({
      message: "Task submitted for review successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Submit Task Error:", err);
    res.status(500).json({ message: "Server error while submitting task" });
  }
};

// Approve Task - updates progress and prepares payout
const approveTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Get task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check task access (only admin, architect, or project owner can approve)
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
      // Additional check: vendors cannot approve tasks
      if (isVendor(req.user)) {
        return res.status(403).json({ message: "Vendors cannot approve tasks" });
      }
    }

    // Check if task is in REVIEW status
    if (task.status !== 'REVIEW') {
      return res.status(400).json({ 
        message: `Task must be in REVIEW status to approve. Current status: ${task.status}` 
      });
    }

    // Update task status to DONE
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'DONE',
          approvedAt: new Date(),
          approvedBy: req.user?._id,
          progress: 100, // Task is 100% complete
        },
      },
      { new: true }
    );

    // Calculate and update project progress
    let progressData;
    try {
      const result = await updateProjectProgress(task.projectId);
      progressData = result.progressData;
    } catch (progressError) {
      console.error('Error updating project progress:', progressError);
      // Don't fail the approval if progress update fails
    }

    // Calculate payout with financial breakdown
    let payoutData;
    let ledgerEntries = [];
    try {
      payoutData = await calculatePayout(task.projectId);
      
      // Create ledger entries for financial tracking
      if (payoutData && payoutData.financials) {
        const financials = payoutData.financials;
        const taskValue = task.value || 0;
        
        // Only create entries if there's a payout amount
        if (taskValue > 0) {
          // 1. Create credit entry for task payout (gross amount)
          const creditEntry = await createCredit({
            projectId: task.projectId,
            taskId: task._id,
            category: 'TASK_PAYOUT',
            amount: taskValue,
            description: `Task payout: ${task.name}`,
            metadata: {
              taskValue,
              progress: progressData?.progress || 0,
              previousPaid: payoutData.previousPaid || 0,
            },
            createdBy: req.user?._id,
            referenceId: task._id,
            referenceType: 'TASK',
          });
          ledgerEntries.push(creditEntry);

          // 2. Create debit entry for platform fee (4%)
          if (financials.platformFee.amount > 0) {
            const feeEntry = await createDebit({
              projectId: task.projectId,
              taskId: task._id,
              category: 'PLATFORM_FEE',
              amount: financials.platformFee.amount,
              description: `Platform fee (${financials.platformFee.percent}%) for task: ${task.name}`,
              metadata: {
                platformFeePercent: financials.platformFee.percent,
                grossAmount: financials.grossAmount,
              },
              createdBy: req.user?._id,
              referenceId: task._id,
              referenceType: 'TASK',
            });
            ledgerEntries.push(feeEntry);
          }

          // 3. Create debit entry for withheld amount (15%)
          if (financials.withheld.amount > 0) {
            const withheldEntry = await createDebit({
              projectId: task.projectId,
              taskId: task._id,
              category: 'WITHHELD',
              amount: financials.withheld.amount,
              description: `Withheld amount (${financials.withheld.percent}%) for task: ${task.name}`,
              metadata: {
                withheldPercent: financials.withheld.percent,
                netAmount: financials.breakdown.minusPlatformFee,
              },
              createdBy: req.user?._id,
              referenceId: task._id,
              referenceType: 'TASK',
            });
            ledgerEntries.push(withheldEntry);
          }

          // 4. Create debit entry for penalty (if any)
          if (financials.penalty.amount > 0) {
            const penaltyEntry = await createDebit({
              projectId: task.projectId,
              taskId: task._id,
              category: 'PENALTY',
              amount: financials.penalty.amount,
              description: `Penalty (${financials.penalty.percent}%) for task: ${task.name}`,
              metadata: {
                penaltyPercent: financials.penalty.percent,
                penaltyReason: financials.penalty.reason,
                baseAmount: financials.breakdown.minusWithheld,
              },
              createdBy: req.user?._id,
              referenceId: task._id,
              referenceType: 'TASK',
            });
            ledgerEntries.push(penaltyEntry);
          }
        }
      }
    } catch (payoutError) {
      console.error('Error calculating payout or creating ledger entries:', payoutError);
      // Don't fail the approval if payout calculation fails
    }

    // Trigger notification for task approval
    try {
      const project = await Project.findById(task.projectId).populate("architectId", "name email");
      const assignedUser = await User.findById(task.assignedTo);
      const approver = req.user;

      // Notify assigned user (task owner)
      if (assignedUser) {
        await notifyTaskApproved({
          task: updatedTask,
          project,
          approvedBy: approver,
          payout: payoutData,
          recipient: {
            email: assignedUser.email,
            pushToken: null, // TODO: Get from user preferences
          },
        });
      }

      // Notify project architect (if different from approver)
      if (project?.architectId && project.architectId._id.toString() !== approver?._id?.toString()) {
        await notifyTaskApproved({
          task: updatedTask,
          project,
          approvedBy: approver,
          payout: payoutData,
          recipient: {
            email: project.architectId.email,
            pushToken: null,
          },
        });
      }
    } catch (notifError) {
      console.error("Error sending task approval notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(200).json({
      message: "Task approved successfully",
      task: updatedTask,
      progress: progressData,
      payout: payoutData,
      ledgerEntries: ledgerEntries.length > 0 ? ledgerEntries.map(e => ({
        id: e._id,
        entryType: e.entryType,
        category: e.category,
        amount: e.amount,
        description: e.description,
      })) : [],
    });
  } catch (err) {
    console.error("Approve Task Error:", err);
    res.status(500).json({ message: "Server error while approving task" });
  }
};

// Reject Task
const rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason || rejection_reason.trim() === '') {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // Get task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check task access (only admin, architect, or project owner can reject)
    if (req.user) {
      const access = await checkTaskAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied to this task" });
      }
      // Additional check: vendors cannot reject tasks
      if (isVendor(req.user)) {
        return res.status(403).json({ message: "Vendors cannot reject tasks" });
      }
    }

    // Check if task is in REVIEW status
    if (task.status !== 'REVIEW') {
      return res.status(400).json({ 
        message: `Task must be in REVIEW status to reject. Current status: ${task.status}` 
      });
    }

    // Update task status to REJECTED and set rejection reason
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'REJECTED',
          rejection_reason: rejection_reason.trim(),
          rejectedAt: new Date(),
          rejectedBy: req.user?._id,
        },
      },
      { new: true }
    ).populate("assignedTo", "name email");

    // Trigger notification for task rejection
    try {
      const project = await Project.findById(task.projectId).populate("architectId", "name email");
      const assignedUser = updatedTask.assignedTo;
      const rejector = req.user;

      // Notify assigned user (task owner)
      if (assignedUser) {
        await notifyTaskRejected({
          task: updatedTask,
          project,
          rejectedBy: rejector,
          rejectionReason: rejection_reason.trim(),
          recipient: {
            email: assignedUser.email,
            pushToken: null, // TODO: Get from user preferences
          },
        });
      }
    } catch (notifError) {
      console.error("Error sending task rejection notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(200).json({
      message: "Task rejected successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Reject Task Error:", err);
    res.status(500).json({ message: "Server error while rejecting task" });
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
  submitTask,
  approveTask,
  rejectTask,
};
