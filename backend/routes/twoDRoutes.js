const express = require("express");
const router = express.Router();
const {
  getAllLayouts,
  getLayoutById,
  createLayout,
  updateLayout,
  patchLayout,
  deleteLayout,
  getLayoutsByProject,
} = require("../controllers/twoDLayoutController");

// CRUD Routes

router.get("/", getLayoutsByProject); // <-- Fetch layouts by projectId
router.get("/:id", getLayoutById);
router.post("/", createLayout);
router.put("/:id", updateLayout);
router.patch("/:id", patchLayout);
router.delete("/:id", deleteLayout);

module.exports = router;
