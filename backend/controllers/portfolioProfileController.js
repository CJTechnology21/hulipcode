const PortfolioProfile = require("../models/PortfolioProfile");
const { isProfessional, isAdmin } = require("../middleware/aclMiddleware");

// Get or create portfolio profile for current user
const getPortfolioProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only professionals and admins can access
    if (!isProfessional(req.user) && !isAdmin(req.user)) {
      return res.status(403).json({ message: "Only professionals can access portfolio profile" });
    }

    let profile = await PortfolioProfile.findOne({ architectId: req.user._id })
      .populate('architectId', 'name email');

    // If no profile exists, return empty structure
    if (!profile) {
      return res.status(200).json({
        portfolioName: "",
        completedProjects: 0,
        description: "",
        address: "",
        socialLinks: {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: ""
        },
        accreditations: [],
        images: []
      });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Get portfolio profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create or update portfolio profile
const savePortfolioProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only professionals and admins can create/update
    if (!isProfessional(req.user) && !isAdmin(req.user)) {
      return res.status(403).json({ message: "Only professionals can save portfolio profile" });
    }

    const {
      portfolioName,
      completedProjects,
      description,
      address,
      socialLinks,
      accreditations,
      images
    } = req.body;

    // Validate required fields
    if (!portfolioName || portfolioName.trim() === "") {
      return res.status(400).json({ message: "Portfolio name is required" });
    }

    // Find existing profile or create new one
    const profileData = {
      architectId: req.user._id,
      portfolioName: portfolioName.trim(),
      completedProjects: Number(completedProjects) || 0,
      description: description?.trim() || "",
      address: address?.trim() || "",
      socialLinks: {
        facebook: socialLinks?.facebook?.trim() || "",
        instagram: socialLinks?.instagram?.trim() || "",
        linkedin: socialLinks?.linkedin?.trim() || "",
        twitter: socialLinks?.twitter?.trim() || ""
      },
      accreditations: Array.isArray(accreditations) 
        ? accreditations.filter(acc => acc && acc.trim()).map(acc => acc.trim())
        : [],
      images: Array.isArray(images) 
        ? images.slice(0, 5).filter(img => img && img.trim()).map(img => img.trim())
        : []
    };

    const profile = await PortfolioProfile.findOneAndUpdate(
      { architectId: req.user._id },
      profileData,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    ).populate('architectId', 'name email');

    res.status(200).json({
      message: "Portfolio profile saved successfully",
      profile
    });
  } catch (err) {
    console.error("Save portfolio profile error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Update portfolio profile (same as save, but explicit update)
const updatePortfolioProfile = async (req, res) => {
  return savePortfolioProfile(req, res);
};

// Get all portfolio profiles (public access for Professional section)
const getAllPortfolioProfiles = async (req, res) => {
  try {
    const Portfolio = require("../models/Portfolio");
    
    const profiles = await PortfolioProfile.find({})
      .populate('architectId', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    // Get portfolio projects for each professional
    const profilesWithProjects = await Promise.all(
      profiles.map(async (profile) => {
        const projects = await Portfolio.find({ architectId: profile.architectId._id })
          .select('name type images budget timeframe')
          .limit(10) // Limit to 10 most recent projects
          .sort({ createdAt: -1 });
        
        return {
          ...profile.toObject(),
          projects: projects
        };
      })
    );

    res.status(200).json(profilesWithProjects);
  } catch (err) {
    console.error("Get all portfolio profiles error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get portfolio profile by architect ID (public access)
const getPortfolioProfileByArchitectId = async (req, res) => {
  try {
    const { architectId } = req.params;
    
    const profile = await PortfolioProfile.findOne({ architectId })
      .populate('architectId', 'name email phoneNumber');

    if (!profile) {
      return res.status(404).json({ message: "Portfolio profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Get portfolio profile by architect ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPortfolioProfile,
  savePortfolioProfile,
  updatePortfolioProfile,
  getAllPortfolioProfiles,
  getPortfolioProfileByArchitectId
};

