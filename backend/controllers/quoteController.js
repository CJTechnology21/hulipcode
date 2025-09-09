const Quote = require("../models/Quote");

//  QUOTE CONTROLLERS  //

// Create a new quote (without summary at first)
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

// Update full quote
const updateQuote = async (req, res) => {
  try {
    const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error updating quote", error });
  }
};

// Delete full quote
const deleteQuote = async (req, res) => {
  try {
    const deleted = await Quote.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quote", error });
  }
};

//  SUMMARY CONTROLLERS  //

// Add or replace full summary array
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

    res.status(200).json(updatedQuote.summary);
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

    res.status(200).json(quote.summary || []);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
};

// // Update a single summary row (by spaceId)
// Update a single summary row (by spaceId)
const updateSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params; // ✅ get both from params
    const { fields } = req.body;       // ✅ only fields in body

    if (!fields) {
      return res.status(400).json({ message: "fields are required" });
    }

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, "summary._id": spaceId }, // ✅ match by subdocument _id
      {
        $set: Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [`summary.$.${k}`, v])
        ),
      },
      { new: true }
    )
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote or summary row not found" });
    }

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error updating summary row", error });
  }
};

// Delete a single summary row (by spaceId)
const deleteSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params; // quoteId + spaceId

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $pull: { summary: { _id: spaceId } } }, // pull subdocument by _id
      { new: true }
    )
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) {
      return res
        .status(404)
        .json({ message: "Quote or summary row not found" });
    }

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error deleting summary row", error });
  }
};

// const updateSummaryRow = async (req, res) => {
//   try {
//     const { id } = req.params; // quoteId
//     const { spaceId, fields } = req.body;

//     if (!spaceId || !fields) {
//       return res.status(400).json({ message: "spaceId and fields are required" });
//     }

//     const updatedQuote = await Quote.findOneAndUpdate(
//       { _id: id, "summary.spaceId": spaceId },
//       {
//         $set: Object.fromEntries(
//           Object.entries(fields).map(([k, v]) => [`summary.$.${k}`, v])
//         ),
//       },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote or summary row not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating summary row", error });
//   }
// };

// // Delete a single summary row (by spaceId)
// const deleteSummaryRow = async (req, res) => {
//   try {
//     const { id } = req.params; // quoteId
//     const { spaceId } = req.body;

//     if (!spaceId) {
//       return res.status(400).json({ message: "spaceId is required" });
//     }

//     const updatedQuote = await Quote.findByIdAndUpdate(
//       id,
//       { $pull: { summary: { spaceId } } },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote or summary row not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting summary row", error });
//   }
// };

module.exports = {
  // Quote
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,

  // Summary
  addSummaryToQuote,
  getQuoteSummary,
  updateSummaryRow,
  deleteSummaryRow,
};

// const Quote = require("../models/Quote");

// //  QUOTE CONTROLLERS  //

// // Create a new quote (without summary at first)
// const createQuote = async (req, res) => {
//   try {
//     const { leadId, quoteAmount, assigned, city } = req.body;

//     const newQuote = new Quote({ leadId, quoteAmount, assigned, city });
//     const savedQuote = await newQuote.save();

//     const populated = await Quote.findById(savedQuote._id)
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     res.status(201).json(populated);
//   } catch (error) {
//     console.error("Error creating quote:", error);
//     res.status(500).json({ message: "Error creating quote", error: error.message });
//   }
// };

// // Get all quotes
// const getQuotes = async (req, res) => {
//   try {
//     const quotes = await Quote.find()
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json(quotes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quotes", error });
//   }
// };

// // Get one quote
// const getQuoteById = async (req, res) => {
//   try {
//     const quote = await Quote.findById(req.params.id)
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!quote) return res.status(404).json({ message: "Quote not found" });

//     res.status(200).json(quote);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quote", error });
//   }
// };

// // Update full quote (not summary)
// const updateQuote = async (req, res) => {
//   try {
//     const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     })
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating quote", error });
//   }
// };

// // Delete full quote (not summary row)
// const deleteQuote = async (req, res) => {
//   try {
//     const deleted = await Quote.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Quote not found" });

//     res.status(200).json({ message: "Quote deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting quote", error });
//   }
// };

// //  SUMMARY CONTROLLERS

// // Add or replace full summary array
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

//     res.status(200).json(updatedQuote.summary);
//   } catch (error) {
//     console.error("Error adding summary:", error);
//     res.status(500).json({ message: "Error adding summary", error: error.message });
//   }
// };

// // Get only summary
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

// // Update a single summary row (by space)
// const updateSummaryRow = async (req, res) => {
//   try {
//     const { id } = req.params; // quoteId
//     const { space, fields } = req.body;

//     if (!space || !fields) {
//       return res.status(400).json({ message: "Space and fields are required" });
//     }

//     const updatedQuote = await Quote.findOneAndUpdate(
//       { _id: id, "summary.space": space },
//       {
//         $set: Object.fromEntries(
//           Object.entries(fields).map(([k, v]) => [`summary.$.${k}`, v])
//         ),
//       },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote or summary row not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating summary row", error });
//   }
// };

// // Delete a single summary row (by space)
// const deleteSummaryRow = async (req, res) => {
//   try {
//     const { id } = req.params; // quoteId
//     const { space } = req.body;

//     if (!space) {
//       return res.status(400).json({ message: "Space is required" });
//     }

//     const updatedQuote = await Quote.findByIdAndUpdate(
//       id,
//       { $pull: { summary: { space } } },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) return res.status(404).json({ message: "Quote or summary row not found" });

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting summary row", error });
//   }
// };

// module.exports = {
//   // Quote
//   createQuote,
//   getQuotes,
//   getQuoteById,
//   updateQuote,
//   deleteQuote,

//   // Summary
//   addSummaryToQuote,
//   getQuoteSummary,
//   updateSummaryRow,
//   deleteSummaryRow,
// };
