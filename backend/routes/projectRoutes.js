const express = require("express");
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject, patchProject, deleteProject, getProjectsByArchitectId, transitionProjectState, getValidNextStates } = require("../controllers/projectController")
const { protect } = require("../middleware/authMiddleware")
// CRUD routes
router.post("/", protect, createProject);
router.get("/", protect, getProjects); // Added protect for ACL filtering
router.get("/:id", protect, getProjectById); // Added protect for ACL check
router.get("/architect/:architectId", protect, getProjectsByArchitectId);
router.put("/:id", protect, updateProject);
router.patch("/:id", protect, patchProject);
router.delete("/:id", protect, deleteProject);

// State machine routes
router.post("/:id/transition", protect, transitionProjectState);
router.get("/:id/next-states", protect, getValidNextStates);

module.exports = router;
