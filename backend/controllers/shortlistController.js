const Shortlist = require("../models/Shortlist");

// Add a professional to user's shortlist
const addToShortlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { professionalId, portfolioProfileId } = req.body;

    if (!professionalId || !portfolioProfileId) {
      return res.status(400).json({ message: "Professional ID and Portfolio Profile ID are required" });
    }

    // Check if already shortlisted
    const exists = await Shortlist.findOne({ userId, professionalId });

    if (exists) {
      return res.status(200).json({ 
        message: "Already shortlisted",
        shortlisted: true 
      });
    }

    await Shortlist.create({ userId, professionalId, portfolioProfileId });
    res.status(201).json({ 
      message: "Professional shortlisted successfully",
      shortlisted: true 
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(200).json({ 
        message: "Already shortlisted",
        shortlisted: true 
      });
    }
    console.error("Add to shortlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a professional from user's shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { professionalId } = req.body;

    if (!professionalId) {
      return res.status(400).json({ message: "Professional ID is required" });
    }

    const result = await Shortlist.findOneAndDelete({ userId, professionalId });

    if (!result) {
      return res.status(404).json({ message: "Professional not found in shortlist" });
    }

    res.status(200).json({ 
      message: "Removed from shortlist",
      shortlisted: false 
    });
  } catch (err) {
    console.error("Remove from shortlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all shortlisted professionals for a user
const getShortlistedProfessionals = async (req, res) => {
  try {
    const userId = req.user._id;

    const shortlists = await Shortlist.find({ userId })
      .populate('professionalId', 'name email phoneNumber')
      .populate('portfolioProfileId')
      .sort({ createdAt: -1 });

    res.status(200).json(shortlists);
  } catch (err) {
    console.error("Get shortlisted professionals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if a professional is shortlisted by the user
const checkShortlisted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { professionalId } = req.params;

    if (!professionalId) {
      return res.status(400).json({ message: "Professional ID is required" });
    }

    const shortlisted = await Shortlist.findOne({ userId, professionalId });

    res.status(200).json({ 
      shortlisted: !!shortlisted 
    });
  } catch (err) {
    console.error("Check shortlisted error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check multiple professionals at once
const checkMultipleShortlisted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { professionalIds } = req.body;

    if (!Array.isArray(professionalIds)) {
      return res.status(400).json({ message: "Professional IDs must be an array" });
    }

    const shortlists = await Shortlist.find({ 
      userId, 
      professionalId: { $in: professionalIds } 
    });

    const shortlistedIds = shortlists.map(s => s.professionalId.toString());
    
    const result = professionalIds.reduce((acc, id) => {
      acc[id] = shortlistedIds.includes(id.toString());
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (err) {
    console.error("Check multiple shortlisted error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToShortlist,
  removeFromShortlist,
  getShortlistedProfessionals,
  checkShortlisted,
  checkMultipleShortlisted
};



