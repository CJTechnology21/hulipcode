const express = require("express");
const router = express.Router();
const {
    // Quote
    createQuote,
    getQuoteById,
    getQuotes,
    updateQuote,
    deleteQuote,

    // Summary
    getQuoteSummary,
    addSummaryToQuote,
    updateSummaryRow,
    deleteSummaryRow,
} = require("../controllers/quoteController");

const { protect } = require("../middleware/authMiddleware");

// QUOTE ROUTES  
router.post("/", protect, createQuote);
router.get("/", getQuotes);
router.get("/:id", getQuoteById);
router.put("/:id", protect, updateQuote);
router.delete("/:id", protect, deleteQuote);

// SUMMARY ROUTES
router.get("/:id/summary", getQuoteSummary);
router.put("/:id/summary", protect, addSummaryToQuote);
router.patch("/:id/summary/:spaceId", protect, updateSummaryRow);
router.delete("/:id/summary/:spaceId", protect, deleteSummaryRow);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { createQuote, getQuoteById, getQuotes, updateQuote, deleteQuote, patchQuote, getQuoteSummary, addSummaryToQuote } = require("../controllers/quoteController");
// const { protect } = require("../middleware/authMiddleware")

// router.post("/", protect, createQuote);
// router.get("/", getQuotes);
// router.get("/:id", getQuoteById);
// router.put("/:id", protect, updateQuote);
// router.patch("/:id", protect, patchQuote);
// router.delete("/:id", protect, deleteQuote);
// router.get("/:id/summary", getQuoteSummary)
// router.patch("/:id/summary", protect, addSummaryToQuote)

// module.exports = router;
