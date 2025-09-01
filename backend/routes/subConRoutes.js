const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createSubconOrder,
  getSubconOrdersByProject,
  getSubconOrdersByArchitect,
  getSubconOrderById,
  updateSubconOrder,
  patchSubconOrder,
  deleteSubconOrder,
} = require("../controllers/subConController");

// Create new subcon order
router.post("/", protect, createSubconOrder);

// Get subcon orders by project (?projectId=xxx)
router.get("/", getSubconOrdersByProject);

// Get subcon orders by architect (?architectId=xxx)
router.get("/architect", getSubconOrdersByArchitect);

// Get single subcon order by ID
router.get("/:id", getSubconOrderById);

// Full update (PUT)
router.put("/:id", protect, updateSubconOrder);

// Partial update (PATCH)
router.patch("/:id", protect, patchSubconOrder);

// Delete subcon order
router.delete("/:id", protect, deleteSubconOrder);

module.exports = router;
