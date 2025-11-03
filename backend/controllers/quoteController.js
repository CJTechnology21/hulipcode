const Quote = require("../models/Quote");
const Project = require("../models/Project");

const mongoose = require("mongoose");

// QUOTE CONTROLLERS 
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


// SUMMARY CONTROLLERS 


// Add or replace full summary array
const addSummaryToQuote = async (req, res) => {
  try {
    const { id } = req.params;
    let rows = req.body;

    if (!Array.isArray(rows)) {
      rows = [rows];
    }

    rows = rows.map(({ total, workPackages, items, amount, tax, ...rest }) => ({
      ...rest,
      workPackages: Number(workPackages) || 0,
      items: Number(items) || 0,
      amount: Number(amount) || 0,
      tax: Number(tax) || 0,
    }));

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $push: { summary: { $each: rows } } },
      { new: true }
    )
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json(updatedQuote.summary);
  } catch (error) {
    console.error("Error adding summary row:", error);
    res.status(500).json({ message: "Error adding summary row", error: error.message });
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

// Update a single summary row (by spaceId)
const updateSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params;
    const { fields } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(spaceId) || !fields) {
      return res.status(400).json({ message: "quoteId, spaceId and fields are required" });
    }

    const updatedQuote = await Quote.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        "summary._id": new mongoose.Types.ObjectId(spaceId)
      },
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
    console.error(" Error updating summary row:", error);
    res.status(500).json({ message: "Error updating summary row", error });
  }
};

// Delete a single summary row
const deleteSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params;

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $pull: { summary: { _id: new mongoose.Types.ObjectId(spaceId) } } },
      { new: true }
    )
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote or summary row not found" });
    }

    res.status(200).json(updatedQuote);
  } catch (error) {
    console.error(" Error deleting summary row:", error);
    res.status(500).json({ message: "Error deleting summary row", error });
  }
};

// NESTED CRUD HELPERS //


// GET all nested items
const getNestedItems = async (req, res, field) => {
  try {
    const { id, spaceId } = req.params;

    const quote = await Quote.findOne(
      { _id: id, "summary._id": spaceId },
      { "summary.$": 1 }
    );

    if (!quote || !quote.summary?.length) {
      return res.status(404).json({ message: "Summary row not found" });
    }

    res.status(200).json(quote.summary[0][field] || []);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${field}`, error: error.message });
  }
};

// GET single nested item
const getNestedItemById = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;

    const quote = await Quote.findOne(
      { _id: id, "summary._id": spaceId },
      { "summary.$": 1 }
    );

    if (!quote || !quote.summary?.length) {
      return res.status(404).json({ message: "Summary row not found" });
    }

    const item = quote.summary[0][field].id(itemId);
    if (!item) {
      return res.status(404).json({ message: `${field} item not found` });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${field} item`, error: error.message });
  }
};

// ADD nested item
const addNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId } = req.params;
    const data = req.body;

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, "summary._id": spaceId },
      { $push: { [`summary.$.${field}`]: data } },
      { new: true }
    );

    if (!updatedQuote) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: `Error adding ${field}`, error: error.message });
  }
};

// UPDATE nested item
const updateNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;
    const { fields } = req.body;

    const path = `summary.$.${field}.$[elem]`;

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, "summary._id": spaceId },
      { $set: Object.fromEntries(Object.entries(fields).map(([k, v]) => [`${path}.${k}`, v])) },
      {
        new: true,
        arrayFilters: [{ "elem._id": itemId }]
      }
    );

    if (!updatedQuote) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: `Error updating ${field}`, error: error.message });
  }
};

// DELETE nested item
const deleteNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, "summary._id": spaceId },
      { $pull: { [`summary.$.${field}`]: { _id: itemId } } },
      { new: true }
    );

    if (!updatedQuote) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${field}`, error: error.message });
  }
};

// WRAPPERS FOR EXPORT //
// SPACES
const getSpaces = (req, res) => getNestedItems(req, res, "spaces");
const getSpaceById = (req, res) => getNestedItemById(req, res, "spaces");
const addSpace = (req, res) => addNestedItem(req, res, "spaces");
const updateSpace = (req, res) => updateNestedItem(req, res, "spaces");
const deleteSpace = (req, res) => deleteNestedItem(req, res, "spaces");

// OPENINGS
const getOpenings = (req, res) => getNestedItems(req, res, "openings");
const getOpeningById = (req, res) => getNestedItemById(req, res, "openings");
const addOpening = (req, res) => addNestedItem(req, res, "openings");
const updateOpening = (req, res) => updateNestedItem(req, res, "openings");
const deleteOpening = (req, res) => deleteNestedItem(req, res, "openings");

// DELIVERABLES (photo field stores S3 URL)
const getDeliverables = (req, res) => getNestedItems(req, res, "deliverables");
const getDeliverableById = (req, res) => getNestedItemById(req, res, "deliverables");
const addDeliverable = (req, res) => addNestedItem(req, res, "deliverables");
const updateDeliverable = (req, res) => updateNestedItem(req, res, "deliverables");
const deleteDeliverable = (req, res) => deleteNestedItem(req, res, "deliverables");


// Create project after contract signing
const createProjectFromQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id)
      .populate("leadId", "name city category")
      .populate("assigned", "name _id");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // build project data
    const projectData = {
      name: quote.leadId?.name || "Unnamed Project",
      client: quote.leadId?.name || "Unknown Client",
      location: quote.leadId?.city || "Unknown Location",
      category: quote.leadId?.category || "RESIDENTIAL",
      status: "EXECUTION IN PROGRESS",
      progress: 0,
      cashFlow: quote.quoteAmount || 0,
      isHuelip: !!quote.isHuelip,
      architectId: quote.assigned?._id,
    };

    const newProject = new Project(projectData);
    await newProject.save();

    res.status(201).json({
      message: " Project created successfully after client approval",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project from quote:", error);
    res.status(500).json({
      message: "Error creating project from quote",
      error: error.message,
    });
  }
};

// const createProjectFromQuote = async (req, res) => {
//   try {
//     const { id } = req.params; // quote ID
//     const quote = await Quote.findById(id)
//       .populate("leadId", "name city category")
//       .populate("assigned", "name _id");

//     if (!quote) return res.status(404).json({ message: "Quote not found" });

//     // build project data
//     const projectData = {
//       name: quote.leadId?.name || "Unnamed Project",
//       client: quote.leadId?.name || "Unknown Client",
//       location: quote.leadId?.city || "Unknown Location",
//       category: quote.leadId?.category || "RESIDENTIAL",
//       status: "EXECUTION IN PROGRESS",
//       progress: 0,
//       cashFlow: quote.quoteAmount || 0,
//       isHuelip: !!quote.isHuelip,
//       architectId: quote.assigned?._id, // assigned user
//     };

//     const newProject = new Project(projectData);
//     await newProject.save();

//     res.status(201).json({
//       message: "Project created successfully after contract signing",
//       project: newProject,
//     });
//   } catch (error) {
//     console.error("Error creating project from quote:", error);
//     res.status(500).json({
//       message: "Error creating project from quote",
//       error: error.message,
//     });
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

  //create project from 
  createProjectFromQuote,
};

// const Quote = require("../models/Quote");
// const mongoose = require("mongoose")
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

// // Update full quote
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

// // Delete full quote
// const deleteQuote = async (req, res) => {
//   try {
//     const deleted = await Quote.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Quote not found" });

//     res.status(200).json({ message: "Quote deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting quote", error });
//   }
// };

// //  SUMMARY CONTROLLERS  //

// // Add or replace full summary array
// const addSummaryToQuote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let rows = req.body;
//     console.log("Incoming rows:", rows); // 👈

//     // Wrap single object into array
//     if (!Array.isArray(rows)) {
//       rows = [rows];
//     }

//     // Remove `total` and ensure numeric fields are numbers
//     rows = rows.map(({ total, workPackages, items, amount, tax, ...rest }) => ({
//       ...rest,
//       workPackages: Number(workPackages) || 0,
//       items: Number(items) || 0,
//       amount: Number(amount) || 0,
//       tax: Number(tax) || 0,
//     }));

//     const updatedQuote = await Quote.findByIdAndUpdate(
//       id,
//       { $push: { summary: { $each: rows } } },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) {
//       return res.status(404).json({ message: "Quote not found" });
//     }

//     res.status(200).json(updatedQuote.summary);
//   } catch (error) {
//     console.error("Error adding summary row:", error);
//     res.status(500).json({ message: "Error adding summary row", error: error.message });
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

// // Update a single summary row (by spaceId)

// const updateSummaryRow = async (req, res) => {
//   try {
//     const { id, spaceId } = req.params;
//     const { fields } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(spaceId) || !fields) {
//       return res.status(400).json({ message: "quoteId, spaceId and fields are required" });
//     }

//     const updatedQuote = await Quote.findOneAndUpdate(
//       {
//         _id: new mongoose.Types.ObjectId(id),
//         "summary._id": new mongoose.Types.ObjectId(spaceId)
//       },
//       {
//         $set: Object.fromEntries(
//           Object.entries(fields).map(([k, v]) => [`summary.$.${k}`, v])
//         ),
//       },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) {
//       return res.status(404).json({ message: "Quote or summary row not found" });
//     }

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     console.error(" Error updating summary row:", error);
//     res.status(500).json({ message: "Error updating summary row", error });
//   }
// };


// // Delete a single summary row (by spaceId)
// const deleteSummaryRow = async (req, res) => {
//   try {
//     const { id, spaceId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(spaceId)) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     const updatedQuote = await Quote.findByIdAndUpdate(
//       id,
//       { $pull: { summary: { _id: new mongoose.Types.ObjectId(spaceId) } } },
//       { new: true }
//     )
//       .populate("leadId", "id name budget contact category city")
//       .populate("assigned", "name email");

//     if (!updatedQuote) {
//       return res.status(404).json({ message: "Quote or summary row not found" });
//     }

//     res.status(200).json(updatedQuote);
//   } catch (error) {
//     console.error(" Error deleting summary row:", error);
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
