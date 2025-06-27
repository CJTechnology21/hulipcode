const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToFavourites,
  getFavourites,
  removeFromFavourites,
} = require("../controllers/favouriteController");

router.post("/", protect, addToFavourites);
router.get("/", protect, getFavourites);
router.delete("/:productId", protect, removeFromFavourites);

module.exports = router;
