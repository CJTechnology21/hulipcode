const express = require("express");
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject, patchProject, deleteProject, getProjectsByArchitectId } = require("../controllers/projectController")
const { protect } = require("../middleware/authMiddleware")
// CRUD routes
router.post("/", protect, createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/architect/:architectId", protect, getProjectsByArchitectId);
router.put("/:id", protect, updateProject);
router.patch("/:id", protect, patchProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
