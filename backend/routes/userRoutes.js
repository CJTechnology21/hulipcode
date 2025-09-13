const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  redeemPoints,
  getArchitects,
  getVendors,
  getUsers,
  createUser,
  getMaterialSuppliers,
  addAddress,
  updateAddress,
  addBankDetail,
  updateBankDetail,
  uploadDocument,
  gettAdresses,
  getAddresses,
  getBankDetails,   // Aadhaar & PAN upload
} = require("../controllers/userController");

//  USER PROFILE  
// Get logged-in user's profile
router.get("/me", protect, getUserProfile);

// Get a specific user's profile by ID
router.get("/:userId", protect, getUserProfile);

//REWARD POINTS  
router.put("/:userId/redeem", protect, redeemPoints);

// ROLE-BASED FILTERS 
router.get("/architects", protect, getArchitects);
router.get("/vendors", protect, getVendors);
router.get("/material-suppliers", protect, getMaterialSuppliers);
router.get("/architects-clients", protect, getUsers);

// USER MANAGEMENT  
router.post("/", protect, createUser);

// ADDRESS MANAGEMENT  
router.get("/:userId/address", getAddresses)
//single address
router.get("/:userId/address/:addressId", getAddresses)
// Add new address to a user
router.post("/:userId/address", protect, addAddress);
// Update a specific address by subdocument ID
router.put("/:userId/address/:addressId", protect, updateAddress);

//  BANK DETAILS MANAGEMENT  
// Get all bank details
router.get("/:userId/bank", protect, getBankDetails);

// Get single bank detail
router.get("/:userId/bank/:bankId", protect, getBankDetails);

// Add new bank detail to a user
router.post("/:userId/bank", protect, addBankDetail);

// Update a specific bank detail by subdocument ID
router.put("/:userId/bank/:bankId", protect, updateBankDetail);

// DOCUMENT UPLOAD  
// Upload Aadhaar or PAN (re-upload overwrites old file)
router.put("/:userId/document", protect, uploadDocument);

module.exports = router;

// // routes/userRoutes.js
// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const {
//   getUserProfile,
//   redeemPoints,
//   getArchitects,
//   getVendors,
//   getUsers,
//   createUser,
//   getMaterialSuppliers,
// } = require("../controllers/userController");

// router.get("/me", protect, getUserProfile);
// router.put("/redeem", protect, redeemPoints);
// router.get('/architects', protect, getArchitects);
// router.get('/vendors', protect, getVendors)
// router.get("/material-suppliers", protect, getMaterialSuppliers)
// router.get("/architects-clients", protect, getUsers);
// router.post("/", protect, createUser);

// module.exports = router;
