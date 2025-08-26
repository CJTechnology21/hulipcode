const express = require("express");
const {
  createVendorOrder,
  getVendorOrders,
  getVendorOrderById,
  updateVendorOrder,
  patchVendorOrder,
  deleteVendorOrder,
  getVendorOrdersByArchitect,
} = require("../controllers/vendorOrderController");
const { protect } = require("../middleware/authMiddleware")
const router = express.Router();
router.get("/", getVendorOrdersByArchitect)
router.post("/", protect, createVendorOrder);
router.get("/", getVendorOrders);
router.get("/:id", getVendorOrderById);
router.put("/:id", protect, updateVendorOrder);
router.patch("/:id", protect, patchVendorOrder);
router.delete("/:id", protect, deleteVendorOrder);

module.exports = router;
