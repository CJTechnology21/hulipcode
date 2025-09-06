const Lead = require("../models/Lead");

// Create Lead
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body); // _id is used internally
    res.status(201).json(lead);
  } catch (err) {
    console.error("Create lead error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all leads
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assigned", "name email");
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


