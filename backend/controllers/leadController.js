const Lead = require("../models/Lead");
const Quote = require("../models/Quote");

// Helper functions to check user roles
const isAdmin = (user) => {
  return user && (user.role === 'admin' || user.isSuperAdmin === true);
};

const isClient = (user) => {
  return user && user.role === 'client';
};

const isProfessional = (user) => {
  return user && user.role === 'architect';
};

// Create Lead
const createLead = async (req, res) => {
  try {
    // Professionals cannot create leads - only clients and admins can
    if (req.user && isProfessional(req.user)) {
      return res.status(403).json({ message: "Professionals cannot create leads. Leads are created by clients." });
    }
    
    // If user is a client, set createdBy to their user ID
    const leadData = { ...req.body };
    if (req.user && isClient(req.user)) {
      leadData.createdBy = req.user._id;
    }
    
    const lead = await Lead.create(leadData);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Create lead error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all leads
const getLeads = async (req, res) => {
  try {
    let query = {};
    
    // If user is a client, only show leads they created
    if (req.user && isClient(req.user)) {
      query.createdBy = req.user._id;
    }
    // If user is a professional (architect), only show leads assigned to them that haven't been converted to quotes
    else if (req.user && isProfessional(req.user)) {
      query.assigned = req.user._id;
      
      // Find all leads assigned to this professional
      const allLeads = await Lead.find(query).populate("assigned", "name email").populate("createdBy", "name email");
      
      // Find all quotes that reference these leads
      const leadIds = allLeads.map(lead => lead._id);
      const quotes = await Quote.find({ leadId: { $in: leadIds } }).select("leadId");
      
      // Get the lead IDs that have been converted to quotes
      const convertedLeadIds = quotes.map(quote => quote.leadId.toString());
      
      // Filter out leads that have been converted to quotes
      const leads = allLeads.filter(lead => !convertedLeadIds.includes(lead._id.toString()));
      
      return res.status(200).json(leads);
    }
    // Admins see all leads
    
    const leads = await Lead.find(query).populate("assigned", "name email").populate("createdBy", "name email");
    res.status(200).json(leads);
  } catch (err) {
    console.error("Get leads error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single lead by _id
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assigned", "name email");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error("Get lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update lead (full)
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error("Update lead error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Patch lead (partial)
const patchLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    console.error("Patch lead error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    console.error("Delete lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get client type (Huelip / Non-Huelip) by Lead ID
const getClientType = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).select("isHuelip name");
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      leadId: lead._id,
      name: lead.name,
      isHuelip: lead.isHuelip,
      clientType: lead.isHuelip ? "Huelip" : "Non-Huelip"
    });
  } catch (err) {
    console.error("Get client type error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  patchLead,
  deleteLead,
  getClientType,
};


