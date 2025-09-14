const RFQ = require("../models/RFQ");

//  Create new RFQ
const createRFQ = async (req, res) => {
    try {
        const rfq = new RFQ(req.body);
        await rfq.save();

        res.status(201).json({
            success: true,
            message: "RFQ created successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating RFQ",
            error: error.message,
        });
    }
};

// Get all RFQs
const getRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find()
            .populate("project", "name client location") // only pick needed fields
            .populate("supplier", "name email phone role");

        res.status(200).json({
            success: true,
            count: rfqs.length,
            data: rfqs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQs",
            error: error.message,
        });
    }
};

// Get single RFQ by ID
const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id)
            .populate("project", "name client location")
            .populate("supplier", "name email phone role");

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({ success: true, data: rfq });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQ",
            error: error.message,
        });
    }
};

// Update RFQ
const updateRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "RFQ updated successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating RFQ",
            error: error.message,
        });
    }
};

//  Delete RFQ
const deleteRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndDelete(req.params.id);

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "RFQ deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting RFQ",
            error: error.message,
        });
    }
};

module.exports = { createRFQ, getRFQs, getRFQById, updateRFQ, deleteRFQ }