const express = require('express');
const router = express.Router();
const {
  createRFQ,
  getRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
  addMaterialsToRFQ,
  updateMaterialInRFQ,
  deleteMaterialFromRFQ,
  getMaterialsOfRFQ,
} = require('../controllers/rfqController');
const { protect } = require('../middleware/authMiddleware');

//  RFQ Routes  

// Get all RFQs
router.get('/', getRFQs);

// Get RFQ by ID
router.get('/:id', getRFQById);

// Create RFQ
router.post('/', protect, createRFQ);

// Update RFQ
router.put('/:id', protect, updateRFQ);

// Delete RFQ
router.delete('/:id', protect, deleteRFQ);

//  Material Routes (nested under RFQ)  

// Get all materials in an RFQ
router.get('/:id/materials', getMaterialsOfRFQ);

// Add materials to RFQ
router.post('/:id/materials', protect, addMaterialsToRFQ);

// Update a specific material inside RFQ
router.patch('/:id/materials/:materialId', protect, updateMaterialInRFQ);

// Delete a specific material inside RFQ
router.delete('/:id/materials/:materialId', protect, deleteMaterialFromRFQ);

module.exports = router;
