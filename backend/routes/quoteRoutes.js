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

    // Spaces
    getSpaces,
    getSpaceById,
    addSpace,
    updateSpace,
    deleteSpace,

    // Openings
    getOpenings,
    getOpeningById,
    addOpening,
    updateOpening,
    deleteOpening,

    // Deliverables
    getDeliverables,
    getDeliverableById,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    createProjectFromQuote,
    getDeliverablesByQuoteId,
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

// SPACES ROUTES
router.get("/:id/summary/:spaceId/spaces", getSpaces);
router.get("/:id/summary/:spaceId/spaces/:itemId", getSpaceById);
router.post("/:id/summary/:spaceId/spaces", protect, addSpace);
router.patch("/:id/summary/:spaceId/spaces/:itemId", protect, updateSpace);
router.delete("/:id/summary/:spaceId/spaces/:itemId", protect, deleteSpace);

// OPENINGS ROUTES
router.get("/:id/summary/:spaceId/openings", getOpenings);
router.get("/:id/summary/:spaceId/openings/:itemId", getOpeningById);
router.post("/:id/summary/:spaceId/openings", protect, addOpening);
router.patch("/:id/summary/:spaceId/openings/:itemId", protect, updateOpening);
router.delete("/:id/summary/:spaceId/openings/:itemId", protect, deleteOpening);

// DELIVERABLES ROUTES
router.get("/:id/summary/:spaceId/deliverables", getDeliverables);
router.get("/:id/summary/:spaceId/deliverables/:itemId", getDeliverableById);
router.post("/:id/summary/:spaceId/deliverables", protect, addDeliverable);
router.patch("/:id/summary/:spaceId/deliverables/:itemId", protect, updateDeliverable);
router.delete("/:id/summary/:spaceId/deliverables/:itemId", protect, deleteDeliverable);


router.post("/:id/create-project", createProjectFromQuote);
// Fetch all deliverables by quote ID (used from project view)
router.get("/:quoteId/deliverables-by-quote", getDeliverablesByQuoteId);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//     // Quote
//     createQuote,
//     getQuoteById,
//     getQuotes,
//     updateQuote,
//     deleteQuote,

//     // Summary
//     getQuoteSummary,
//     addSummaryToQuote,
//     updateSummaryRow,
//     deleteSummaryRow,
// } = require("../controllers/quoteController");

// const { protect } = require("../middleware/authMiddleware");

// // QUOTE ROUTES
// router.post("/", protect, createQuote);
// router.get("/", getQuotes);
// router.get("/:id", getQuoteById);
// router.put("/:id", protect, updateQuote);
// router.delete("/:id", protect, deleteQuote);

// // SUMMARY ROUTES
// router.get("/:id/summary", getQuoteSummary);
// router.put("/:id/summary", protect, addSummaryToQuote);
// router.patch("/:id/summary/:spaceId", protect, updateSummaryRow);
// router.delete("/:id/summary/:spaceId", protect, deleteSummaryRow);

// module.exports = router;
