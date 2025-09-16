const express = require('express');
const router = express.Router();

const {
  addPendingMaterial,
  getPendingMaterialsByProject,
  movePendingToRFQ,
  deletePendingMaterial,
} = require('../controllers/pendingMaterialsController');

const { protect } = require('../middleware/authMiddleware');

// Get all pending materials for a specific project
router.get('/project/:projectId', getPendingMaterialsByProject);

// Move pending materials from a project into an RFQ
router.post('/move/:rfqId', protect, movePendingToRFQ);

//  Add a new pending material
router.post('/', protect, addPendingMaterial);

// Delete a pending material
router.delete('/:id', protect, deletePendingMaterial);

module.exports = router;
