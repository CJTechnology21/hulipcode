const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createSiteMeasurement,
  getSiteMeasurementsByProject,
  getSiteMeasurementById,
  updateSiteMeasurement,
  deleteSiteMeasurement,
} = require("../controllers/siteMeasurementsController");

// Get all site measurements by projectId (optional query: ?projectId=xxx)
router.get("/", getSiteMeasurementsByProject);

// Create new site measurement
router.post("/", protect,createSiteMeasurement);

// Get single site measurement by ID
router.get("/:id", getSiteMeasurementById);

// Update site measurement
router.put("/:id", protect, updateSiteMeasurement);

// Delete site measurement
router.delete("/:id", protect,deleteSiteMeasurement);

module.exports = router;
