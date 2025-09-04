const { get } = require("mongoose");
const Quote = require("../models/Quote");

//  Create a new quote
const createQuote = async (req, res) => {
  try {
    const { leadId, quoteAmount, assigned } = req.body;

    const newQuote = new Quote({
      leadId,
      quoteAmount,
      assigned,
    });

    const savedQuote = await newQuote.save();

    // Re-fetch with population
    const populated = await Quote.findById(savedQuote._id)
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({
      message: "Error creating quote",
      error: error.message,
    });
  }
};

// const createQuote = async (req, res) => {
//     try {
//         const { leadId, budget, quoteAmount, assigned } = req.body;

//         const newQuote = new Quote({
//             leadId,
//             budget,
//             quoteAmount,
//             assigned,
//         });

//         const savedQuote = await newQuote.save();

//         const populated = await savedQuote
//             .populate("leadId", "id name budget contact category")
//             .populate("assigned", "name email");

//         res.status(201).json(populated);
//     } catch (error) {
//         console.error(" Error creating quote:", error); // log full error
//         res.status(500).json({
//             message: "Error creating quote",
//             error: error.message, // send actual error message
//         });
//     }
// };


//  Get all quotes
const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find()
            .populate("leadId", "id name budget contact category")
            .populate("assigned", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quotes", error });
    }
};

//  Get a single quote by ID
const getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id)
            .populate("leadId", "id name budget contact category")
            .populate("assigned", "name email");

        if (!quote) return res.status(404).json({ message: "Quote not found" });

        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quote", error });
    }
};

//  Update a quote (PUT - replace all updatable fields)
const updateQuote = async (req, res) => {
    try {
        const updated = await Quote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
            .populate("leadId", "id name budget contact category")
            .populate("assigned", "name email");

        if (!updated) return res.status(404).json({ message: "Quote not found" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating quote", error });
    }
};

//  Patch a quote (update specific fields only)
const patchQuote = async (req, res) => {
    try {
        const patched = await Quote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
            .populate("leadId", "id name budget contact category")
            .populate("assigned", "name email");

        if (!patched) return res.status(404).json({ message: "Quote not found" });

        res.status(200).json(patched);
    } catch (error) {
        res.status(500).json({ message: "Error patching quote", error });
    }
};

// Delete a quote
const deleteQuote = async (req, res) => {
    try {
        const deleted = await Quote.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ message: "Quote not found" });

        res.status(200).json({ message: "Quote deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting quote", error });
    }
};


module.exports = { createQuote, getQuotes, getQuoteById, updateQuote, patchQuote, deleteQuote }

// const Quote = require("../models/Quote");

// //  Create Quote
// const createQuote = async (req, res) => {
//     try {
//         const quote = new Quote(req.body);
//         await quote.save();
//         res.status(201).json({ success: true, data: quote });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// //  Get All Quotes (with filters & pagination optional)
// const getQuotes = async (req, res) => {
//     try {
//         const { status, name, city } = req.query;
//         const filter = {};

//         if (status) filter.status = status;
//         if (name) filter.name = new RegExp(name, "i"); // case-insensitive search
//         if (city) filter.city = new RegExp(city, "i");

//         const quotes = await Quote.find(filter).sort({ createdAt: -1 });
//         res.status(200).json({ success: true, data: quotes });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// //  Get Single Quote by ID
// const getQuoteById = async (req, res) => {
//     try {
//         const quote = await Quote.findById(req.params.id);
//         if (!quote) {
//             return res.status(404).json({ success: false, message: "Quote not found" });
//         }
//         res.status(200).json({ success: true, data: quote });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// //  Update Quote (PUT – full update)
// const updateQuote = async (req, res) => {
//     try {
//         const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });

//         if (!quote) {
//             return res.status(404).json({ success: false, message: "Quote not found" });
//         }

//         res.status(200).json({ success: true, data: quote });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// // Patch Quote (partial update)
// const patchQuote = async (req, res) => {
//     try {
//         const quote = await Quote.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true, runValidators: true }
//         );

//         if (!quote) {
//             return res.status(404).json({ success: false, message: "Quote not found" });
//         }

//         res.status(200).json({ success: true, data: quote });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// //  Delete Quote
// const deleteQuote = async (req, res) => {
//     try {
//         const quote = await Quote.findByIdAndDelete(req.params.id);
//         if (!quote) {
//             return res.status(404).json({ success: false, message: "Quote not found" });
//         }
//         res.status(200).json({ success: true, message: "Quote deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// module.exports = { getQuotes, getQuoteById, createQuote, updateQuote, deleteQuote, patchQuote }
