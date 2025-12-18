const Quote = require("../models/Quote");
const Project = require("../models/Project");
const { checkQuoteAccess, isAdmin, isProfessional } = require("../middleware/aclMiddleware");
const { createWallet } = require("../services/walletService");
const { getStateForQuoteProject } = require("../services/projectStateMachine");
const {
  createRevision,
  checkContractSigningBlock,
  getQuoteRevisions: getQuoteRevisionsService,
  getOriginalQuote,
} = require("../services/quoteRevisionService");

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

// Get all quotes (filtered by ACL)
const getQuotes = async (req, res) => {
  try {
    let quotes;
    
    // Admin and Professional (architect) see all quotes
    if (req.user && (isAdmin(req.user) || isProfessional(req.user))) {
      quotes = await Quote.find()
        .populate("leadId", "id name budget contact category city")
        .populate("assigned", "name email")
        .sort({ createdAt: -1 });
    } else if (req.user) {
      // For homeowners, filter quotes based on user access
      const allQuotes = await Quote.find()
        .populate("leadId", "id name budget contact category city")
        .populate("assigned", "name email")
        .sort({ createdAt: -1 });
      
      const accessibleQuotes = [];
      
      for (const quote of allQuotes) {
        const access = await checkQuoteAccess(quote._id, req.user);
        if (access.allowed) {
          accessibleQuotes.push(quote);
        }
      }
      
      quotes = accessibleQuotes;
    } else {
      // Unauthenticated - return empty
      quotes = [];
    }

    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotes", error });
  }
};

// Get one quote - with ACL check
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email");

    if (!quote) return res.status(404).json({ message: "Quote not found" });

    // Check ACL if user is authenticated
    if (req.user) {
      const access = await checkQuoteAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quote", error });
  }
};

// Update full quote - with ACL check
const updateQuote = async (req, res) => {
  try {
    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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

// Delete full quote - with ACL check
const deleteQuote = async (req, res) => {
  try {
    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(req.params.id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const deleted = await Quote.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Quote not found" });

    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quote", error });
  }
};


// SUMMARY CONTROLLERS 


// Add or replace full summary array - with ACL check
const addSummaryToQuote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }
    
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

// Get only summary - with ACL check
const getQuoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const quote = await Quote.findById(id).select("summary");
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Ensure _id is included for each summary item by converting to plain objects
    const summaryWithIds = (quote.summary || []).map(item => {
      const itemObj = item.toObject ? item.toObject() : item;
      // Ensure _id is present
      if (!itemObj._id && item._id) {
        itemObj._id = item._id;
      }
      return itemObj;
    });

    res.status(200).json(summaryWithIds);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
};

// Update a single summary row (by spaceId) - with ACL check
const updateSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params;
    const { fields } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(spaceId) || !fields) {
      return res.status(400).json({ message: "quoteId, spaceId and fields are required" });
    }

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
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

// Delete a single summary row - with ACL check
const deleteSummaryRow = async (req, res) => {
  try {
    const { id, spaceId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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


// GET all nested items - with ACL check
const getNestedItems = async (req, res, field) => {
  try {
    const { id, spaceId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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

// GET single nested item - with ACL check
const getNestedItemById = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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

// ADD nested item - with ACL check
const addNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId } = req.params;
    const data = req.body;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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

// UPDATE nested item - with ACL check
const updateNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;
    const { fields } = req.body;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const path = `summary.$.${field}.$[elem]`;
    
    // Build update object - handle null values for assignedTo
    const updateObj = {};
    Object.entries(fields).forEach(([k, v]) => {
      if (k === "assignedTo" && (v === null || v === "" || v === "null" || v === "undefined")) {
        updateObj[`${path}.${k}`] = null;
      } else if (k === "assignedTo" && v) {
        // Convert to ObjectId if it's a valid string
        updateObj[`${path}.${k}`] = mongoose.Types.ObjectId.isValid(v) ? new mongoose.Types.ObjectId(v) : v;
      } else {
        updateObj[`${path}.${k}`] = v;
      }
    });

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id, "summary._id": spaceId },
      { $set: updateObj },
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

// DELETE nested item - with ACL check
const deleteNestedItem = async (req, res, field) => {
  try {
    const { id, spaceId, itemId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

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
    const { id } = req.params; // this is the quoteId
    const { architectId } = req.body;

    const quote = await Quote.findById(id)
      .populate("leadId", "name city category")
      .populate("assigned", "name _id");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if contract signing is blocked (for revisions)
    const blockCheck = await checkContractSigningBlock(quote);
    if (blockCheck.blocked) {
      return res.status(400).json({
        message: blockCheck.message || "Contract signing is blocked",
        blocked: true,
        reason: blockCheck.reason,
        details: blockCheck,
      });
    }

    // Pick architect ID — either from request or quote.assigned
    const resolvedArchitectId =
      architectId || (Array.isArray(quote.assigned) ? quote.assigned[0]?._id : null);

    if (!resolvedArchitectId) {
      return res
        .status(400)
        .json({ message: "Architect ID is missing in both quote and request body" });
    }

    // ✅ Include quoteId reference when creating the project
    const projectData = {
      name: quote.leadId?.name || "Unnamed Project",
      client: quote.leadId?.name || "Unknown Client",
      location: quote.leadId?.city || "Unknown Location",
      category: quote.leadId?.category || "RESIDENTIAL",
      status: getStateForQuoteProject(), // CONTRACT_SIGNED - project created from signed quote
      progress: 0,
      cashFlow: quote.quoteAmount || 0,
      isHuelip: !!quote.isHuelip,
      architectId: resolvedArchitectId,
      quoteId: quote._id, // ✅ store the quote reference
      leadId: quote.leadId?._id || null, // optional but helpful for cross lookup
    };

    const newProject = new Project(projectData);
    await newProject.save();

    // ✅ Create escrow wallet for the project
    try {
      // Pass projectId as string so walletService can populate quoteId
      const wallet = await createWallet(newProject._id.toString());
      console.log('✅ Wallet created for project:', wallet._id);
    } catch (walletError) {
      console.error('⚠️ Error creating wallet (non-blocking):', walletError);
      // Don't fail project creation if wallet creation fails
      // Wallet can be created manually later
    }

    res.status(201).json({
      message: "Project created successfully from quote",
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


// Get all deliverables for a given quote ID (used via Project's quoteId)
const getDeliverablesByQuoteId = async (req, res) => {
  try {
    let { quoteId } = req.params;
    
    // Handle if quoteId is an object (shouldn't happen but safety check)
    if (typeof quoteId === 'object' && quoteId !== null) {
      quoteId = quoteId._id || quoteId.toString();
    }
    
    // Validate quoteId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({ message: "Invalid quote ID format" });
    }

    // Find the quote by ID and only return summary.deliverables
    const quote = await Quote.findById(quoteId).select("summary.deliverables summary.space");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Flatten all deliverables from each summary row
    const User = require("../models/User");
    const allDeliverablesPromises = quote.summary.flatMap(summary => 
      (summary.deliverables || []).map(async (del) => {
        const delObj = del.toObject();
        // Populate assignedTo if it exists
        if (delObj.assignedTo) {
          try {
            const user = await User.findById(delObj.assignedTo).select("name email role");
            delObj.assignedTo = user ? { _id: user._id, name: user.name, email: user.email, role: user.role } : null;
          } catch (err) {
            console.error("Error populating assignedTo:", err);
            delObj.assignedTo = null;
          }
        }
        return {
          ...delObj,
          space: summary.space || "Unnamed Space",
          spaceId: summary._id // Include summary ID for updates
        };
      })
    );
    
    const allDeliverables = await Promise.all(allDeliverablesPromises);

    res.status(200).json({
      count: allDeliverables.length,
      deliverables: allDeliverables,
    });
  } catch (error) {
    console.error("Error fetching deliverables by quoteId:", error);
    res.status(500).json({
      message: "Error fetching deliverables by quoteId",
      error: error.message,
    });
  }
};

// STANDALONE SPACES CONTROLLERS (at quote level, not in summary)
// Get all standalone spaces for a quote
const getStandaloneSpaces = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const quote = await Quote.findById(id).select("spaces");
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json(quote.spaces || []);
  } catch (error) {
    console.error("Error fetching standalone spaces:", error);
    res.status(500).json({ message: "Error fetching standalone spaces", error: error.message });
  }
};

// Create a standalone space
const createStandaloneSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const spaceData = req.body;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const quote = await Quote.findByIdAndUpdate(
      id,
      { $push: { spaces: spaceData } },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Return the newly created space (last one in array)
    const newSpace = quote.spaces[quote.spaces.length - 1];
    res.status(201).json(newSpace);
  } catch (error) {
    console.error("Error creating standalone space:", error);
    res.status(500).json({ message: "Error creating standalone space", error: error.message });
  }
};

// Get a single standalone space
const getStandaloneSpaceById = async (req, res) => {
  try {
    const { id, spaceId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const quote = await Quote.findOne(
      { _id: id, "spaces._id": spaceId },
      { "spaces.$": 1 }
    );

    if (!quote || !quote.spaces?.length) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.status(200).json(quote.spaces[0]);
  } catch (error) {
    console.error("Error fetching standalone space:", error);
    res.status(500).json({ message: "Error fetching standalone space", error: error.message });
  }
};

// Update a standalone space
const updateStandaloneSpace = async (req, res) => {
  try {
    const { id, spaceId } = req.params;
    const { fields } = req.body;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    // Build update object with arrayFilters syntax
    const updateObj = {};
    Object.keys(fields).forEach(key => {
      updateObj[`spaces.$[elem].${key}`] = fields[key];
    });
    updateObj[`spaces.$[elem].updatedAt`] = new Date();

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id },
      { $set: updateObj },
      { 
        new: true, 
        arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(spaceId) }]
      }
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const updatedSpace = updatedQuote.spaces.find(s => s._id.toString() === spaceId.toString());
    if (!updatedSpace) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.status(200).json(updatedSpace);
  } catch (error) {
    console.error("Error updating standalone space:", error);
    res.status(500).json({ message: "Error updating standalone space", error: error.message });
  }
};

// Delete a standalone space
const deleteStandaloneSpace = async (req, res) => {
  try {
    const { id, spaceId } = req.params;

    // Check ACL first
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({ message: access.reason || "Access denied" });
      }
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $pull: { spaces: { _id: spaceId } } },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    console.error("Error deleting standalone space:", error);
    res.status(500).json({ message: "Error deleting standalone space", error: error.message });
  }
};

// Create revision of a quote
const createQuoteRevision = async (req, res) => {
  try {
    const { id } = req.params; // Original quote ID
    const revisionData = req.body;

    // Check quote access
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({
          message: access.reason || "Access denied to this quote",
        });
      }
    }

    // Create revision
    const result = await createRevision(id, revisionData);

    // Populate the revision
    const populatedRevision = await Quote.findById(result.revision._id)
      .populate("leadId", "id name budget contact category city")
      .populate("assigned", "name email")
      .populate("parent_quote_id", "qid quoteAmount");

    res.status(201).json({
      message: "Quote revision created successfully",
      revision: populatedRevision,
      originalQuote: result.originalQuote,
      topUpCheck: result.topUpCheck,
      underPaymentCheck: result.underPaymentCheck,
      canSignContract: result.canSignContract,
    });
  } catch (error) {
    console.error("Error creating quote revision:", error);
    res.status(500).json({
      message: "Error creating quote revision",
      error: error.message,
    });
  }
};

// Get revisions of a quote
const getQuoteRevisions = async (req, res) => {
  try {
    const { id } = req.params; // Quote ID (original or revision)

    // Check quote access
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({
          message: access.reason || "Access denied to this quote",
        });
      }
    }

    // Get original quote
    const originalQuote = await getOriginalQuote(id);
    
    // Get all revisions
    const revisions = await getQuoteRevisionsService(originalQuote._id);

    res.status(200).json({
      originalQuote,
      revisions,
      count: revisions.length,
    });
  } catch (error) {
    console.error("Error fetching quote revisions:", error);
    res.status(500).json({
      message: "Error fetching quote revisions",
      error: error.message,
    });
  }
};

// Check if contract signing is blocked for a quote
const checkQuoteContractBlock = async (req, res) => {
  try {
    const { id } = req.params; // Quote ID

    // Check quote access
    if (req.user) {
      const access = await checkQuoteAccess(id, req.user);
      if (!access.allowed) {
        return res.status(403).json({
          message: access.reason || "Access denied to this quote",
        });
      }
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check contract signing block
    const blockCheck = await checkContractSigningBlock(quote);

    res.status(200).json(blockCheck);
  } catch (error) {
    console.error("Error checking contract block:", error);
    res.status(500).json({
      message: "Error checking contract block",
      error: error.message,
    });
  }
};

// const createProjectFromQuote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { architectId } = req.body; // ✅ also accept manual override

//     const quote = await Quote.findById(id)
//       .populate("leadId", "name city category")
//       .populate("assigned", "name _id");

//     if (!quote) {
//       return res.status(404).json({ message: "Quote not found" });
//     }

//     // pick architect ID either from body or first assigned architect
//     const resolvedArchitectId =
//       architectId || (Array.isArray(quote.assigned) ? quote.assigned[0]?._id : null);

//     if (!resolvedArchitectId) {
//       return res
//         .status(400)
//         .json({ message: "Architect ID is missing in both quote and request body" });
//     }

//     const projectData = {
//       name: quote.leadId?.name || "Unnamed Project",
//       client: quote.leadId?.name || "Unknown Client",
//       location: quote.leadId?.city || "Unknown Location",
//       category: quote.leadId?.category || "RESIDENTIAL",
//       status: "EXECUTION IN PROGRESS",
//       progress: 0,
//       cashFlow: quote.quoteAmount || 0,
//       isHuelip: !!quote.isHuelip,
//       architectId: resolvedArchitectId, // ✅ fixed
//     };

//     const newProject = new Project(projectData);
//     await newProject.save();

//     res.status(201).json({
//       message: "Project created successfully after client approval",
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

// Send quote to client via email
const sendQuoteToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const emailAdapter = require("../services/adapters/emailAdapter");
    const Lead = require("../models/Lead");
    const User = require("../models/User");

    const quote = await Quote.findById(id)
      .populate("leadId", "name contact email")
      .populate("assigned", "name email");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Get client email - try multiple sources
    let clientEmail = null;
    const lead = quote.leadId;
    
    console.log("=== Finding Client Email ===");
    console.log("Lead:", lead?.name, "Contact:", lead?.contact, "Email:", lead?.email);
    
    // Priority 1: Check if lead has dedicated email field
    if (lead?.email && lead.email.includes("@")) {
      clientEmail = lead.email.trim();
      console.log("✅ Found email in lead.email field:", clientEmail);
    }
    // Priority 2: Check if contact field contains email
    else if (lead?.contact && lead.contact.includes("@")) {
      clientEmail = lead.contact.trim();
      console.log("✅ Found email in lead.contact field:", clientEmail);
    }
    // Priority 3: Try to find user by lead name or contact (phone number)
    else {
      console.log("Contact is not an email, searching User model...");
      const user = await User.findOne({
        $or: [
          { name: { $regex: new RegExp(lead?.name || "", "i") } },
          { phoneNumber: lead?.contact }
        ]
      }).select("email name phoneNumber");
      
      console.log("User found:", user ? { name: user.name, email: user.email, phone: user.phoneNumber } : "None");
      
      if (user?.email) {
        clientEmail = user.email.trim();
        console.log("✅ Found email in User model:", clientEmail);
      }
    }

    if (!clientEmail) {
      console.error("❌ Client email not found!");
      console.error("Lead details:", {
        name: lead?.name,
        contact: lead?.contact,
        isEmail: lead?.contact?.includes("@")
      });
      
      return res.status(400).json({ 
        success: false,
        message: "Client email not found. Please ensure the lead has an email address in the contact field or the client is registered as a user with an email.",
        details: {
          leadName: lead?.name,
          leadContact: lead?.contact,
          suggestion: "Please update the lead's contact field with an email address (e.g., client@example.com) or ensure the client is registered as a user with an email."
        }
      });
    }

    // Calculate totals
    const totalAmount = quote.summary?.reduce((sum, row) => sum + (Number(row.amount) || 0), 0) || 0;
    const totalTax = quote.summary?.reduce((sum, row) => sum + (Number(row.tax) || 0), 0) || 0;
    const total = totalAmount + totalTax;

    // Generate quote details HTML
    const quoteDetailsHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Quotation ${quote.qid}</h2>
        <p><strong>Client:</strong> ${lead?.name || "N/A"}</p>
        <p><strong>Total Amount:</strong> ₹${Number(total).toLocaleString("en-IN")}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
        
        <h3 style="margin-top: 30px;">Quote Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #dc2626; color: white;">
              <th style="padding: 10px; border: 1px solid #ddd;">Space</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Work Packages</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Items</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Tax</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quote.summary?.map((row, index) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${row.space || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${row.workPackages || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${row.items || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${Number(row.amount || 0).toLocaleString("en-IN")}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${Number(row.tax || 0).toLocaleString("en-IN")}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${Number((row.amount || 0) + (row.tax || 0)).toLocaleString("en-IN")}</td>
              </tr>
            `).join("") || "<tr><td colspan='6' style='text-align: center; padding: 20px;'>No items in quote</td></tr>"}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9fafb; font-weight: bold;">
              <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${Number(totalAmount).toLocaleString("en-IN")}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${Number(totalTax).toLocaleString("en-IN")}</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #dc2626;">₹${Number(total).toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 5px;">
          <p style="margin-bottom: 15px;"><strong>Please review this quotation and approve it to proceed with contract signing.</strong></p>
          <p style="margin-bottom: 10px;">To approve this quotation, please click the link below:</p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/quote/approve/${quote._id}" 
             style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Approve Quotation
          </a>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated email from Huelip Platform. Please do not reply to this email.
        </p>
      </div>
    `;

    const quoteDetailsText = `
Quotation ${quote.qid}

Client: ${lead?.name || "N/A"}
Total Amount: ₹${Number(total).toLocaleString("en-IN")}
Date: ${new Date().toLocaleDateString("en-IN")}

Quote Summary:
${quote.summary?.map((row, index) => 
  `${index + 1}. ${row.space || "-"} - Work Packages: ${row.workPackages || "-"}, Items: ${row.items || "-"}, Amount: ₹${Number(row.amount || 0).toLocaleString("en-IN")}, Tax: ₹${Number(row.tax || 0).toLocaleString("en-IN")}, Total: ₹${Number((row.amount || 0) + (row.tax || 0)).toLocaleString("en-IN")}`
).join("\n") || "No items in quote"}

Total Amount: ₹${Number(totalAmount).toLocaleString("en-IN")}
Total Tax: ₹${Number(totalTax).toLocaleString("en-IN")}
Grand Total: ₹${Number(total).toLocaleString("en-IN")}

Please review this quotation and approve it to proceed with contract signing.
To approve: ${process.env.FRONTEND_URL || "http://localhost:3000"}/quote/approve/${quote._id}
    `;

    // Send email
    await emailAdapter.send({
      to: clientEmail,
      subject: `Quotation ${quote.qid} - Review Required`,
      body: quoteDetailsText,
      html: quoteDetailsHTML,
      data: { quoteId: quote._id, qid: quote.qid }
    });

    // Update quote status to "In Review"
    quote.status = "In Review";
    quote.sentToClientAt = new Date();
    await quote.save();

    res.status(200).json({
      message: "Quote sent to client successfully",
      quote: quote,
      emailSent: true,
      clientEmail: clientEmail
    });
  } catch (error) {
    console.error("Error sending quote to client:", error);
    res.status(500).json({ 
      message: "Error sending quote to client", 
      error: error.message 
    });
  }
};

// Client approves quote
const approveQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id)
      .populate("leadId", "name");

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    if (quote.status === "Approved") {
      return res.status(400).json({ message: "Quote is already approved" });
    }

    // Update quote status to "Approved"
    quote.status = "Approved";
    quote.clientApprovedAt = new Date();
    await quote.save();

    res.status(200).json({
      message: "Quote approved successfully",
      quote: quote
    });
  } catch (error) {
    console.error("Error approving quote:", error);
    res.status(500).json({ 
      message: "Error approving quote", 
      error: error.message 
    });
  }
};

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
  getDeliverablesByQuoteId,

  // Revisions
  createQuoteRevision,
  getQuoteRevisions,
  checkQuoteContractBlock,

  // Standalone Spaces
  getStandaloneSpaces,
  createStandaloneSpace,
  getStandaloneSpaceById,
  updateStandaloneSpace,
  deleteStandaloneSpace,

  // Client Approval
  sendQuoteToClient,
  approveQuote,
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
