
// controllers/userController.js
const User = require("../models/User");

// @desc    Get logged-in user data including reward points
// @route   GET /api/user/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rewardPoints: user.rewardPoints || 0,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Redeem reward points
// @route   PUT /api/user/redeem
// @access  Private
const redeemPoints = async (req, res) => {
  const { pointsToRedeem } = req.body;

  if (!pointsToRedeem || pointsToRedeem <= 0) {
    return res.status(400).json({ message: "Invalid redemption amount" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (user.rewardPoints < pointsToRedeem) {
      return res.status(400).json({ message: "Not enough reward points" });
    }

    user.rewardPoints -= pointsToRedeem;
    await user.save();

    res.json({
      message: "Points redeemed successfully",
      rewardPoints: user.rewardPoints,
    });
  } catch (err) {
    console.error("Redemption failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  redeemPoints,
};
