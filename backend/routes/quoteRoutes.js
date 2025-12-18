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

    // Standalone Spaces
    getStandaloneSpaces,
    createStandaloneSpace,
    getStandaloneSpaceById,
    updateStandaloneSpace,
    deleteStandaloneSpace,

    // Revisions
    createQuoteRevision,
    getQuoteRevisions,
    checkQuoteContractBlock,

    // Client Approval
    sendQuoteToClient,
    approveQuote,
} = require("../controllers/quoteController");

const { protect } = require("../middleware/authMiddleware");

// QUOTE ROUTES
router.post("/", protect, createQuote);
router.get("/", protect, getQuotes); // Added protect for ACL filtering
router.get("/:id", protect, getQuoteById); // Added protect for ACL check
router.put("/:id", protect, updateQuote);
router.patch("/:id", protect, updateQuote); // PATCH support for partial updates
router.delete("/:id", protect, deleteQuote);

// SUMMARY ROUTES
router.get("/:id/summary", protect, getQuoteSummary); // Added protect for ACL check
router.put("/:id/summary", protect, addSummaryToQuote);
router.patch("/:id/summary/:spaceId", protect, updateSummaryRow);
router.delete("/:id/summary/:spaceId", protect, deleteSummaryRow);

// SPACES ROUTES
router.get("/:id/summary/:spaceId/spaces", protect, getSpaces); // Added protect for ACL check
router.get("/:id/summary/:spaceId/spaces/:itemId", protect, getSpaceById); // Added protect for ACL check
router.post("/:id/summary/:spaceId/spaces", protect, addSpace);
router.patch("/:id/summary/:spaceId/spaces/:itemId", protect, updateSpace);
router.delete("/:id/summary/:spaceId/spaces/:itemId", protect, deleteSpace);

// OPENINGS ROUTES
router.get("/:id/summary/:spaceId/openings", protect, getOpenings); // Added protect for ACL check
router.get("/:id/summary/:spaceId/openings/:itemId", protect, getOpeningById); // Added protect for ACL check
router.post("/:id/summary/:spaceId/openings", protect, addOpening);
router.patch("/:id/summary/:spaceId/openings/:itemId", protect, updateOpening);
router.delete("/:id/summary/:spaceId/openings/:itemId", protect, deleteOpening);

// DELIVERABLES ROUTES
router.get("/:id/summary/:spaceId/deliverables", protect, getDeliverables); // Added protect for ACL check
router.get("/:id/summary/:spaceId/deliverables/:itemId", protect, getDeliverableById); // Added protect for ACL check
router.post("/:id/summary/:spaceId/deliverables", protect, addDeliverable);
router.patch("/:id/summary/:spaceId/deliverables/:itemId", protect, updateDeliverable);
router.delete("/:id/summary/:spaceId/deliverables/:itemId", protect, deleteDeliverable);


router.post("/:id/create-project", protect, createProjectFromQuote);
// Fetch all deliverables by quote ID (used from project view)
router.get("/:quoteId/deliverables-by-quote", getDeliverablesByQuoteId);

// STANDALONE SPACES ROUTES (at quote level, not in summary)
router.get("/:id/spaces", protect, getStandaloneSpaces);
router.post("/:id/spaces", protect, createStandaloneSpace);
router.get("/:id/spaces/:spaceId", protect, getStandaloneSpaceById);
router.patch("/:id/spaces/:spaceId", protect, updateStandaloneSpace);
router.delete("/:id/spaces/:spaceId", protect, deleteStandaloneSpace);

// REVISION ROUTES
router.post("/:id/revision", protect, createQuoteRevision);
router.get("/:id/revisions", protect, getQuoteRevisions);
router.get("/:id/check-contract-block", protect, checkQuoteContractBlock);

// CLIENT APPROVAL ROUTES
router.post("/:id/send-to-client", protect, sendQuoteToClient);
router.post("/:id/approve", approveQuote); // Public route for client approval via email link

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
