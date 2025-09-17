const express = require('express');
const router = express.Router();

const {
  addPendingMaterial,
  getPendingMaterialsByProject,
  getPendingMaterialById,    // 👈 new
  updatePendingMaterial,     // 👈 new
  movePendingToRFQ,
  deletePendingMaterial,
} = require('../controllers/pendingMaterialsController');

const { protect } = require('../middleware/authMiddleware');

// ✅ Get all pending materials for a specific project
router.get('/project/:projectId', protect, getPendingMaterialsByProject);

// ✅ Get a single pending material by ID
router.get('/:id', protect, getPendingMaterialById);

// ✅ Add a new pending material
router.post('/', protect, addPendingMaterial);

// ✅ Update a pending material
router.put('/:id', protect, updatePendingMaterial);

// ✅ Delete a pending material
router.delete('/:id', protect, deletePendingMaterial);

// ✅ Move all pending materials from a project into an RFQ
router.post('/move/:rfqId', protect, movePendingToRFQ);

module.exports = router;

// const express = require('express');
// const router = express.Router();

// const {
//   addPendingMaterial,
//   getPendingMaterialsByProject,
//   movePendingToRFQ,
//   deletePendingMaterial,
// } = require('../controllers/pendingMaterialsController');

// const { protect } = require('../middleware/authMiddleware');

// // Get all pending materials for a specific project
// router.get('/project/:projectId', getPendingMaterialsByProject);

// // Move pending materials from a project into an RFQ
// router.post('/move/:rfqId', protect, movePendingToRFQ);

// //  Add a new pending material
// router.post('/', protect, addPendingMaterial);

// // Delete a pending material
// router.delete('/:id', protect, deletePendingMaterial);

// module.exports = router;
