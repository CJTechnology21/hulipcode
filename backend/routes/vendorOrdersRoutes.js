const express = require("express");
const {
  createVendorOrder,
  getVendorOrders,
  getVendorOrderById,
  updateVendorOrder,
  patchVendorOrder,
  deleteVendorOrder,
} = require("../controllers/vendorOrderController");

const router = express.Router();

router.post("/", createVendorOrder);
router.get("/", getVendorOrders);
router.get("/:id", getVendorOrderById);
router.put("/:id", updateVendorOrder);
router.patch("/:id", patchVendorOrder);
router.delete("/:id", deleteVendorOrder);

module.exports = router;
