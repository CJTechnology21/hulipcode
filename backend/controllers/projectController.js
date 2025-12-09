const Project = require("../models/Project");
const { checkProjectAccess, isAdmin, isVendor } = require("../middleware/aclMiddleware");
const Quote = require("../models/Quote");
const Lead = require("../models/Lead");
const { validateTransition, getInitialState, PROJECT_STATES } = require("../services/projectStateMachine");

// Create Project
const createProject = async (req, res) => {
  try {
    // Ensure req.user is set by your auth middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Vendors cannot create projects
    if (isVendor(req.user)) {
      return res.status(403).json({ message: "Vendors cannot create projects" });
    }

    const projectData = {
      ...req.body,
      architectId: req.user._id, // ✅ set logged-in user as architect
      // Set initial state if not provided
      status: req.body.status || getInitialState(),
    };

    // Validate initial state if provided
    if (req.body.status && req.body.status !== getInitialState()) {
      const tempProject = { status: getInitialState() };
      const validation = validateTransition(tempProject, req.body.status);
      if (!validation.validTransition) {
        return res.status(400).json({ 
          message: `Invalid initial state: ${validation.error}` 
        });
      }
    }

    const project = await Project.create(projectData); // _id is handled internally
    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all projects (filtered by ACL)
const getProjects = async (req, res) => {
  try {
    let projects;
    
    // Admin sees all projects
    if (req.user && isAdmin(req.user)) {
      projects = await Project.find();
    } else if (req.user) {
      // Filter projects based on user access
      const allProjects = await Project.find()
        .populate('quoteId', 'leadId assigned')
        .populate('architectId', '_id');
      
      const accessibleProjects = [];
      
      for (const project of allProjects) {
        const access = await checkProjectAccess(project._id, req.user);
        if (access.allowed) {
          accessibleProjects.push(project);
        }
      }
      
      projects = accessibleProjects;
    } else {
      // Unauthenticated - return empty or public projects only
      projects = [];
    }
    
    res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single project by _id (with ACL check)
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Check ACL if user is authenticated
    if (req.user) {
      const access = await checkProjectAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }
    
    res.status(200).json(project);
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//GET Projects by architectID (with ACL check)
const getProjectsByArchitectId = async (req, res) => {
  try {
    const { architectId } = req.params;
    
    // Users can only see their own projects unless admin
    if (req.user && !isAdmin(req.user) && req.user._id.toString() !== architectId) {
      return res.status(403).json({ message: "You can only view your own projects" });
    }
    
    const projects = await Project.find({ architectId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this architect" });
    }

    // Filter by ACL if not admin
    if (req.user && !isAdmin(req.user)) {
      const accessibleProjects = [];
      for (const project of projects) {
        const access = await checkProjectAccess(project._id, req.user);
        if (access.allowed) {
          accessibleProjects.push(project);
        }
      }
      return res.status(200).json(accessibleProjects);
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects by architect error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update project (full) - with ACL check and state transition validation
const updateProject = async (req, res) => {
  try {
    // Check ACL first
    if (req.user) {
      const access = await checkProjectAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }
    
    // Get current project
    const currentProject = await Project.findById(req.params.id);
    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate state transition if status is being changed
    if (req.body.status && req.body.status !== currentProject.status) {
      const validation = validateTransition(currentProject, req.body.status);
      if (!validation.validTransition) {
        return res.status(400).json({ 
          message: `Invalid state transition: ${validation.error}` 
        });
      }
    }
    
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

// Patch project (partial) - with ACL check and state transition validation
const patchProject = async (req, res) => {
  try {
    // Check ACL first
    if (req.user) {
      const access = await checkProjectAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }
    
    // Get current project
    const currentProject = await Project.findById(req.params.id);
    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate state transition if status is being changed
    if (req.body.status && req.body.status !== currentProject.status) {
      const validation = validateTransition(currentProject, req.body.status);
      if (!validation.validTransition) {
        return res.status(400).json({ 
          message: `Invalid state transition: ${validation.error}` 
        });
      }
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    console.error("Patch project error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete project - with ACL check
const deleteProject = async (req, res) => {
  try {
    // Check ACL first
    if (req.user) {
      const access = await checkProjectAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }
    
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Transition project state - with ACL check and validation
const transitionProjectState = async (req, res) => {
  try {
    const { id } = req.params;
    const { newState } = req.body;

    if (!newState) {
      return res.status(400).json({ message: "newState is required" });
    }

    // Check ACL first
    if (req.user) {
      const access = await checkProjectAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    // Get current project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate transition
    const validation = validateTransition(project, newState);
    if (!validation.validTransition) {
      return res.status(400).json({ 
        message: `Invalid state transition: ${validation.error}` 
      });
    }

    // Update project state
    project.status = newState;
    await project.save();

    res.status(200).json({
      message: `Project state transitioned from ${project.status} to ${newState}`,
      project,
    });
  } catch (err) {
    console.error("Transition project state error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get valid next states for a project
const getValidNextStates = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkProjectAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { getValidNextStates: getNextStates } = require("../services/projectStateMachine");
    const nextStates = getNextStates(project.status);

    res.status(200).json({
      currentState: project.status,
      validNextStates: nextStates,
    });
  } catch (err) {
    console.error("Get valid next states error:", err);
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
  transitionProjectState,
  getValidNextStates,
};
