// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  redeemPoints,
  getArchitects,
  getVendors,
  getUsers,
} = require("../controllers/userController");

router.get("/me", protect, getUserProfile);
router.put("/redeem", protect, redeemPoints);
router.get('/architects', protect, getArchitects);
router.get('/vendors', protect, getVendors)
router.get("/architects-clients",protect, getUsers)

module.exports = router;
