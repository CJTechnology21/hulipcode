const Staff = require("../models/Staff");

// Create staff
const createStaff = async (req, res) => {
  try {
    const { name, personType, projectId } = req.body;

    if (!name || !personType || !projectId) {
      return res
        .status(400)
        .json({ message: "Name, personType, and projectId are required" });
    }

    const staff = await Staff.create({ name, personType, projectId });
    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all staff by project
const getStaffByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    // Just check presence, not ObjectId format
    if (!projectId) {
      return res.status(400).json({ message: "Missing projectId" });
    }

    // Query directly by string projectId
    const staff = await Staff.find({ projectId }).sort({ createdAt: -1 });

    if (!staff || staff.length === 0) {
      return res.status(404).json({ message: "No staff found for this project" });
    }

    res.status(200).json({ staff });
  } catch (err) {
    console.error("Get Staff Error:", err.message || err);
    res.status(500).json({ message: "Server error while fetching staff" });
  }
};
// Update staff
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
    res.json(staff);
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark attendance for staff
const markAttendance = async (req, res) => {
  try {
    const { id } = req.params; // staffId
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Attendance status is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const staff = await Staff.findByIdAndUpdate(
      id,
      {
        attendance: { date: today, status },
        $push: { attendanceHistory: { date: today, status } }
      },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Attendance updated", staff });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createStaff, getStaffByProject, updateStaff, deleteStaff,markAttendance };
