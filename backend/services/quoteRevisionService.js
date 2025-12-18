/**
 * Quote Revision Service
 * Handles quote revision logic including top-up and under-payment checks
 */

const Quote = require('../models/Quote');
const Project = require('../models/Project');
const { getTotalPaid } = require('./ledgerService');

/**
 * Calculate quote total amount from summary
 * @param {Object} quote - Quote document
 * @returns {number} Total quote amount
 */
const calculateQuoteTotal = (quote) => {
  if (!quote.summary || quote.summary.length === 0) {
    return quote.quoteAmount || 0;
  }

  // Calculate from summary entries
  const total = quote.summary.reduce((sum, item) => {
    const itemTotal = item.amount || 0;
    const itemTax = item.tax || 0;
    return sum + itemTotal + itemTax;
  }, 0);

  return Math.round(total * 100) / 100;
};

/**
 * Get original quote (non-revision)
 * @param {string} quoteId - Quote ID (can be revision or original)
 * @returns {Promise<Object>} Original quote
 */
const getOriginalQuote = async (quoteId) => {
  const quote = await Quote.findById(quoteId);
  if (!quote) {
    throw new Error('Quote not found');
  }

  // If this is already the original quote
  if (!quote.parent_quote_id) {
    return quote;
  }

  // Find the original quote
  let originalQuote = quote;
  while (originalQuote.parent_quote_id) {
    originalQuote = await Quote.findById(originalQuote.parent_quote_id);
    if (!originalQuote) {
      throw new Error('Original quote not found');
    }
  }

  return originalQuote;
};

/**
 * Get all revisions of a quote
 * @param {string} originalQuoteId - Original quote ID
 * @returns {Promise<Array>} Array of revision quotes
 */
const getQuoteRevisions = async (originalQuoteId) => {
  const revisions = await Quote.find({
    parent_quote_id: originalQuoteId,
  }).sort({ revisionNumber: 1 });

  return revisions;
};

/**
 * Get latest revision of a quote
 * @param {string} originalQuoteId - Original quote ID
 * @returns {Promise<Object>} Latest revision quote
 */
const getLatestRevision = async (originalQuoteId) => {
  const revisions = await getQuoteRevisions(originalQuoteId);
  if (revisions.length === 0) {
    return null;
  }
  return revisions[revisions.length - 1];
};

/**
 * Check if revision requires top-up (revised total > original)
 * @param {Object} originalQuote - Original quote
 * @param {Object} revisedQuote - Revised quote
 * @returns {Object} Top-up check result
 */
const checkTopUpRequired = (originalQuote, revisedQuote) => {
  const originalTotal = calculateQuoteTotal(originalQuote);
  const revisedTotal = calculateQuoteTotal(revisedQuote);

  const requiresTopUp = revisedTotal > originalTotal;
  const topUpAmount = requiresTopUp ? Math.round((revisedTotal - originalTotal) * 100) / 100 : 0;

  return {
    requiresTopUp,
    originalTotal,
    revisedTotal,
    topUpAmount,
    difference: Math.round((revisedTotal - originalTotal) * 100) / 100,
  };
};

/**
 * Check if revision has under-payment (revised total < previous payouts)
 * @param {string} projectId - Project ID
 * @param {Object} revisedQuote - Revised quote
 * @returns {Promise<Object>} Under-payment check result
 */
const checkUnderPayment = async (projectId, revisedQuote) => {
  try {
    // Get total paid from ledger entries
    const totalPaid = await getTotalPaid(projectId);
    const revisedTotal = calculateQuoteTotal(revisedQuote);

    const requiresAdminReview = revisedTotal < totalPaid;
    const shortfallAmount = requiresAdminReview
      ? Math.round((totalPaid - revisedTotal) * 100) / 100
      : 0;

    return {
      requiresAdminReview,
      revisedTotal,
      totalPaid,
      shortfallAmount,
      difference: Math.round((revisedTotal - totalPaid) * 100) / 100,
    };
  } catch (error) {
    // If project doesn't exist or no payouts yet, no under-payment
    return {
      requiresAdminReview: false,
      revisedTotal: calculateQuoteTotal(revisedQuote),
      totalPaid: 0,
      shortfallAmount: 0,
      difference: calculateQuoteTotal(revisedQuote),
    };
  }
};

/**
 * Check if contract signing should be blocked
 * @param {Object} quote - Quote to check
 * @returns {Promise<Object>} Block check result
 */
const checkContractSigningBlock = async (quote) => {
  try {
    // Only check revisions
    if (!quote.isRevision || !quote.parent_quote_id) {
      return {
        blocked: false,
        reason: null,
        canSign: true,
      };
    }

    // Get original quote
    const originalQuote = await getOriginalQuote(quote._id);

    // Check top-up requirement
    const topUpCheck = checkTopUpRequired(originalQuote, quote);

    if (topUpCheck.requiresTopUp) {
      return {
        blocked: true,
        reason: 'TOP_UP_REQUIRED',
        canSign: false,
        message: `Revision requires top-up of ₹${topUpCheck.topUpAmount.toLocaleString()}. Original: ₹${topUpCheck.originalTotal.toLocaleString()}, Revised: ₹${topUpCheck.revisedTotal.toLocaleString()}`,
        topUpAmount: topUpCheck.topUpAmount,
        originalTotal: topUpCheck.originalTotal,
        revisedTotal: topUpCheck.revisedTotal,
      };
    }

    // Check if project exists and has payouts
    const project = await Project.findOne({ quoteId: originalQuote._id });
    if (project) {
      const underPaymentCheck = await checkUnderPayment(project._id, quote);
      if (underPaymentCheck.requiresAdminReview) {
        return {
          blocked: true,
          reason: 'ADMIN_REVIEW_REQUIRED',
          canSign: false,
          message: `Revision requires admin review. Revised total (₹${underPaymentCheck.revisedTotal.toLocaleString()}) is less than previous payouts (₹${underPaymentCheck.totalPaid.toLocaleString()})`,
          shortfallAmount: underPaymentCheck.shortfallAmount,
          revisedTotal: underPaymentCheck.revisedTotal,
          totalPaid: underPaymentCheck.totalPaid,
        };
      }
    }

    return {
      blocked: false,
      reason: null,
      canSign: true,
    };
  } catch (error) {
    console.error('Error checking contract signing block:', error);
    // On error, allow signing (fail open)
    return {
      blocked: false,
      reason: 'ERROR',
      canSign: true,
      error: error.message,
    };
  }
};

/**
 * Create a revision of a quote
 * @param {string} originalQuoteId - Original quote ID
 * @param {Object} revisionData - Revision data
 * @returns {Promise<Object>} Created revision quote
 */
const createRevision = async (originalQuoteId, revisionData) => {
  try {
    // Get original quote
    const originalQuote = await getOriginalQuote(originalQuoteId);
    if (!originalQuote) {
      throw new Error('Original quote not found');
    }

    // Get latest revision number
    const revisions = await getQuoteRevisions(originalQuoteId);
    const nextRevisionNumber = revisions.length + 1;

    // Calculate totals
    const originalTotal = calculateQuoteTotal(originalQuote);
    const revisedTotal = calculateQuoteTotal({
      ...revisionData,
      summary: revisionData.summary || [],
    });

    // Check top-up requirement
    const topUpCheck = checkTopUpRequired(originalQuote, {
      ...revisionData,
      summary: revisionData.summary || [],
    });

    // Check under-payment (if project exists)
    let underPaymentCheck = {
      requiresAdminReview: false,
      totalPaid: 0,
    };
    const project = await Project.findOne({ quoteId: originalQuote._id });
    if (project) {
      underPaymentCheck = await checkUnderPayment(project._id, {
        ...revisionData,
        summary: revisionData.summary || [],
      });
    }

    // Create revision quote
    const revisionQuote = new Quote({
      ...revisionData,
      leadId: originalQuote.leadId,
      parent_quote_id: originalQuote._id,
      isRevision: true,
      revisionNumber: nextRevisionNumber,
      requiresTopUp: topUpCheck.requiresTopUp,
      requiresAdminReview: underPaymentCheck.requiresAdminReview,
      status: 'Send', // New revisions start as "Send"
      quoteAmount: revisedTotal,
    });

    await revisionQuote.save();

    return {
      revision: revisionQuote,
      originalQuote,
      topUpCheck,
      underPaymentCheck,
      canSignContract: !topUpCheck.requiresTopUp && !underPaymentCheck.requiresAdminReview,
    };
  } catch (error) {
    console.error('Error creating revision:', error);
    throw error;
  }
};

module.exports = {
  calculateQuoteTotal,
  getOriginalQuote,
  getQuoteRevisions,
  getLatestRevision,
  checkTopUpRequired,
  checkUnderPayment,
  checkContractSigningBlock,
  createRevision,
};

