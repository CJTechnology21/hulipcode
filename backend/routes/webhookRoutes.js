/**
 * Webhook Routes
 * Handles webhooks from external services
 * Note: Webhooks typically don't require authentication but use signature validation
 */

const express = require('express');
const router = express.Router();
const {
  handleEscrowDeposit,
  handleEsignCallback,
  webhookHealthCheck,
} = require('../controllers/webhookController');
const { validateWebhookSignature } = require('../middleware/webhookSignature');

/**
 * @route   GET /webhooks/health
 * @desc    Health check for webhook endpoints
 * @access  Public
 */
router.get('/health', webhookHealthCheck);

/**
 * @route   POST /webhooks/escrow/deposit
 * @desc    Handle escrow deposit webhook from payment providers
 * @access  Public (validated by signature)
 * 
 * Providers: Castler, Razorpay, etc.
 * 
 * Body:
 * {
 *   projectId: string (ObjectId),
 *   walletId: string (ObjectId, optional),
 *   amount: number,
 *   transactionId: string,
 *   status: 'success' | 'completed' | 'credited' | 'failed' | 'pending',
 *   currency: string (default: 'INR'),
 *   metadata: object (optional)
 * }
 * 
 * Headers:
 * - x-castler-signature: string (for Castler)
 * - x-razorpay-signature: string (for Razorpay)
 * - x-bypass-signature: 'true' (development only)
 */
router.post(
  '/escrow/deposit',
  validateWebhookSignature(process.env.ESCROW_PROVIDER || 'mock'),
  handleEscrowDeposit
);

/**
 * @route   POST /webhooks/esign/callback
 * @desc    Handle e-signature callback from Leegality
 * @access  Public (validated by signature)
 * 
 * Body:
 * {
 *   documentId: string,
 *   event: 'document.signed' | 'document.completed' | 'document.rejected' | 'invitee.signed',
 *   invitee: {
 *     email: string,
 *     name: string,
 *     status: 'signed' | 'pending' | 'rejected'
 *   },
 *   timestamp: string (ISO 8601),
 *   metadata: object (optional)
 * }
 * 
 * Headers:
 * - x-leegality-signature: string (for Leegality)
 * - x-bypass-signature: 'true' (development only)
 */
router.post(
  '/esign/callback',
  validateWebhookSignature('leegality'),
  handleEsignCallback
);

module.exports = router;

