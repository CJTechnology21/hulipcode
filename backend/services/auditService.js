/**
 * Audit Service
 * Centralized service for creating audit log entries
 */

const AuditLog = require('../models/AuditLog');
const { encryptEmail } = require('../utils/encryption');
const User = require('../models/User');

/**
 * Create an audit log entry
 * @param {Object} logData - Audit log data
 * @param {string} logData.eventType - Type of event
 * @param {string|ObjectId} logData.actorId - User ID who performed the action
 * @param {string} logData.action - Action description
 * @param {string} logData.targetType - Type of target (CONTRACT, PROJECT, etc.)
 * @param {string|ObjectId} logData.targetId - Target ID
 * @param {Object} logData.metadata - Additional metadata
 * @param {Object} logData.req - Express request object (optional, for IP/userAgent)
 * @returns {Promise<Object>} Created audit log
 */
const createAuditLog = async (logData) => {
  try {
    const {
      eventType,
      actorId,
      action,
      targetType,
      targetId,
      description,
      amount,
      currency = 'INR',
      metadata = {},
      status = 'SUCCESS',
      req = null,
    } = logData;

    // Validate required fields
    if (!eventType || !actorId || !action) {
      throw new Error('Missing required audit log fields: eventType, actorId, action');
    }

    // Get actor information
    let actorRole = 'unknown';
    let actorEmail = null;
    
    try {
      const actor = await User.findById(actorId).select('role email');
      if (actor) {
        actorRole = actor.role || 'unknown';
        actorEmail = actor.email ? encryptEmail(actor.email) : null;
      }
    } catch (error) {
      console.warn('Could not fetch actor info for audit log:', error.message);
    }

    // Extract IP and user agent from request
    let ipAddress = null;
    let userAgent = null;
    
    if (req) {
      ipAddress = req.ip || req.connection?.remoteAddress || req.headers?.['x-forwarded-for']?.split(',')[0] || null;
      userAgent = req.headers?.['user-agent'] || null;
    }

    // Create audit log entry
    const auditLogData = {
      eventType,
      actorId,
      actorRole,
      actorEmail,
      targetType: targetType || null,
      targetId: targetId || null,
      action,
      description: description || action,
      amount: amount || null,
      currency,
      metadata,
      status,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    };

    const auditLog = await AuditLog.create(auditLogData);

    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main flow
    // But log the error for investigation
    return null;
  }
};

/**
 * Log contract signing event
 * @param {Object} params - Contract signing parameters
 * @param {string|ObjectId} params.contractId - Contract ID
 * @param {string|ObjectId} params.actorId - User ID who signed
 * @param {string} params.signerType - 'client' or 'professional'
 * @param {Object} params.metadata - Additional metadata
 * @param {Object} params.req - Express request object (optional)
 * @returns {Promise<Object>} Created audit log
 */
const logContractSigning = async ({ contractId, actorId, signerType, metadata = {}, req = null }) => {
  return createAuditLog({
    eventType: 'CONTRACT_SIGNED',
    actorId,
    action: `Contract signed by ${signerType}`,
    description: `Contract ${contractId} signed by ${signerType}`,
    targetType: 'CONTRACT',
    targetId: contractId,
    metadata: {
      signerType,
      ...metadata,
    },
    req,
  });
};

/**
 * Log payout release event
 * @param {Object} params - Payout release parameters
 * @param {string|ObjectId} params.projectId - Project ID
 * @param {string|ObjectId} params.actorId - User ID who released payout
 * @param {number} params.amount - Payout amount
 * @param {Object} params.metadata - Additional metadata (transactionId, breakdown, etc.)
 * @param {Object} params.req - Express request object (optional)
 * @returns {Promise<Object>} Created audit log
 */
const logPayoutRelease = async ({ projectId, actorId, amount, currency = 'INR', metadata = {}, req = null }) => {
  return createAuditLog({
    eventType: 'PAYOUT_RELEASED',
    actorId,
    action: 'Payout released',
    description: `Payout of ${amount} ${currency} released for project ${projectId}`,
    targetType: 'PROJECT',
    targetId: projectId,
    amount,
    currency,
    metadata: {
      ...metadata,
    },
    req,
  });
};

/**
 * Log contract rejection event
 * @param {Object} params - Contract rejection parameters
 * @param {string|ObjectId} params.contractId - Contract ID
 * @param {string|ObjectId} params.actorId - User ID who rejected
 * @param {Object} params.metadata - Additional metadata
 * @param {Object} params.req - Express request object (optional)
 * @returns {Promise<Object>} Created audit log
 */
const logContractRejection = async ({ contractId, actorId, metadata = {}, req = null }) => {
  return createAuditLog({
    eventType: 'CONTRACT_REJECTED',
    actorId,
    action: 'Contract rejected',
    description: `Contract ${contractId} was rejected`,
    targetType: 'CONTRACT',
    targetId: contractId,
    metadata,
    req,
  });
};

/**
 * Log payout cancellation event
 * @param {Object} params - Payout cancellation parameters
 * @param {string|ObjectId} params.projectId - Project ID
 * @param {string|ObjectId} params.actorId - User ID who cancelled
 * @param {Object} params.metadata - Additional metadata
 * @param {Object} params.req - Express request object (optional)
 * @returns {Promise<Object>} Created audit log
 */
const logPayoutCancellation = async ({ projectId, actorId, metadata = {}, req = null }) => {
  return createAuditLog({
    eventType: 'PAYOUT_CANCELLED',
    actorId,
    action: 'Payout cancelled',
    description: `Payout cancelled for project ${projectId}`,
    targetType: 'PROJECT',
    targetId: projectId,
    metadata,
    req,
  });
};

module.exports = {
  createAuditLog,
  logContractSigning,
  logContractRejection,
  logPayoutRelease,
  logPayoutCancellation,
};

