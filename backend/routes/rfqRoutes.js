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
  createAndPublishRFQ,
  publishExistingRFQ,
  addResponseToRFQ,
  getResponsesOfRFQ,
} = require('../controllers/rfqController');
const { protect } = require('../middleware/authMiddleware');

// ---------------------- RFQ Routes ----------------------

// Get all RFQs
router.get('/', getRFQs);

// Get RFQ by ID
router.get('/:id', getRFQById);

// Create RFQ (Draft)
router.post('/', protect, createRFQ);

// Publish RFQ directly
router.post('/publish', protect, createAndPublishRFQ);

// Publish existing draft
router.put('/:id/publish', protect, publishExistingRFQ);

// Update RFQ
router.put('/:id', protect, updateRFQ);

// Delete RFQ
router.delete('/:id', protect, deleteRFQ);

// ---------------------- Material Routes ----------------------

// Get all materials in an RFQ
router.get('/:id/materials', getMaterialsOfRFQ);

// Add materials to RFQ
router.post('/:id/materials', protect, addMaterialsToRFQ);

// Update a specific material inside RFQ
router.patch('/:id/materials/:materialId', protect, updateMaterialInRFQ);

// Delete a specific material inside RFQ
router.delete('/:id/materials/:materialId', protect, deleteMaterialFromRFQ);

//  Response Routes 

// Get all responses for an RFQ
router.get('/:id/responses', getResponsesOfRFQ);

// Add response(s) to an RFQ
router.post('/:id/responses', protect, addResponseToRFQ);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   createRFQ,
//   getRFQs,
//   getRFQById,
//   updateRFQ,
//   deleteRFQ,
//   addMaterialsToRFQ,
//   updateMaterialInRFQ,
//   deleteMaterialFromRFQ,
//   getMaterialsOfRFQ,
//   createAndPublishRFQ,
//   publishExistingRFQ,
// } = require('../controllers/rfqController');
// const { protect } = require('../middleware/authMiddleware');

// //  RFQ Routes  

// // Get all RFQs
// router.get('/', getRFQs);

// // Get RFQ by ID
// router.get('/:id', getRFQById);

// // Create RFQ
// router.post('/', protect, createRFQ);

// //publish rfq  directly
// router.post('/publish', protect, createAndPublishRFQ)

// //publish exisiting draft
// router.put("/:id/publish", protect, publishExistingRFQ)

// // Update RFQ
// router.put('/:id', protect, updateRFQ);

// // Delete RFQ
// router.delete('/:id', protect, deleteRFQ);

// //  Material Routes (nested under RFQ)  

// // Get all materials in an RFQ
// router.get('/:id/materials', getMaterialsOfRFQ);

// // Add materials to RFQ
// router.post('/:id/materials', protect, addMaterialsToRFQ);

// // Update a specific material inside RFQ
// router.patch('/:id/materials/:materialId', protect, updateMaterialInRFQ);

// // Delete a specific material inside RFQ
// router.delete('/:id/materials/:materialId', protect, deleteMaterialFromRFQ);

// module.exports = router;
