// controllers/projectAttendanceController.js
const mongoose = require("mongoose");
const ProjectAttendance = require("../models/ProjectAttendance");

// ✅ Create new project attendance record
const createProjectAttendance = async (req, res) => {
  try {
    const { name, date, status, projectId, personType, lastMonthAttendance } = req.body;

    const attendance = new ProjectAttendance({
      name,
      date,
      status,
      projectId,
      ...(personType && { personType }),
      ...(lastMonthAttendance && { lastMonthAttendance }),
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Create Project Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all project attendance records (optionally filter by projectId)
const getProjectAttendance = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const query = projectId ? { projectId } : {};

    const records = await ProjectAttendance.find(query)
      .populate("projectId", "name")
      .sort({ date: -1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No project attendance records found" });
    }

    res.status(200).json({ attendance: records });
  } catch (error) {
    console.error("Get Project Attendance Error:", error);
    res.status(500).json({ message: "Server error while fetching project attendance" });
  }
};

// ✅ Get current month's project attendance (1st → today)
const getCurrentMonthProjectAttendance = async (req, res) => {
  try {
    const { name } = req.query;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const query = { date: { $gte: startOfMonth, $lte: today } };
    if (name) query.name = name;

    const records = await ProjectAttendance.find(query).sort({ date: 1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance found for this month" });
    }

    res.status(200).json({ attendance: records });
  } catch (error) {
    console.error("Get Current Month Project Attendance Error:", error);
    res.status(500).json({ message: "Server error while fetching current month attendance" });
  }
};

// ✅ Update a project attendance record
const updateProjectAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, status, projectId, personType, lastMonthAttendance } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const updateData = { name, date, status, projectId };
    if (personType) updateData.personType = personType;
    if (lastMonthAttendance) updateData.lastMonthAttendance = lastMonthAttendance;

    const updatedAttendance = await ProjectAttendance.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Project attendance record not found" });
    }

    res.status(200).json({ success: true, data: updatedAttendance });
  } catch (error) {
    console.error("Update Project Attendance Error:", error);
    res.status(500).json({ message: "Server error while updating project attendance" });
  }
};

// ✅ Delete a project attendance record
const deleteProjectAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const deletedAttendance = await ProjectAttendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Project attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Project attendance record deleted" });
  } catch (error) {
    console.error("Delete Project Attendance Error:", error);
    res.status(500).json({ message: "Server error while deleting project attendance" });
  }
};

module.exports = {
  createProjectAttendance,
  getProjectAttendance,
  updateProjectAttendance,
  deleteProjectAttendance,
  getCurrentMonthProjectAttendance,
};
