/**
 * Admin Routes
 * Admin-only endpoints for KYC approval, dispute management, wallet adjustments
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const {
  getPendingKYC,
  approveKYC,
  rejectKYC,
  getDisputes,
  getDisputeDetails,
  resolveDispute,
  getWallets,
  adjustWalletBalance,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

/**
 * KYC Management
 */
router.get('/kyc/pending', getPendingKYC);
router.post('/kyc/:userId/approve', approveKYC);
router.post('/kyc/:userId/reject', rejectKYC);

/**
 * Dispute Management
 */
router.get('/disputes', getDisputes);
router.get('/disputes/:disputeId', getDisputeDetails);
router.post('/disputes/:disputeId/resolve', resolveDispute);

/**
 * Wallet Management
 */
router.get('/wallets', getWallets);
router.patch('/wallets/:walletId/adjust', adjustWalletBalance);

module.exports = router;

