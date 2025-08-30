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
    const { projectId } = req.params;
    const staff = await Staff.find({ projectId });
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Server Error" });
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

module.exports = { createStaff, getStaffByProject, updateStaff, deleteStaff };
