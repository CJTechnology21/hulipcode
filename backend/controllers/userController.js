
const User = require('../models/User');

// @desc    Get logged-in user profile
// @route   GET /api/user/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: no user in request' });
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || 'N/A',
      rewardPoints: user.rewardPoints || 0,
      role: user.role,
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem reward points
// @route   PUT /api/user/redeem
// @access  Private
const redeemPoints = async (req, res) => {
  const { pointsToRedeem } = req.body;

  if (!pointsToRedeem || pointsToRedeem <= 0) {
    return res.status(400).json({ message: 'Invalid redemption amount' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user || user.rewardPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Not enough reward points' });
    }

    user.rewardPoints -= pointsToRedeem;
    await user.save();

    res.json({
      message: 'Points redeemed successfully',
      rewardPoints: user.rewardPoints,
    });
  } catch (err) {
    console.error('Redemption failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all architects
// @route   GET /api/user/architects
// @access  Private (or Public if needed)
const getArchitects = async (req, res) => {
  try {
    const architects = await User.find({ role: 'architect' }).select('_id name email phoneNumber');
    res.json(architects);
  } catch (err) {
    console.error('Error fetching architects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("_id email phoneNumber name");
    res.json(vendors);
  } catch (error) {
    console.log("Erros in fetching vendors:", err)
    res.status(500).json({ message: "Server Error" })
  }
}

const getMaterialSuppliers = async (req, res) => {
  try {
    const materialSup = await User.find({ role: "Material Supplier" }).select("_id email phoneNumber name role");
    res.json(materialSup);
  } catch (error) {
    console.log("Errors in fetching the Material Suppliers:", err);
    res.status(500).json({ message: "Server Error" })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["architect", "client"] } })
      .select("_id email phoneNumber name role"); // optional select fields
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const createUser = async (req, res) => {
  try {
    const { name, type } = req.body;

    // Validate input
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    // Create the user
    const newUser = await User.create({ name, type });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in creating user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  getUserProfile,
  redeemPoints,
  getArchitects,
  getVendors,
  getUsers,
  getMaterialSuppliers,
  createUser,
};
