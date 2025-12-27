const express = require("express");
const router = express.Router();
const {
  getPortfolioProfile,
  savePortfolioProfile,
  updatePortfolioProfile,
  getAllPortfolioProfiles,
  getPortfolioProfileByArchitectId
} = require("../controllers/portfolioProfileController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/all", getAllPortfolioProfiles);
router.get("/architect/:architectId", getPortfolioProfileByArchitectId);

// Protected routes
router.get("/", protect, getPortfolioProfile);
router.post("/", protect, savePortfolioProfile);
router.put("/", protect, updatePortfolioProfile);

module.exports = router;

