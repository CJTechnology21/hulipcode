/**
 * Ledger Service
 * Manages ledger entries for financial tracking
 * Handles credits, debits, payables, fees, withheld amounts, and penalties
 */

const mongoose = require('mongoose');
const LedgerEntry = require('../models/LedgerEntry');
const Task = require('../models/Tasks');
const Project = require('../models/Project');

/**
 * Create a credit entry in the ledger
 * @param {Object} params - Credit entry parameters
 * @param {string} params.projectId - Project ID
 * @param {string} params.taskId - Task ID (optional)
 * @param {string} params.category - Entry category
 * @param {number} params.amount - Credit amount
 * @param {string} params.description - Description of the credit
 * @param {Object} params.metadata - Additional metadata
 * @param {string} params.createdBy - User ID who created the entry
 * @returns {Promise<Object>} Created ledger entry
 */
const createCredit = async ({
  projectId,
  taskId = null,
  category,
  amount,
  description,
  metadata = {},
  createdBy = null,
  referenceId = null,
  referenceType = 'OTHER',
}) => {
  try {
    if (!projectId || !category || !amount || !description) {
      throw new Error('Missing required fields: projectId, category, amount, description');
    }

    if (amount <= 0) {
      throw new Error('Credit amount must be greater than 0');
    }

    const creditEntry = await LedgerEntry.create({
      projectId,
      taskId,
      entryType: 'CREDIT',
      category,
      amount,
      description,
      metadata,
      createdBy,
      referenceId,
      referenceType,
      status: 'PROCESSED',
      processedAt: new Date(),
    });

    return creditEntry;
  } catch (error) {
    console.error('Error creating credit entry:', error);
    throw error;
  }
};

/**
 * Create a debit entry in the ledger
 * @param {Object} params - Debit entry parameters
 * @param {string} params.projectId - Project ID
 * @param {string} params.taskId - Task ID (optional)
 * @param {string} params.category - Entry category
 * @param {number} params.amount - Debit amount
 * @param {string} params.description - Description of the debit
 * @param {Object} params.metadata - Additional metadata
 * @param {string} params.createdBy - User ID who created the entry
 * @returns {Promise<Object>} Created ledger entry
 */
const createDebit = async ({
  projectId,
  taskId = null,
  category,
  amount,
  description,
  metadata = {},
  createdBy = null,
  referenceId = null,
  referenceType = 'OTHER',
}) => {
  try {
    if (!projectId || !category || !amount || !description) {
      throw new Error('Missing required fields: projectId, category, amount, description');
    }

    if (amount <= 0) {
      throw new Error('Debit amount must be greater than 0');
    }

    const debitEntry = await LedgerEntry.create({
      projectId,
      taskId,
      entryType: 'DEBIT',
      category,
      amount,
      description,
      metadata,
      createdBy,
      referenceId,
      referenceType,
      status: 'PROCESSED',
      processedAt: new Date(),
    });

    return debitEntry;
  } catch (error) {
    console.error('Error creating debit entry:', error);
    throw error;
  }
};

/**
 * Compute payable amount based on progress and previous payments
 * Formula: Payable = (Progress * ProjectTotal) - PreviousPaid
 * @param {number} progress - Current project progress (0-100)
 * @param {number} previousPaid - Total amount previously paid
 * @param {number} projectTotal - Total project value
 * @returns {Object} Payable calculation breakdown
 */
const computePayable = (progress, previousPaid, projectTotal) => {
  try {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    if (previousPaid < 0) {
      throw new Error('Previous paid amount cannot be negative');
    }

    if (projectTotal <= 0) {
      throw new Error('Project total must be greater than 0');
    }

    // Calculate earned amount based on progress
    const earnedAmount = (progress / 100) * projectTotal;
    
    // Calculate payable amount (what's due now)
    const payableAmount = Math.max(0, earnedAmount - previousPaid);

    return {
      progress,
      projectTotal,
      earnedAmount: Math.round(earnedAmount * 100) / 100,
      previousPaid,
      payableAmount: Math.round(payableAmount * 100) / 100,
      breakdown: {
        progressPercent: progress,
        earnedAmount,
        previousPaid,
        payableAmount,
      },
    };
  } catch (error) {
    console.error('Error computing payable:', error);
    throw error;
  }
};

/**
 * Calculate platform fee (4% of gross amount)
 * @param {number} grossAmount - Gross amount before fees
 * @returns {Object} Fee calculation
 */
const calculatePlatformFee = (grossAmount) => {
  const PLATFORM_FEE_PERCENT = 4; // 4%
  const feeAmount = (grossAmount * PLATFORM_FEE_PERCENT) / 100;

  return {
    feePercent: PLATFORM_FEE_PERCENT,
    grossAmount,
    feeAmount: Math.round(feeAmount * 100) / 100,
    netAfterFee: Math.round((grossAmount - feeAmount) * 100) / 100,
  };
};

/**
 * Calculate withheld amount (15% of net amount after platform fee)
 * @param {number} netAmount - Net amount after platform fee
 * @returns {Object} Withheld calculation
 */
const calculateWithheld = (netAmount) => {
  const WITHHELD_PERCENT = 15; // 15%
  const withheldAmount = (netAmount * WITHHELD_PERCENT) / 100;

  return {
    withheldPercent: WITHHELD_PERCENT,
    netAmount,
    withheldAmount: Math.round(withheldAmount * 100) / 100,
    payableAfterWithheld: Math.round((netAmount - withheldAmount) * 100) / 100,
  };
};

/**
 * Calculate penalty (simple placeholder - can be enhanced later)
 * @param {number} baseAmount - Base amount for penalty calculation
 * @param {string} reason - Reason for penalty (optional)
 * @param {number} penaltyPercent - Penalty percentage (default: 0)
 * @returns {Object} Penalty calculation
 */
const calculatePenalty = (baseAmount, reason = '', penaltyPercent = 0) => {
  const penaltyAmount = (baseAmount * penaltyPercent) / 100;

  return {
    penaltyPercent,
    baseAmount,
    penaltyAmount: Math.round(penaltyAmount * 100) / 100,
    reason,
    netAfterPenalty: Math.round((baseAmount - penaltyAmount) * 100) / 100,
  };
};

/**
 * Calculate complete payout breakdown with fees, withheld, and penalties
 * @param {Object} params - Payout calculation parameters
 * @param {number} params.grossAmount - Gross payout amount
 * @param {number} params.progress - Current progress
 * @param {number} params.previousPaid - Previously paid amount
 * @param {number} params.projectTotal - Total project value
 * @param {number} params.penaltyPercent - Penalty percentage (default: 0)
 * @param {string} params.penaltyReason - Reason for penalty (optional)
 * @returns {Object} Complete payout breakdown
 */
const calculatePayoutBreakdown = async ({
  grossAmount,
  progress,
  previousPaid,
  projectTotal,
  penaltyPercent = 0,
  penaltyReason = '',
}) => {
  try {
    // Step 1: Calculate payable amount
    const payable = computePayable(progress, previousPaid, projectTotal);

    // Step 2: Calculate platform fee (4%)
    const platformFee = calculatePlatformFee(grossAmount);

    // Step 3: Calculate withheld (15% of net after fee)
    const withheld = calculateWithheld(platformFee.netAfterFee);

    // Step 4: Calculate penalty (if any)
    const penalty = calculatePenalty(
      withheld.payableAfterWithheld,
      penaltyReason,
      penaltyPercent
    );

    // Step 5: Calculate final payable amount
    const finalPayable = penalty.netAfterPenalty;

    return {
      grossAmount: Math.round(grossAmount * 100) / 100,
      payable,
      platformFee,
      withheld,
      penalty,
      deductions: {
        platformFee: platformFee.feeAmount,
        withheld: withheld.withheldAmount,
        penalty: penalty.penaltyAmount,
        total: Math.round((platformFee.feeAmount + withheld.withheldAmount + penalty.penaltyAmount) * 100) / 100,
      },
      finalPayable: Math.round(finalPayable * 100) / 100,
      breakdown: {
        grossAmount,
        minusPlatformFee: platformFee.netAfterFee,
        minusWithheld: withheld.payableAfterWithheld,
        minusPenalty: penalty.netAfterPenalty,
        finalPayable,
      },
    };
  } catch (error) {
    console.error('Error calculating payout breakdown:', error);
    throw error;
  }
};

/**
 * Get ledger entries for a project
 * @param {string} projectId - Project ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of ledger entries
 */
const getLedgerEntries = async (projectId, filters = {}) => {
  try {
    const query = { projectId, ...filters };
    const entries = await LedgerEntry.find(query)
      .populate('taskId', 'name value')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return entries;
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    throw error;
  }
};

/**
 * Get total paid amount for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<number>} Total paid amount
 */
const getTotalPaid = async (projectId) => {
  try {
    // Use simple find and reduce for compatibility
    const entries = await LedgerEntry.find({
      projectId,
      entryType: 'CREDIT',
      category: 'TASK_PAYOUT',
      status: 'PROCESSED',
    });

    return entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  } catch (error) {
    console.error('Error calculating total paid:', error);
    return 0;
  }
};

module.exports = {
  createCredit,
  createDebit,
  computePayable,
  calculatePlatformFee,
  calculateWithheld,
  calculatePenalty,
  calculatePayoutBreakdown,
  getLedgerEntries,
  getTotalPaid,
};

