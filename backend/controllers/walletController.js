const {
  createWallet,
  depositWebhook,
  getBalance,
  getWalletByProject,
  adjustBalance,
} = require('../services/walletService');
const Project = require('../models/Project');
const Wallet = require('../models/Wallet');

/**
 * Create wallet for a project
 * POST /api/wallet
 */
const createWalletForProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Check if project exists first
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const wallet = await createWallet(projectId);

    res.status(201).json({
      message: 'Wallet created successfully',
      wallet,
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    
    // Provide more specific error messages
    let statusCode = 500;
    let message = 'Error creating wallet';
    
    if (error.message === 'Project not found') {
      statusCode = 404;
      message = error.message;
    } else if (error.message.includes('duplicate') || error.message.includes('E11000')) {
      statusCode = 409;
      message = 'Wallet already exists for this project';
    } else {
      message = error.message || 'Error creating wallet';
    }

    res.status(statusCode).json({
      message,
      error: error.message,
    });
  }
};

/**
 * Get wallet balance for a project
 * GET /api/wallet/balance/:projectId
 */
const getWalletBalance = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const balanceData = await getBalance(projectId);

    res.status(200).json(balanceData);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({
      message: 'Error getting wallet balance',
      error: error.message,
    });
  }
};

/**
 * Get wallet details for a project
 * GET /api/wallet/project/:projectId
 */
const getWalletByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const wallet = await getWalletByProject(projectId);

    if (!wallet) {
      return res.status(404).json({
        message: 'Wallet not found for this project',
        exists: false,
      });
    }

    res.status(200).json({
      wallet,
      exists: true,
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({
      message: 'Error getting wallet',
      error: error.message,
    });
  }
};

/**
 * Handle deposit webhook from escrow provider
 * POST /api/wallet/webhook/deposit
 */
const handleDepositWebhook = async (req, res) => {
  try {
    // Log webhook for debugging
    console.log('📥 Deposit webhook received:', {
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString(),
    });

    // Process webhook
    const result = await depositWebhook(req.body);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: result.message || 'Webhook received but not processed',
        data: result,
      });
    }
  } catch (error) {
    console.error('Error processing deposit webhook:', error);
    // Return 200 to prevent webhook retries for invalid requests
    // But log the error for investigation
    res.status(200).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message,
    });
  }
};

/**
 * Adjust wallet balance (admin only)
 * PATCH /api/wallet/:walletId/adjust
 */
const adjustWalletBalance = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Check if user is admin (you may want to add admin check middleware)
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Admin access required' });
    // }

    const wallet = await adjustBalance(walletId, amount, reason);

    res.status(200).json({
      message: 'Balance adjusted successfully',
      wallet,
    });
  } catch (error) {
    console.error('Error adjusting balance:', error);
    res.status(500).json({
      message: 'Error adjusting balance',
      error: error.message,
    });
  }
};

/**
 * Get all wallets (admin only)
 * GET /api/wallet
 */
const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find()
      .populate('projectId', 'name client status')
      .populate('quoteId', 'quoteAmount qid')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: wallets.length,
      wallets,
    });
  } catch (error) {
    console.error('Error getting wallets:', error);
    res.status(500).json({
      message: 'Error getting wallets',
      error: error.message,
    });
  }
};

module.exports = {
  createWalletForProject,
  getWalletBalance,
  getWalletByProjectId,
  handleDepositWebhook,
  adjustWalletBalance,
  getAllWallets,
};

