const Wallet = require('../models/Wallet');
const Project = require('../models/Project');
const Quote = require('../models/Quote');

/**
 * Wallet Service
 * Handles all wallet-related operations for escrow payments
 */

/**
 * Create a new wallet for a project
 * Called after contract is signed and project is created
 * @param {Object} project - Project object or projectId
 * @returns {Promise<Wallet>} Created wallet
 */
const createWallet = async (project) => {
  try {
    // Get project if projectId was passed
    let projectDoc = project;
    if (typeof project === 'string' || project._id) {
      projectDoc = await Project.findById(project._id || project)
        .populate('quoteId');
    }

    if (!projectDoc) {
      throw new Error('Project not found');
    }

    // Check if wallet already exists
    const existingWallet = await Wallet.findOne({ projectId: projectDoc._id });
    if (existingWallet) {
      return existingWallet;
    }

    // Get quote to get the total amount (optional - some projects may not have quotes)
    let quote = null;
    if (projectDoc.quoteId) {
      quote = await Quote.findById(projectDoc.quoteId._id || projectDoc.quoteId);
    }

    // Create wallet - quoteId is optional for projects created manually
    const walletData = {
      projectId: projectDoc._id,
      balance: 0, // Start with zero, deposits will add to it
      status: 'pending', // Will become 'active' after first deposit
      provider: process.env.ESCROW_PROVIDER || 'internal',
      metadata: {
        totalDeposited: 0,
        totalWithdrawn: 0,
        depositCount: 0,
        withdrawalCount: 0,
      },
    };

    // Only add quoteId if quote exists
    if (quote) {
      walletData.quoteId = quote._id;
    }

    const wallet = await Wallet.create(walletData);

    // Update project with wallet reference (if field exists)
    // Note: You may need to add walletId field to Project model
    // projectDoc.walletId = wallet._id;
    // await projectDoc.save();

    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

/**
 * Handle deposit webhook from escrow provider
 * Updates wallet balance when deposit is received
 * @param {Object} payload - Webhook payload from provider
 * @returns {Promise<Object>} Updated wallet and transaction details
 */
const depositWebhook = async (payload) => {
  try {
    // Extract data from webhook payload
    // Format depends on provider (Castler, Razorpay, etc.)
    const {
      projectId,
      walletId,
      amount,
      transactionId,
      status,
      currency = 'INR',
      metadata = {},
    } = payload;

    // Find wallet by projectId or walletId
    let wallet;
    if (walletId) {
      wallet = await Wallet.findById(walletId);
    } else if (projectId) {
      wallet = await Wallet.findOne({ projectId });
    } else {
      throw new Error('walletId or projectId required in webhook payload');
    }

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Validate webhook (verify signature if provider supports it)
    // This is a placeholder - implement actual verification based on provider
    if (process.env.ESCROW_PROVIDER === 'castler') {
      // Verify Castler webhook signature
      // const isValid = verifyCastlerSignature(payload, headers);
      // if (!isValid) throw new Error('Invalid webhook signature');
    }

    // Only process successful deposits
    if (status !== 'success' && status !== 'completed' && status !== 'credited') {
      return {
        success: false,
        message: `Deposit not processed - status: ${status}`,
        wallet,
      };
    }

    // Add deposit to wallet
    await wallet.addDeposit(amount, transactionId);

    return {
      success: true,
      message: 'Deposit processed successfully',
      wallet,
      amount,
      transactionId,
    };
  } catch (error) {
    console.error('Error processing deposit webhook:', error);
    throw error;
  }
};

/**
 * Get wallet balance for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} Wallet balance and details
 */
const getBalance = async (projectId) => {
  try {
    const wallet = await Wallet.findOne({ projectId })
      .populate('projectId', 'name client status')
      .populate('quoteId', 'quoteAmount qid');

    if (!wallet) {
      // Return zero balance if wallet doesn't exist yet
      return {
        balance: 0,
        currency: 'INR',
        status: 'not_created',
        projectId,
        exists: false,
      };
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
      projectId: wallet.projectId._id,
      projectName: wallet.projectId?.name,
      quoteAmount: wallet.quoteId?.quoteAmount || 0,
      metadata: wallet.metadata,
      exists: true,
      walletId: wallet._id,
    };
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

/**
 * Get wallet by project ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Wallet>} Wallet document
 */
const getWalletByProject = async (projectId) => {
  try {
    const wallet = await Wallet.findOne({ projectId })
      .populate('projectId')
      .populate('quoteId');

    return wallet;
  } catch (error) {
    console.error('Error getting wallet:', error);
    throw error;
  }
};

/**
 * Update wallet balance (manual adjustment - admin only)
 * @param {String} walletId - Wallet ID
 * @param {Number} amount - Amount to add (positive) or subtract (negative)
 * @param {String} reason - Reason for adjustment
 * @returns {Promise<Wallet>} Updated wallet
 */
const adjustBalance = async (walletId, amount, reason = 'Manual adjustment') => {
  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (amount > 0) {
      await wallet.addDeposit(amount);
    } else if (amount < 0) {
      await wallet.addWithdrawal(Math.abs(amount));
    }

    return wallet;
  } catch (error) {
    console.error('Error adjusting balance:', error);
    throw error;
  }
};

module.exports = {
  createWallet,
  depositWebhook,
  getBalance,
  getWalletByProject,
  adjustBalance,
};

