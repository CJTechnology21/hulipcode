const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User"); // ← Make sure this is imported

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 
