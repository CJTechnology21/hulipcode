const express = require("express");
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
  getCashFlowSummary
} = require("../controllers/transactionController");

// Create new transaction
router.post("/", createTransaction);

// Get all transactions with optional filters (?projectId=xxx&architectId=xxx)
router.get("/", getAllTransactions);

router.get("/cashflow", getCashFlowSummary);

// Get single transaction by ID
router.get("/:id", getTransactionById);

// Full update (PUT)
router.put("/:id", updateTransaction);

// Partial update (PATCH)
router.patch("/:id", patchTransaction);

// Delete transaction
router.delete("/:id", deleteTransaction);

module.exports = router;
