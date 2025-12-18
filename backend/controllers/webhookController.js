/**
 * Webhook Controller
 * Handles webhooks from external services (escrow providers, e-signature platforms, etc.)
 */

const { depositWebhook } = require('../services/walletService');
const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const User = require('../models/User');

/**
 * Handle escrow deposit webhook
 * POST /webhooks/escrow/deposit
 * 
 * Expected payload format:
 * {
 *   projectId: string (ObjectId),
 *   walletId: string (ObjectId, optional),
 *   amount: number,
 *   transactionId: string,
 *   status: 'success' | 'completed' | 'credited' | 'failed' | 'pending',
 *   currency: string (default: 'INR'),
 *   metadata: object (optional)
 * }
 */
const handleEscrowDeposit = async (req, res) => {
  try {
    console.log('📥 Escrow deposit webhook received:', {
      timestamp: new Date().toISOString(),
      body: req.body,
      provider: req.webhookProvider || 'unknown',
    });

    // Validate required fields
    const { projectId, walletId, amount, transactionId, status } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be a positive number',
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing transactionId',
        message: 'transactionId is required',
      });
    }

    if (!projectId && !walletId) {
      return res.status(400).json({
        success: false,
        error: 'Missing identifier',
        message: 'Either projectId or walletId is required',
      });
    }

    // Process deposit webhook
    const result = await depositWebhook(req.body);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Deposit webhook processed successfully',
        data: {
          walletId: result.wallet._id,
          projectId: result.wallet.projectId,
          amount: result.amount,
          transactionId: result.transactionId,
          balance: result.wallet.balance,
          status: result.wallet.status,
        },
      });
    } else {
      // Return 200 even if not processed (to prevent retries)
      return res.status(200).json({
        success: false,
        message: result.message || 'Deposit not processed',
        data: result,
      });
    }
  } catch (error) {
    console.error('❌ Error processing escrow deposit webhook:', error);
    
    // Return 200 to prevent webhook retries for invalid requests
    // But log the error for investigation
    return res.status(200).json({
      success: false,
      error: 'Error processing webhook',
      message: error.message,
    });
  }
};

/**
 * Handle e-signature callback from Leegality
 * POST /webhooks/esign/callback
 * 
 * Expected payload format (Leegality v3.0):
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
 */
const handleEsignCallback = async (req, res) => {
  try {
    console.log('📥 E-signature callback received:', {
      timestamp: new Date().toISOString(),
      body: req.body,
      provider: req.webhookProvider || 'leegality',
    });

    const { documentId, event, invitee, timestamp, metadata } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing documentId',
        message: 'documentId is required',
      });
    }

    if (!event) {
      return res.status(400).json({
        success: false,
        error: 'Missing event',
        message: 'event is required',
      });
    }

    // Find contract by Leegality document ID
    const contract = await Contract.findOne({ leegalityDocumentId: documentId })
      .populate('quoteId')
      .populate('projectId');

    if (!contract) {
      console.warn(`⚠️  Contract not found for documentId: ${documentId}`);
      // Return 200 to acknowledge receipt, but log warning
      return res.status(200).json({
        success: false,
        message: 'Contract not found for documentId',
        documentId,
      });
    }

    // Handle different event types
    switch (event) {
      case 'document.signed':
      case 'invitee.signed':
        // Handle individual signer completion
        if (invitee && invitee.email) {
          // Update signing links status
          const signingLink = contract.leegalitySigningLinks.find(
            link => link.signerEmail === invitee.email
          );

          if (signingLink) {
            signingLink.status = 'signed';
            signingLink.signedAt = new Date(timestamp || Date.now());
          }

          // Determine if client or professional signed
          // This logic depends on your signer identification
          // For now, we'll check if it's the first signer (client) or second (professional)
          const isClient = contract.leegalitySigningLinks[0]?.signerEmail === invitee.email;
          
          if (isClient) {
            await contract.markClientSigned(
              contract.quoteId?.leadId || null,
              documentId
            );
          } else {
            // Assume professional/architect
            const project = await Project.findById(contract.projectId);
            if (project?.architectId) {
              await contract.markProfessionalSigned(project.architectId, documentId);
            }
          }
        }
        break;

      case 'document.completed':
        // All signers have signed
        contract.status = 'fully_signed';
        await contract.save();

        // Update project status if contract is fully signed
        if (contract.projectId) {
          const project = await Project.findById(contract.projectId);
          if (project && project.status === 'CONTRACT_PENDING') {
            project.status = 'CONTRACT_SIGNED';
            await project.save();
          }
        }
        break;

      case 'document.rejected':
        contract.status = 'cancelled';
        await contract.save();
        break;

      default:
        console.log(`ℹ️  Unhandled event type: ${event}`);
    }

    // Save contract updates
    await contract.save();

    return res.status(200).json({
      success: true,
      message: 'E-signature callback processed successfully',
      data: {
        documentId,
        event,
        contractId: contract._id,
        status: contract.status,
        signed_by_client: contract.signed_by_client,
        signed_by_professional: contract.signed_by_professional,
      },
    });
  } catch (error) {
    console.error('❌ Error processing e-signature callback:', error);
    
    // Return 200 to acknowledge receipt
    return res.status(200).json({
      success: false,
      error: 'Error processing callback',
      message: error.message,
    });
  }
};

/**
 * Health check endpoint for webhooks
 * GET /webhooks/health
 */
const webhookHealthCheck = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Webhook endpoints are operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      escrowDeposit: '/webhooks/escrow/deposit',
      esignCallback: '/webhooks/esign/callback',
    },
  });
};

module.exports = {
  handleEscrowDeposit,
  handleEsignCallback,
  webhookHealthCheck,
};

