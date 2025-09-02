const SiteMeasurement = require("../models/SiteMeasurements");
const Project = require("../models/Project");
const User = require("../models/User"); 

// Create Site Measurement
const createSiteMeasurement = async (req, res) => {
  try {
    const { projectId, architectId, spaces, notes, status } = req.body;

    if (!projectId || !architectId || !spaces || spaces.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check project exists
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate architect exists
    const architectExists = await User.findById(architectId);
    if (!architectExists) {
      return res.status(404).json({ message: "Architect not found" });
    }

    const siteMeasurement = await SiteMeasurement.create({
      projectId,
      architectId,
      spaces,
      notes: notes || "",
      status: status || "pending",
    });

    res.status(201).json(siteMeasurement);
  } catch (error) {
    console.error("Create SiteMeasurement Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get All Site Measurements for a Project
const getSiteMeasurementsByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const measurements = await SiteMeasurement.find({ projectId })
      .populate("architectId", "name email")
      .populate("projectId", "name");

    res.status(200).json(measurements);
  } catch (error) {
    console.error("Get Measurements Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get One Site Measurement by ID
const getSiteMeasurementById = async (req, res) => {
  try {
    const { id } = req.params;

    const measurement = await SiteMeasurement.findById(id)
      .populate("architectId", "name email")
      .populate("projectId", "name");

    if (!measurement) return res.status(404).json({ message: "SiteMeasurement not found" });

    res.status(200).json(measurement);
  } catch (error) {
    console.error("Get SiteMeasurement Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Site Measurement
const updateSiteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;

    // If projectId is updated, sync project name
    if (req.body.projectId) {
      const projectExists = await Project.findById(req.body.projectId);
      if (!projectExists) return res.status(404).json({ message: "Project not found" });
    }

    // If architectId is updated, validate
    if (req.body.architectId) {
      const architectExists = await User.findById(req.body.architectId);
      if (!architectExists) return res.status(404).json({ message: "Architect not found" });
    }

    const updated = await SiteMeasurement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("architectId", "name email")
      .populate("projectId", "name");

    if (!updated) return res.status(404).json({ message: "SiteMeasurement not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update SiteMeasurement Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete Site Measurement
const deleteSiteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SiteMeasurement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "SiteMeasurement not found" });
    res.status(200).json({ message: "SiteMeasurement deleted successfully" });
  } catch (error) {
    console.error("Delete SiteMeasurement Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSiteMeasurement,
  getSiteMeasurementsByProject,
  getSiteMeasurementById,
  updateSiteMeasurement,
  deleteSiteMeasurement,
};
