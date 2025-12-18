const mongoose = require('mongoose');

/**
 * LedgerEntry Model
 * Tracks all financial transactions (credits and debits) for projects
 * Used for calculating payables, fees, withheld amounts, and penalties
 */
const ledgerEntrySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      // Optional - ledger entries can be for tasks or general project transactions
    },
    entryType: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'TASK_PAYOUT',        // Payment for completed task
        'PLATFORM_FEE',       // Platform commission (4%)
        'WITHHELD',           // Withheld amount (15%)
        'PENALTY',            // Penalty charges
        'ADJUSTMENT',         // Manual adjustments
        'REFUND',             // Refunds
        'OTHER',               // Other transactions
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
    description: {
      type: String,
      required: true,
    },
    // Reference to related transaction or task
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference Task, Transaction, or other entities
    },
    referenceType: {
      type: String,
      enum: ['TASK', 'TRANSACTION', 'MANUAL', 'OTHER'],
    },
    // Metadata for calculations
    metadata: {
      // For task payouts
      taskValue: Number,
      progress: Number,
      previousPaid: Number,
      
      // For fees
      platformFeePercent: Number,
      withheldPercent: Number,
      
      // For penalties
      penaltyReason: String,
      penaltyAmount: Number,
      
      // For payable calculations
      grossAmount: Number,
      netAmount: Number,
      totalDeductions: Number,
    },
    // Status tracking
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'CANCELLED'],
      default: 'PENDING',
    },
    processedAt: {
      type: Date,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes for performance
ledgerEntrySchema.index({ projectId: 1, entryType: 1 });
ledgerEntrySchema.index({ projectId: 1, category: 1 });
ledgerEntrySchema.index({ taskId: 1 });
ledgerEntrySchema.index({ status: 1 });

// Virtual for running balance (if needed in future)
ledgerEntrySchema.virtual('runningBalance').get(function() {
  // This would require aggregation to calculate
  return null;
});

module.exports = mongoose.model('LedgerEntry', ledgerEntrySchema);

