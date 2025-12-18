const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLedgerEntriesByProject,
  getLedgerEntryById,
} = require('../controllers/ledgerController');

// Get ledger entries for a project
router.get('/project/:projectId', protect, getLedgerEntriesByProject);

// Get single ledger entry by ID
router.get('/:id', protect, getLedgerEntryById);

module.exports = router;

