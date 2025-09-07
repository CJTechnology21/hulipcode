const Quote = require("../models/Quote");

//  Create a new quote (without summary at first)
const createQuote = async (req, res) => {
  try {
    const { leadId, quoteAmount, assigned, city } = req.body;

    const newQuote = new Quote({ leadId, quoteAmount, assigned, city });
    const savedQuote = await newQuote.save();

    const populated = await Quote.findById(savedQuote._id)
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({ message: "Error creating quote", error: error.message });
  }
};

// Add or replace summary array
// Update summary
const addSummaryToQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;

    if (!Array.isArray(summary)) {
      return res.status(400).json({ message: "Summary must be an array" });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $set: { summary } },
      { new: true }
    )
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json({ summary: updatedQuote.summary });
  } catch (error) {
    console.error("Error adding summary:", error);
    res.status(500).json({ message: "Error adding summary", error: error.message });
  }
};

// Get only summary
const getQuoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id).select("summary");
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json({ summary: quote.summary || [] });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
};

// const addSummaryToQuote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { summary } = req.body;

//     if (!Array.isArray(summary)) {
//       return res.status(400).json({ message: "Summary must be an array" });
//     }

//     const updatedQuote = await Quote.findByIdAndUpdate(
//       id,
//       { $set: { summary } },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     console.error("Error adding summary:", error);
//     res.status(500).json({ message: "Error adding summary", error: error.message });
//   }
// };

// // Get only summary of a particular quote
// const getQuoteSummary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const quote = await Quote.findById(id).select("summary");
//     if (!quote) {
//       return res.status(404).json({ message: "Quote not found" });
//     }

//     res.status(200).json(quote.summary || []);
//   } catch (error) {
//     console.error("Error fetching summary:", error);
//     res.status(500).json({ message: "Error fetching summary", error: error.message });
//   }
// };


// Get all quotes
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotes", error });
  }
};

// Get one quote
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!quote) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quote", error });
  }
};

// PUT: Replace entire quote (including summary if passed)
const updateQuote = async (req, res) => {
  try {
    const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      overwrite: true, // full replacement
    })
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error updating quote", error });
  }
};

// PATCH: Partial update (quote fields OR summary rows)
const patchQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, summaryUpdate } = req.body;

    let patchedQuote;

    if (summary) {
      // Replace full summary array
      patchedQuote = await Quote.findByIdAndUpdate(id, { $set: { summary } }, { new: true });
    } else if (summaryUpdate) {
      // Partial update on a single summary row
      // summaryUpdate example: { space: "Kitchen", fields: { items: 12, amount: 460000 } }
      patchedQuote = await Quote.findOneAndUpdate(
        { _id: id, "summary.space": summaryUpdate.space },
        { $set: Object.fromEntries(Object.entries(summaryUpdate.fields).map(([k, v]) => [`summary.$.${k}`, v])) },
        { new: true }
      );
    } else {
      // Patch top-level fields
      patchedQuote = await Quote.findByIdAndUpdate(id, req.body, { new: true });
    }

    patchedQuote = await patchedQuote
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!patchedQuote) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json(patchedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error patching quote", error });
  }
};

// DELETE: delete quote OR delete summary row
const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { space } = req.query; // optional query param to remove specific summary row

    if (space) {
      const updated = await Quote.findByIdAndUpdate(
        id,
        { $pull: { summary: { space } } },
        { new: true }
      )
        .populate("leadId", "id name budget contact category city")
        .populate("assigned", "name email");

      if (!updated) return res.status(404).json({ message: "Quote not found" });
      return res.status(200).json(updated);
    }

    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quote", error });
  }
};

module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  patchQuote,
  deleteQuote,
  addSummaryToQuote,
  getQuoteSummary,
};

// const { get } = require("mongoose");
// const Quote = require("../models/Quote");

// //  Create a new quote
// const createQuote = async (req, res) => {
//     try {
//         const { leadId, quoteAmount, assigned } = req.body;

//         const newQuote = new Quote({
//             leadId,
//             quoteAmount,
//             assigned,
//         });

//         const savedQuote = await newQuote.save();

//         // Re-fetch with population
//         const populated = await Quote.findById(savedQuote._id)
//             .populate("leadId", "id name budget contact category city")
//             .populate("assigned", "name email");

//         res.status(201).json(populated);
//     } catch (error) {
//         console.error("Error creating quote:", error);
//         res.status(500).json({
//             message: "Error creating quote",
//             error: error.message,
//         });
//     }
// };

// //  Get all quotes
// const getQuotes = async (req, res) => {
//     try {
//         const quotes = await Quote.find()
//             .populate("leadId", "id name budget contact category")
//             .populate("assigned", "name email")
//             .sort({ createdAt: -1 });

//         res.status(200).json(quotes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching quotes", error });
//     }
// };

// //  Get a single quote by ID
// const getQuoteById = async (req, res) => {
//     try {
//         const quote = await Quote.findById(req.params.id)
//             .populate("leadId", "id name budget contact category")
//             .populate("assigned", "name email");

//         if (!quote) return res.status(404).json({ message: "Quote not found" });

//         res.status(200).json(quote);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching quote", error });
//     }
// };

// // //  Update a quote (PUT - replace all updatable fields)
// // Update a quote (PUT - replace all updatable fields)
// const updateQuote = async (req, res) => {
//     try {
//         // First, update the quote
//         await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });

//         // Then fetch the updated document with populated fields
//         const updatedQuote = await Quote.findById(req.params.id)
//             .populate("leadId", "id name budget contact category")
//             .populate("assigned", "name email");

//         if (!updatedQuote)
//             return res.status(404).json({ message: "Quote not found" });

//         res.status(200).json(updatedQuote);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating quote", error });
//     }
// };

// // Patch a quote (PATCH - update specific fields only)
// const patchQuote = async (req, res) => {
//     try {
//         // Apply partial updates
//         await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });

//         // Fetch the updated document with populated fields
//         const patchedQuote = await Quote.findById(req.params.id)
//             .populate("leadId", "id name budget contact category")
//             .populate("assigned", "name email");

//         if (!patchedQuote)
//             return res.status(404).json({ message: "Quote not found" });

//         res.status(200).json(patchedQuote);
//     } catch (error) {
//         res.status(500).json({ message: "Error patching quote", error });
//     }
// };

// // Delete a quote
// const deleteQuote = async (req, res) => {
//     try {
//         const deleted = await Quote.findByIdAndDelete(req.params.id);

//         if (!deleted) return res.status(404).json({ message: "Quote not found" });

//         res.status(200).json({ message: "Quote deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting quote", error });
//     }
// };


// module.exports = { createQuote, getQuotes, getQuoteById, updateQuote, patchQuote, deleteQuote }
