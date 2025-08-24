const express = require("express");
const router = express.Router();
const { createQuote, getQuoteById, getQuotes, updateQuote, deleteQuote, patchQuote } = require("../controllers/quoteController");

// CRUD + PATCH
router.post("/", createQuote);
router.get("/", getQuotes);
router.get("/:id", getQuoteById);
router.put("/:id", updateQuote);
router.patch("/:id", patchQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
