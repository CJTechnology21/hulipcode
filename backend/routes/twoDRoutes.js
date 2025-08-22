const express = require("express");
const router = express.Router();
const {
  getLayoutById,
  createLayout,
  updateLayout,
  patchLayout,
  deleteLayout,
  getLayoutsByProject,
  getCommentsByProject,
  addCommentToLayout,
} = require("../controllers/twoDLayoutController");
const {protect} = require('../middleware/authMiddleware')
// CRUD Routes
router.get("/comment", protect, getCommentsByProject);
router.get("/", getLayoutsByProject); 
router.get("/:id", getLayoutById);
router.post("/", createLayout);
router.put("/:id", updateLayout);
router.patch("/:id", patchLayout);
router.delete("/:id", deleteLayout);
router.post("/comment", protect, addCommentToLayout);

module.exports = router;
