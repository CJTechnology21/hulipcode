const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
  getCashFlowSummary,
  getPaymentTransactions,
} = require("../controllers/transactionController");

// Create new transaction
router.post("/", protect, createTransaction); // Added protect for ACL check

// Get all transactions with optional filters (?projectId=xxx&architectId=xxx)
router.get("/", protect, getAllTransactions); // Added protect for ACL filtering

//Get paymnet in and out
router.get("/inout", protect, getPaymentTransactions); // Added protect for ACL check

//get Cashflow
router.get("/cashflow", protect, getCashFlowSummary); // Added protect for ACL check

// Get single transaction by ID
router.get("/:id", protect, getTransactionById); // Added protect for ACL check

// Full update (PUT)
router.put("/:id", protect, updateTransaction); // Added protect for ACL check

// Partial update (PATCH)
router.patch("/:id", protect, patchTransaction); // Added protect for ACL check

// Delete transaction
router.delete("/:id", protect, deleteTransaction); // Added protect for ACL check

module.exports = router;
