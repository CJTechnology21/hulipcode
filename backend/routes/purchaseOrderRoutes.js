// routes/purchaseOrderRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const {
  punchQuotation,
  getAllPOs,
  getPOById,
  getPOsBySupplier,
  getPOsByArchitect,
  getPOsByProject,
  updatePO,
  deletePO,
} = require("../controllers/purchaseOrderController");

// Punch quotation → create PO
router.post("/punch/:id/:responseId", protect, punchQuotation);

//  Get all POs
router.get("/", getAllPOs);

// Get PO by ID
router.get("/:id", getPOById);

//  Get POs by Supplier
router.get("/supplier/:supplierId", getPOsBySupplier);

//  Get POs by Architect
router.get("/architect/:architectId", getPOsByArchitect);

//  Get POs by Project
router.get("/project/:projectId", getPOsByProject);

//  Update PO
router.put("/:id", protect, updatePO);

//  Delete PO
router.delete("/:id", protect, deletePO);

module.exports = router;
