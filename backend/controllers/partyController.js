const ProjectParty = require("../models/Party");

//  Create
const createParty = async (req, res) => {
    try {
        const { projectId, name, type, amount, paymentType } = req.body;
        const party = await ProjectParty.create({ projectId, name, type, amount, paymentType });
        res.status(201).json(party);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//  Read All (by projectId)
const getPartiesByProject = async (req, res) => {
    try {
        const { projectId } = req.query;
        const parties = await ProjectParty.find({ projectId });
        res.json(parties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Read One
const getPartyById = async (req, res) => {
    try {
        const party = await ProjectParty.findById(req.params.id);
        if (!party) return res.status(404).json({ message: "Party not found" });
        res.json(party);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllParties = async (req, res) => {
    try {
        const parties = await ProjectParty.find();
        res.status(200).json(parties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get parties", error: error.message });
    }
};


//  Update (PATCH)
const updateParty = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await ProjectParty.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "Party not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
const deleteParty = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProjectParty.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Party not found" });
        res.json({ message: "Party deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { createParty, deleteParty, updateParty, getPartiesByProject, getPartyById, getAllParties }