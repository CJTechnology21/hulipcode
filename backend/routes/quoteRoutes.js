const express = require("express");
const router = express.Router();
const { createQuote, getQuoteById, getQuotes, updateQuote, deleteQuote, patchQuote, getQuoteSummary, addSummaryToQuote } = require("../controllers/quoteController");

// CRUD + PATCH
router.post("/", createQuote);
router.get("/", getQuotes);
router.get("/:id", getQuoteById);
router.put("/:id", updateQuote);
router.patch("/:id", patchQuote);
router.delete("/:id", deleteQuote);
router.get("/:id/summary", getQuoteSummary)
router.post("/:id/summary", addSummaryToQuote)

module.exports = router;
