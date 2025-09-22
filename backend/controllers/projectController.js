const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    // Ensure req.user is set by your auth middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projectData = {
      ...req.body,
      architectId: req.user._id, // ✅ set logged-in user as architect
    };

    const project = await Project.create(projectData); // _id is handled internally
    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(400).json({ message: err.message });
  }
};

// const createProject = async (req, res) => {
//   try {
//     const project = await Project.create(req.body); // _id is used internally
//     res.status(201).json(project);
//   } catch (err) {
//     console.error("Create project error:", err);
//     res.status(400).json({ message: err.message });
//   }
// };

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single project by _id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//GET Projects by architectID
const getProjectsByArchitectId = async (req, res) => {
  try {
    const { architectId } = req.params;
    const projects = await Project.find({ architectId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this architect" });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects by architect error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update project (full)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Patch project (partial)
const patchProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    console.error("Patch project error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByArchitectId,
  updateProject,
  patchProject,
  deleteProject,
};
