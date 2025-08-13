// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  redeemPoints,
  getArchitects,
} = require("../controllers/userController");

router.get("/me", protect, getUserProfile);
router.put("/redeem", protect, redeemPoints);
router.get('/architects', protect, getArchitects);

module.exports = router;
