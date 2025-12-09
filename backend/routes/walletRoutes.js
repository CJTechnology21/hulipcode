const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createWalletForProject,
  getWalletBalance,
  getWalletByProjectId,
  handleDepositWebhook,
  adjustWalletBalance,
  getAllWallets,
} = require('../controllers/walletController');

// Webhook endpoint (no auth required - uses signature verification)
router.post('/webhook/deposit', handleDepositWebhook);

// Protected routes
router.post('/', protect, createWalletForProject);
router.get('/', protect, getAllWallets);
router.get('/balance/:projectId', protect, getWalletBalance);
router.get('/project/:projectId', protect, getWalletByProjectId);
router.patch('/:walletId/adjust', protect, adjustWalletBalance);

module.exports = router;






