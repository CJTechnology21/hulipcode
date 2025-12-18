const mongoose = require('mongoose');

/**
 * AuditLog Model
 * Tracks all security-sensitive operations for compliance and auditing
 */
const auditLogSchema = new mongoose.Schema(
  {
    // Event information
    eventType: {
      type: String,
      required: true,
      enum: [
        'CONTRACT_SIGNED',
        'CONTRACT_REJECTED',
        'PAYOUT_RELEASED',
        'PAYOUT_CANCELLED',
        'WALLET_DEPOSIT',
        'WALLET_WITHDRAWAL',
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
        'QUOTE_CREATED',
        'QUOTE_REVISED',
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'TASK_APPROVED',
        'TASK_REJECTED',
        'LEDGER_ENTRY_CREATED',
        'LEDGER_ENTRY_MODIFIED',
        'ADMIN_ACTION',
        'SECURITY_EVENT',
        'OTHER',
      ],
      index: true,
    },
    
    // Actor information (who performed the action)
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    actorEmail: {
      type: String,
      // Encrypted email for PII protection
    },
    
    // Target information (what was affected)
    targetType: {
      type: String,
      enum: [
        'CONTRACT',
        'PROJECT',
        'QUOTE',
        'WALLET',
        'LEDGER',
        'TASK',
        'USER',
        'PAYOUT',
        'OTHER',
      ],
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference Contract, Project, Quote, Wallet, etc.
      index: true,
    },
    
    // Action details
    action: {
      type: String,
      required: true,
      // Human-readable action description
    },
    description: {
      type: String,
      // Detailed description of what happened
    },
    
    // Financial information (for payout events)
    amount: {
      type: Number,
      // Amount involved in financial transactions
    },
    currency: {
      type: String,
      default: 'INR',
    },
    
    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      // Additional context-specific data
      // Examples:
      // - Contract: { documentId, signers, version }
      // - Payout: { transactionId, breakdown, fees }
      // - Login: { ipAddress, userAgent }
    },
    
    // Status
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING', 'CANCELLED'],
      default: 'SUCCESS',
    },
    
    // IP address and user agent for security tracking
    ipAddress: {
      type: String,
      // Client IP address
    },
    userAgent: {
      type: String,
      // Client user agent string
    },
    
    // Timestamp
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
auditLogSchema.index({ eventType: 1, timestamp: -1 });
auditLogSchema.index({ actorId: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ timestamp: -1 }); // For time-based queries

// Compound indexes for common queries
auditLogSchema.index({ eventType: 1, targetType: 1, timestamp: -1 });
auditLogSchema.index({ actorId: 1, eventType: 1, timestamp: -1 });

// Virtual: Get readable event description
auditLogSchema.virtual('eventDescription').get(function () {
  return `${this.eventType}: ${this.action}`;
});

// Method: Create audit log entry
auditLogSchema.statics.createLog = async function (logData) {
  try {
    const auditLog = new this(logData);
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
};

// Method: Get audit logs for a specific target
auditLogSchema.statics.getTargetLogs = async function (targetType, targetId, options = {}) {
  const { limit = 50, skip = 0, sort = { timestamp: -1 } } = options;
  
  return this.find({ targetType, targetId })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('actorId', 'name role')
    .lean();
};

// Method: Get audit logs for a specific actor
auditLogSchema.statics.getActorLogs = async function (actorId, options = {}) {
  const { limit = 50, skip = 0, sort = { timestamp: -1 } } = options;
  
  return this.find({ actorId })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('targetId')
    .lean();
};

// Method: Get audit logs by event type
auditLogSchema.statics.getEventLogs = async function (eventType, options = {}) {
  const { limit = 50, skip = 0, sort = { timestamp: -1 } } = options;
  
  return this.find({ eventType })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('actorId', 'name role')
    .populate('targetId')
    .lean();
};

module.exports = mongoose.model('AuditLog', auditLogSchema);

