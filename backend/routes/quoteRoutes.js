const express = require("express");
const router = express.Router();
const { createQuote, getQuoteById, getQuotes, updateQuote, deleteQuote, patchQuote, getQuoteSummary, addSummaryToQuote } = require("../controllers/quoteController");
const { protect } = require("../middleware/authMiddleware")

router.post("/", protect, createQuote);
router.get("/", getQuotes);
router.get("/:id", getQuoteById);
router.put("/:id", protect, updateQuote);
router.patch("/:id", protect, patchQuote);
router.delete("/:id", protect, deleteQuote);
router.get("/:id/summary", protect, getQuoteSummary)
router.patch("/:id/summary", protect, addSummaryToQuote)

module.exports = router;
