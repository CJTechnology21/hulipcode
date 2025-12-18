/**
 * Admin Controller
 * Handles admin-only operations: KYC approval, dispute management, wallet adjustments
 */

const User = require('../models/User');
const Dispute = require('../models/Dispute');
const Wallet = require('../models/Wallet');
const Project = require('../models/Project');
const { adjustBalance } = require('../services/walletService');
const { createAuditLog } = require('../services/auditService');

/**
 * Get users pending KYC approval
 * GET /api/admin/kyc/pending
 */
const getPendingKYC = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (page - 1) * limit;

    // Build query for users with KYC documents but not approved
    const query = {
      $or: [
        { aadhaarFile: { $exists: true, $ne: null } },
        { panFile: { $exists: true, $ne: null } },
      ],
      kycStatus: { $ne: 'APPROVED' },
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('name email role phoneNumber aadhaarFile panFile kycStatus kycApprovedAt kycRejectedReason createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching pending KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending KYC',
      error: error.message,
    });
  }
};

/**
 * Approve KYC for a user
 * POST /api/admin/kyc/:userId/approve
 */
const approveKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has KYC documents
    if (!user.aadhaarFile && !user.panFile) {
      return res.status(400).json({
        success: false,
        message: 'User has no KYC documents to approve',
      });
    }

    // Update user KYC status
    user.kycStatus = 'APPROVED';
    user.kycApprovedAt = new Date();
    user.kycApprovedBy = req.user._id;
    if (notes) {
      user.kycNotes = notes;
    }
    await user.save();

    // Create audit log
    await createAuditLog({
      eventType: 'ADMIN_ACTION',
      actorId: req.user._id,
      action: 'KYC Approved',
      description: `KYC approved for user ${user.name} (${user.email})`,
      targetType: 'USER',
      targetId: user._id,
      metadata: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        notes,
      },
      req,
    });

    res.json({
      success: true,
      message: 'KYC approved successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          kycStatus: user.kycStatus,
          kycApprovedAt: user.kycApprovedAt,
        },
      },
    });
  } catch (error) {
    console.error('Error approving KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving KYC',
      error: error.message,
    });
  }
};

/**
 * Reject KYC for a user
 * POST /api/admin/kyc/:userId/reject
 */
const rejectKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user KYC status
    user.kycStatus = 'REJECTED';
    user.kycRejectedAt = new Date();
    user.kycRejectedBy = req.user._id;
    user.kycRejectedReason = reason;
    await user.save();

    // Create audit log
    await createAuditLog({
      eventType: 'ADMIN_ACTION',
      actorId: req.user._id,
      action: 'KYC Rejected',
      description: `KYC rejected for user ${user.name} (${user.email})`,
      targetType: 'USER',
      targetId: user._id,
      metadata: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        reason,
      },
      req,
    });

    res.json({
      success: true,
      message: 'KYC rejected successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          kycStatus: user.kycStatus,
          kycRejectedAt: user.kycRejectedAt,
          kycRejectedReason: user.kycRejectedReason,
        },
      },
    });
  } catch (error) {
    console.error('Error rejecting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting KYC',
      error: error.message,
    });
  }
};

/**
 * Get disputes list
 * GET /api/admin/disputes
 */
const getDisputes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      projectId,
      priority,
    } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (projectId) query.projectId = projectId;
    if (priority) query.priority = priority;

    const disputes = await Dispute.find(query)
      .populate('projectId', 'name client')
      .populate('taskId', 'name')
      .populate('raisedBy', 'name email role')
      .populate('against', 'name email role')
      .populate('resolvedBy', 'name email')
      .sort({ raisedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Dispute.countDocuments(query);

    res.json({
      success: true,
      data: {
        disputes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching disputes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching disputes',
      error: error.message,
    });
  }
};

/**
 * Get dispute details
 * GET /api/admin/disputes/:disputeId
 */
const getDisputeDetails = async (req, res) => {
  try {
    const { disputeId } = req.params;

    const dispute = await Dispute.findById(disputeId)
      .populate('projectId', 'name client architectId')
      .populate('taskId', 'name value status')
      .populate('raisedBy', 'name email role phoneNumber')
      .populate('against', 'name email role phoneNumber')
      .populate('resolvedBy', 'name email')
      .populate('evidence.uploadedBy', 'name email');

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    res.json({
      success: true,
      data: { dispute },
    });
  } catch (error) {
    console.error('Error fetching dispute details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dispute details',
      error: error.message,
    });
  }
};

/**
 * Resolve dispute
 * POST /api/admin/disputes/:disputeId/resolve
 */
const resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolution, resolutionAction } = req.body;

    if (!resolution || !resolutionAction) {
      return res.status(400).json({
        success: false,
        message: 'Resolution and resolutionAction are required',
      });
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    if (dispute.status === 'RESOLVED' || dispute.status === 'CLOSED') {
      return res.status(400).json({
        success: false,
        message: 'Dispute is already resolved or closed',
      });
    }

    // Mark dispute as resolved
    await dispute.markResolved(req.user._id, resolution, resolutionAction);

    // Populate for response
    await dispute.populate('projectId', 'name');
    await dispute.populate('resolvedBy', 'name email');

    // Create audit log
    await createAuditLog({
      eventType: 'ADMIN_ACTION',
      actorId: req.user._id,
      action: 'Dispute Resolved',
      description: `Dispute resolved: ${dispute.title}`,
      targetType: 'OTHER',
      targetId: dispute._id,
      metadata: {
        disputeId: dispute._id,
        resolution,
        resolutionAction,
        projectId: dispute.projectId,
      },
      req,
    });

    res.json({
      success: true,
      message: 'Dispute resolved successfully',
      data: { dispute },
    });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving dispute',
      error: error.message,
    });
  }
};

/**
 * Get wallets for adjustment
 * GET /api/admin/wallets
 */
const getWallets = async (req, res) => {
  try {
    const { page = 1, limit = 20, projectId, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;

    const wallets = await Wallet.find(query)
      .populate('projectId', 'name client architectId')
      .populate('quoteId', 'qid quoteAmount')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Wallet.countDocuments(query);

    res.json({
      success: true,
      data: {
        wallets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wallets',
      error: error.message,
    });
  }
};

/**
 * Adjust wallet balance
 * PATCH /api/admin/wallets/:walletId/adjust
 */
const adjustWalletBalance = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must not be zero',
      });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required for wallet adjustment',
      });
    }

    const wallet = await Wallet.findById(walletId).populate('projectId', 'name');
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    const balanceBefore = wallet.balance;

    // Adjust balance
    await adjustBalance(walletId, amount, reason);

    // Reload wallet to get updated balance
    const updatedWallet = await Wallet.findById(walletId)
      .populate('projectId', 'name')
      .populate('quoteId', 'qid');

    // Create audit log
    await createAuditLog({
      eventType: 'ADMIN_ACTION',
      actorId: req.user._id,
      action: 'Wallet Balance Adjusted',
      description: `Wallet balance adjusted by ${amount > 0 ? '+' : ''}${amount}`,
      targetType: 'WALLET',
      targetId: wallet._id,
      amount: Math.abs(amount),
      currency: wallet.currency || 'INR',
      metadata: {
        walletId: wallet._id,
        projectId: wallet.projectId,
        balanceBefore,
        balanceAfter: updatedWallet.balance,
        amount,
        reason,
      },
      req,
    });

    res.json({
      success: true,
      message: 'Wallet balance adjusted successfully',
      data: {
        wallet: updatedWallet,
        adjustment: {
          amount,
          balanceBefore,
          balanceAfter: updatedWallet.balance,
          reason,
        },
      },
    });
  } catch (error) {
    console.error('Error adjusting wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error adjusting wallet balance',
      error: error.message,
    });
  }
};

module.exports = {
  getPendingKYC,
  approveKYC,
  rejectKYC,
  getDisputes,
  getDisputeDetails,
  resolveDispute,
  getWallets,
  adjustWalletBalance,
};

