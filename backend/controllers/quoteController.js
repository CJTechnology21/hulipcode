const Quote = require("../models/Quote");

//  Create Quote
const createQuote = async (req, res) => {
    try {
        const quote = new Quote(req.body);
        await quote.save();
        res.status(201).json({ success: true, data: quote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//  Get All Quotes (with filters & pagination optional)
const getQuotes = async (req, res) => {
    try {
        const { status, name, city } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (name) filter.name = new RegExp(name, "i"); // case-insensitive search
        if (city) filter.city = new RegExp(city, "i");

        const quotes = await Quote.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: quotes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//  Get Single Quote by ID
const getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        res.status(200).json({ success: true, data: quote });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//  Update Quote (PUT – full update)
const updateQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }

        res.status(200).json({ success: true, data: quote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Patch Quote (partial update)
const patchQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }

        res.status(200).json({ success: true, data: quote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//  Delete Quote
const deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        res.status(200).json({ success: true, message: "Quote deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getQuotes, getQuoteById, createQuote, updateQuote, deleteQuote, patchQuote }
