// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  redeemPoints,
} = require("../controllers/userController");

router.get("/me", protect, getUserProfile);
router.put("/redeem", protect, redeemPoints);

module.exports = router;
