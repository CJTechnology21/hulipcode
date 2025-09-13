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

    res.json(user);
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
    const vendors = await User.find({ role: 'vendor' }).select('_id email phoneNumber name');
    res.json(vendors);
  } catch (err) {
    console.log('Error in fetching vendors:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMaterialSuppliers = async (req, res) => {
  try {
    const materialSup = await User.find({ role: 'Material Supplier' }).select('_id email phoneNumber name role');
    res.json(materialSup);
  } catch (err) {
    console.log('Errors in fetching the Material Suppliers:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['architect', 'client'] } })
      .select('_id email phoneNumber name role');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, role, phoneNumber, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const newUser = await User.create({ name, role, phoneNumber, email, password });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('Error in creating user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// NEW CONTROLLERS  

// @desc    Add new address
// @route   POST /api/user/address
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { userId } = req.params; // <-- take ID from URL

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(req.body); // req.body should match addressSchema
    await user.save();

    res.json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
// @desc    Update an address
// @route   PUT /api/user/address/:index
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Find the user by ID from URL
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the address by its ID inside user's addresses array
    const address = user.addresses.id(addressId);

    if (!address) return res.status(404).json({ message: "Address not found" });

    // Update only the fields passed in req.body
    Object.assign(address, req.body);

    await user.save();

    res.json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add new bank detail
// @route   POST /api/user/bank
// @access  Private
// Add Bank Detail
const addBankDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bankDetails.push(req.body); // req.body should match bankDetailsSchema
    await user.save();

    res.json({
      message: "Bank detail added successfully",
      bankDetails: user.bankDetails,
    });
  } catch (err) {
    console.error("Error adding bank detail:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a bank detail
// @route   PUT /api/user/bank/:index
// @access  Private
// Update Bank Detail
const updateBankDetail = async (req, res) => {
  try {
    const { userId, bankId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the specific bank detail inside the user's bankDetails array
    const bankDetail = user.bankDetails.id(bankId);
    if (!bankDetail)
      return res.status(404).json({ message: "Bank detail not found" });

    // Merge existing detail with new fields
    Object.assign(bankDetail, req.body);

    await user.save();

    res.json({
      message: "Bank detail updated successfully",
      bankDetails: user.bankDetails,
    });
  } catch (err) {
    console.error("Error updating bank detail:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Upload or update Aadhaar/PAN file
// @route   PUT /api/user/document
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, fileUrl } = req.body;
    // type should be either "aadhaar" or "pan"

    if (!type || !["aadhaar", "pan"].includes(type)) {
      return res.status(400).json({
        message: 'Invalid document type. Use "aadhaar" or "pan".',
      });
    }

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "aadhaar") {
      user.aadhaarFile = fileUrl;
    } else if (type === "pan") {
      user.panFile = fileUrl;
    }

    await user.save();

    res.json({
      message: `${type.toUpperCase()} uploaded/updated successfully`,
      aadhaarFile: user.aadhaarFile,
      panFile: user.panFile,
    });
  } catch (err) {
    console.error("Error uploading document:", err);
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
  addAddress,
  updateAddress,
  addBankDetail,
  updateBankDetail,
  uploadDocument,
};


// const User = require('../models/User');

// // @desc    Get logged-in user profile
// // @route   GET /api/user/me
// // @access  Private
// const getUserProfile = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized: no user in request' });
//     }

//     const user = await User.findById(req.user._id).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phoneNumber: user.phoneNumber || 'N/A',
//       rewardPoints: user.rewardPoints || 0,
//       role: user.role,
//     });
//   } catch (err) {
//     console.error('Error fetching user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // @desc    Redeem reward points
// // @route   PUT /api/user/redeem
// // @access  Private
// const redeemPoints = async (req, res) => {
//   const { pointsToRedeem } = req.body;

//   if (!pointsToRedeem || pointsToRedeem <= 0) {
//     return res.status(400).json({ message: 'Invalid redemption amount' });
//   }

//   try {
//     const user = await User.findById(req.user._id);

//     if (!user || user.rewardPoints < pointsToRedeem) {
//       return res.status(400).json({ message: 'Not enough reward points' });
//     }

//     user.rewardPoints -= pointsToRedeem;
//     await user.save();

//     res.json({
//       message: 'Points redeemed successfully',
//       rewardPoints: user.rewardPoints,
//     });
//   } catch (err) {
//     console.error('Redemption failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // @desc    Get all architects
// // @route   GET /api/user/architects
// // @access  Private (or Public if needed)
// const getArchitects = async (req, res) => {
//   try {
//     const architects = await User.find({ role: 'architect' }).select('_id name email phoneNumber');
//     res.json(architects);
//   } catch (err) {
//     console.error('Error fetching architects:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getVendors = async (req, res) => {
//   try {
//     const vendors = await User.find({ role: "vendor" }).select("_id email phoneNumber name");
//     res.json(vendors);
//   } catch (error) {
//     console.log("Erros in fetching vendors:", err)
//     res.status(500).json({ message: "Server Error" })
//   }
// }

// const getMaterialSuppliers = async (req, res) => {
//   try {
//     const materialSup = await User.find({ role: "Material Supplier" }).select("_id email phoneNumber name role");
//     res.json(materialSup);
//   } catch (error) {
//     console.log("Errors in fetching the Material Suppliers:", err);
//     res.status(500).json({ message: "Server Error" })
//   }
// }

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $in: ["architect", "client"] } })
//       .select("_id email phoneNumber name role"); // optional select fields
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// const createUser = async (req, res) => {
//   try {
//     const { name, type } = req.body;

//     // Validate input
//     if (!name || !type) {
//       return res.status(400).json({ message: "Name and type are required" });
//     }

//     // Create the user
//     const newUser = await User.create({ name, type });

//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Error in creating user:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// module.exports = {
//   getUserProfile,
//   redeemPoints,
//   getArchitects,
//   getVendors,
//   getUsers,
//   getMaterialSuppliers,
//   createUser,
// };
