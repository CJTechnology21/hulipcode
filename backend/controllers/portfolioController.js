const Portfolio = require("../models/Portfolio");
const { protect } = require("../middleware/authMiddleware");
const { isProfessional, isAdmin } = require("../middleware/aclMiddleware");

// Create a new portfolio project
const createPortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only professionals and admins can create portfolio projects
    if (!isProfessional(req.user) && !isAdmin(req.user)) {
      return res.status(403).json({ message: "Only professionals can create portfolio projects" });
    }

    const { name, budget, timeframe, type, images } = req.body;

    // Validate required fields
    if (!name || !budget || !timeframe || !type) {
      return res.status(400).json({ message: "Name, budget, timeframe, and type are required" });
    }

    // Validate images array (max 10 images)
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const portfolioData = {
      name,
      budget: Number(budget),
      timeframe,
      type,
      images,
      architectId: req.user._id
    };

    const portfolio = await Portfolio.create(portfolioData);
    res.status(201).json(portfolio);
  } catch (err) {
    console.error("Create portfolio error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all portfolio projects for the current user (professional)
const getPortfolios = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let query = {};

    // If admin, show all portfolios
    if (isAdmin(req.user)) {
      query = {};
    } else if (isProfessional(req.user)) {
      // If professional, show only their portfolios
      query = { architectId: req.user._id };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolios = await Portfolio.find(query)
      .populate('architectId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(portfolios);
  } catch (err) {
    console.error("Get portfolios error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single portfolio project by ID
const getPortfolioById = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const portfolio = await Portfolio.findById(id).populate('architectId', 'name email');

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio project not found" });
    }

    // Check access: admin can see all, professional can only see their own
    if (!isAdmin(req.user) && portfolio.architectId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    console.error("Get portfolio error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update a portfolio project
const updatePortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio project not found" });
    }

    // Check access
    if (!isAdmin(req.user) && portfolio.architectId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, budget, timeframe, type, images } = req.body;

    // Validate images if provided
    if (images && Array.isArray(images)) {
      if (images.length > 10) {
        return res.status(400).json({ message: "Maximum 10 images allowed" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (budget !== undefined) updateData.budget = Number(budget);
    if (timeframe) updateData.timeframe = timeframe;
    if (type) updateData.type = type;
    if (images) updateData.images = images;

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('architectId', 'name email');

    res.status(200).json(updatedPortfolio);
  } catch (err) {
    console.error("Update portfolio error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a portfolio project
const deletePortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio project not found" });
    }

    // Check access
    if (!isAdmin(req.user) && portfolio.architectId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Portfolio.findByIdAndDelete(id);
    res.status(200).json({ message: "Portfolio project deleted successfully" });
  } catch (err) {
    console.error("Delete portfolio error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get portfolios by architect ID (public access)
const getPortfoliosByArchitectId = async (req, res) => {
  try {
    const { architectId } = req.params;
    
    const portfolios = await Portfolio.find({ architectId })
      .populate('architectId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(portfolios);
  } catch (err) {
    console.error("Get portfolios by architect ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPortfoliosByArchitectId
};

