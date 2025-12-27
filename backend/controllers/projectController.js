const Project = require("../models/Project");
const { checkProjectAccess, isAdmin, isVendor, isProfessional, isHomeowner } = require("../middleware/aclMiddleware");
const Quote = require("../models/Quote");
const Lead = require("../models/Lead");
const { validateTransition, getInitialState, PROJECT_STATES } = require("../services/projectStateMachine");
const mongoose = require("mongoose");

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

// Get all projects (filtered by ACL) - OPTIMIZED to avoid N+1 queries
const getProjects = async (req, res) => {
  try {
    let projects;
    
    // Admin sees all projects
    if (req.user && isAdmin(req.user)) {
      projects = await Project.find()
        .populate('quoteId', 'leadId assigned')
        .populate('architectId', '_id name email');
    } else if (req.user) {
      // Optimized: Build efficient queries based on user role instead of checking each project
      const userId = req.user._id; // Keep as ObjectId for proper MongoDB comparison
      
      if (isProfessional(req.user)) {
        console.log("👷 Fetching projects for professional:", {
          userId: userId.toString(),
          userIdType: typeof userId,
          userIdConstructor: userId.constructor.name
        });
        
        // Professional: projects where architectId matches OR assigned to quote
        // First, get all quotes where user is assigned (handles both array and single value)
        // Also check if userId is in the assigned array
        let accessibleQuoteIds = [];
        let quotesWithUser = [];
        
        try {
          accessibleQuoteIds = await Quote.find({
            $or: [
              { assigned: userId },
              { assigned: { $in: [userId] } },
              { 'assigned': { $elemMatch: { $eq: userId } } } // For array of ObjectIds
            ]
          }).distinct('_id');
          
          console.log("📋 Accessible quote IDs:", accessibleQuoteIds.length, accessibleQuoteIds.map(id => id.toString()));
        } catch (err) {
          console.error("❌ Error fetching accessible quote IDs:", err);
          accessibleQuoteIds = [];
        }
        
        try {
          // Also get quotes where assigned field contains the user (handle different formats)
          quotesWithUser = await Quote.find({
            $or: [
              { assigned: userId },
              { assigned: userId.toString() },
              { assigned: { $in: [userId, userId.toString()] } }
            ]
          }).select('_id assigned').lean();
        } catch (err) {
          console.error("❌ Error fetching quotes with user:", err);
          quotesWithUser = [];
        }
        
        console.log("📋 Quotes with user (detailed):", quotesWithUser.map(q => ({
          quoteId: q._id.toString(),
          assigned: q.assigned
        })));
        
        // Safely convert IDs to ObjectIds, handling both string and ObjectId formats
        const allAccessibleQuoteIds = [...new Set([
          ...accessibleQuoteIds.map(id => id.toString()),
          ...quotesWithUser.map(q => q._id.toString())
        ])].map(idStr => {
          try {
            // Validate and convert string to ObjectId
            if (mongoose.Types.ObjectId.isValid(idStr)) {
              return new mongoose.Types.ObjectId(idStr);
            }
            console.warn("Invalid ObjectId format:", idStr);
            return null;
          } catch (err) {
            console.error("Error converting ID to ObjectId:", idStr, err);
            return null;
          }
        }).filter(id => id !== null && id instanceof mongoose.Types.ObjectId); // Remove any null or invalid values
        
        console.log("📋 All accessible quote IDs:", allAccessibleQuoteIds.length, allAccessibleQuoteIds.map(id => id.toString()));
        
        // Get projects where:
        // 1. architectId matches the logged-in user (projects they own)
        // 2. quoteId is in accessible quotes (projects from quotes they're assigned to)
        const queryConditions = [
          { architectId: userId }
        ];
        
        // Add quote-based access if user is assigned to any quotes
        if (allAccessibleQuoteIds.length > 0) {
          queryConditions.push({ quoteId: { $in: allAccessibleQuoteIds } });
        }
        
        console.log("🔍 Query conditions count:", queryConditions.length);
        console.log("🔍 Query conditions:", JSON.stringify(queryConditions.map(c => ({
          ...c,
          architectId: c.architectId ? c.architectId.toString() : null,
          quoteId: c.quoteId ? 'array of ' + (c.quoteId.$in?.length || 0) + ' IDs' : null
        })), null, 2));
        
        // Try the query with ObjectId first
        let queryResult = [];
        try {
          queryResult = await Project.find({
            $or: queryConditions
          })
          .populate('quoteId', 'leadId assigned')
          .populate('architectId', '_id name email');
          
          console.log("✅ Found projects for professional:", queryResult.length);
        } catch (queryError) {
          console.error("❌ Error in initial project query:", queryError);
          // Continue to fallback query below
        }
        
        // If no results, also try to find projects by checking quote access directly
        if (queryResult.length === 0) {
          console.log("🔍 No projects found with initial query, checking projects by quote access...");
          
          try {
            // Get all projects with quoteId and check if user has access to those quotes
            const projectsWithQuotes = await Project.find({ quoteId: { $exists: true, $ne: null } })
              .populate('quoteId', 'leadId assigned')
              .populate('architectId', '_id name email')
              .lean();
            
            console.log("🔍 Projects with quotes found:", projectsWithQuotes.length);
            
            // Filter projects where user has access to the quote
            const accessibleProjects = projectsWithQuotes.filter(project => {
              if (!project.quoteId) return false;
              
              const quote = project.quoteId;
              const assigned = quote.assigned;
              
              // Check if user is in assigned field (handle array and single value)
              if (Array.isArray(assigned)) {
                return assigned.some(a => {
                  try {
                    const assignedId = a?._id?.toString() || a?.toString() || a;
                    return assignedId === userId.toString();
                  } catch (err) {
                    console.error("Error checking assigned ID:", err);
                    return false;
                  }
                });
              } else if (assigned) {
                try {
                  const assignedId = assigned._id?.toString() || assigned.toString();
                  return assignedId === userId.toString();
                } catch (err) {
                  console.error("Error checking assigned ID:", err);
                  return false;
                }
              }
              
              return false;
            });
            
            console.log("✅ Accessible projects by quote:", accessibleProjects.length);
            if (accessibleProjects.length > 0) {
              console.log("📦 Accessible project IDs:", accessibleProjects.map(p => ({
                id: p._id,
                name: p.name,
                quoteId: p.quoteId?._id
              })));
            }
            
            // Get the full project documents
            const accessibleProjectIds = accessibleProjects.map(p => p._id).filter(id => id != null);
            if (accessibleProjectIds.length > 0) {
              queryResult = await Project.find({
                _id: { $in: accessibleProjectIds }
              })
              .populate('quoteId', 'leadId assigned')
              .populate('architectId', '_id name email');
              
              console.log("✅ Final query result after quote access check:", queryResult.length);
            }
          } catch (fallbackError) {
            console.error("❌ Error in fallback project query:", fallbackError);
            // Continue with empty result
            queryResult = [];
          }
        }
        
        projects = queryResult;
        
        if (projects.length > 0) {
          console.log("📦 Project IDs:", projects.map(p => ({
            id: p._id,
            name: p.name,
            architectId: p.architectId,
            architectIdType: typeof p.architectId
          })));
        }
        
      } else if (isHomeowner(req.user)) {
        // Homeowner/Client: projects where quote -> lead -> (assigned OR createdBy) matches
        // Get all leads where client is assigned OR created the lead
        const accessibleLeadIds = await Lead.find({
          $or: [
            { assigned: userId },           // Leads assigned to client
            { createdBy: userId }           // Leads created by client
          ]
        }).distinct('_id');
        
        console.log("👤 Fetching projects for client/homeowner:", {
          userId: userId.toString(),
          accessibleLeadIds: accessibleLeadIds.length,
          leadIds: accessibleLeadIds.map(id => id.toString())
        });
        
        // If no accessible leads, return empty array
        if (accessibleLeadIds.length === 0) {
          console.log("⚠️ No accessible leads found for client");
          projects = [];
        } else {
          // Then, get all quotes for these leads
          const accessibleQuoteIds = await Quote.find({
            leadId: { $in: accessibleLeadIds }
          }).distinct('_id');
          
          console.log("📋 Accessible quote IDs for client:", accessibleQuoteIds.length, accessibleQuoteIds.map(id => id.toString()));
          
          // Finally, get projects for these quotes
          if (accessibleQuoteIds.length === 0) {
            console.log("⚠️ No quotes found for accessible leads");
            projects = [];
          } else {
            projects = await Project.find({
              quoteId: { $in: accessibleQuoteIds }
            })
            .populate('quoteId', 'leadId assigned')
            .populate('architectId', '_id name email');
            
            console.log("✅ Found projects for client:", projects.length);
          }
        }
        
      } else {
        // Other roles (Site Agent, Vendor, etc.) - return empty for now
        // Site agents and vendors have specific access patterns handled elsewhere
        projects = [];
      }
    } else {
      // Unauthenticated - return empty
      projects = [];
    }
    
    res.status(200).json(projects);
  } catch (err) {
    console.error("❌ Get projects error:", err);
    console.error("Error stack:", err.stack);
    // Return empty array instead of error to prevent frontend crashes
    // Log the error for debugging but don't expose it to client
    res.status(200).json([]);
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
