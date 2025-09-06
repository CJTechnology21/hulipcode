const express = require("express");
const {protect} = require("../middleware/authMiddleware")
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  patchLead,
  deleteLead,
  getClientType,
} = require("../controllers/leadController");

router.post("/", protect, createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id", protect, updateLead);
router.patch("/:id", protect, patchLead);
router.delete("/:id", protect, deleteLead);
router.get("/:id/client-type", getClientType);

module.exports = router;
