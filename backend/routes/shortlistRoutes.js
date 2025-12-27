const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToShortlist,
  removeFromShortlist,
  getShortlistedProfessionals,
  checkShortlisted,
  checkMultipleShortlisted
} = require("../controllers/shortlistController");

router.post("/", protect, addToShortlist);
router.delete("/", protect, removeFromShortlist);
router.get("/", protect, getShortlistedProfessionals);
router.get("/check/:professionalId", protect, checkShortlisted);
router.post("/check-multiple", protect, checkMultipleShortlisted);

module.exports = router;



