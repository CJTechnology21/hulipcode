const express = require("express");
const router = express.Router();
const {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPortfoliosByArchitectId
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/architect/:architectId", getPortfoliosByArchitectId);

// Protected routes
router.post("/", protect, createPortfolio);
router.get("/", protect, getPortfolios);
router.get("/:id", protect, getPortfolioById);
router.put("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);

module.exports = router;

