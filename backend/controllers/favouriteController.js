const Favourite = require("../models/Favourite");

// Add a product to user's favourites
const addToFavourites = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Check if already exists
    const exists = await Favourite.findOne({ userId, productId });

    if (exists) {
      return res.status(400).json({ message: "Product already in favourites" });
    }

    await Favourite.create({ userId, productId });
    res.status(201).json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Add to favourites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all favourite products for a user
const getFavourites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favourites = await Favourite.find({ userId }).populate("productId");
    res.status(200).json(favourites);
  } catch (err) {
    console.error("Get favourites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from favourites
const removeFromFavourites = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    await Favourite.deleteOne({ userId, productId });
    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("Remove favourite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToFavourites,
  getFavourites,
  removeFromFavourites,
};
