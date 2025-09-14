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
  getAddresses,
  getBankDetails,
  deleteBankDetail,
  deleteAddress,
  updateUser,
} = require("../controllers/userController");


// ROLE-BASED FILTERS (static first )
router.get("/architects", protect, getArchitects);
router.get("/vendors", protect, getVendors);
router.get("/material-suppliers", protect, getMaterialSuppliers);
router.get("/architects-clients", protect, getUsers);

// USER PROFILE
router.get("/me", protect, getUserProfile);
//  Dynamic route moved LAST so it won’t block static routes
router.get("/:userId", protect, getUserProfile);
// REWARD POINTS
router.put("/:userId/redeem", protect, redeemPoints);


// USER MANAGEMENT
router.post("/", protect, createUser);
router.put("/:userId", protect, updateUser)
// ADDRESS MANAGEMENT
router.get("/:userId/address", protect, getAddresses);
router.get("/:userId/address/:addressId", protect, getAddresses);
router.post("/:userId/address", protect, addAddress);
router.put("/:userId/address/:addressId", protect, updateAddress);
router.delete("/:userId/address/:addressId", protect, deleteAddress)

// BANK DETAILS MANAGEMENT
router.get("/:userId/bank", protect, getBankDetails);
router.get("/:userId/bank/:bankId", protect, getBankDetails);
router.post("/:userId/bank", protect, addBankDetail);
router.put("/:userId/bank/:bankId", protect, updateBankDetail);
router.delete("/:userId/bank/:bankId", protect, deleteBankDetail)

// DOCUMENT UPLOAD
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
