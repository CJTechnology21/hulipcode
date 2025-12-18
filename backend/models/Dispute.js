const mongoose = require('mongoose');

/**
 * Dispute Model
 * Tracks disputes between clients and professionals
 */
const disputeSchema = new mongoose.Schema(
  {
    // Related entities
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      // Optional - dispute can be task-specific or project-wide
      index: true,
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      // Optional - for quote-related disputes
    },
    
    // Parties involved
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // User who raised the dispute (client or professional)
    },
    raisedByRole: {
      type: String,
      enum: ['client', 'architect', 'admin'],
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // User against whom dispute is raised
    },
    
    // Dispute details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'TASK_QUALITY',
        'TASK_COMPLETION',
        'PAYMENT',
        'DELAY',
        'MATERIAL_ISSUE',
        'SCOPE_CHANGE',
        'COMMUNICATION',
        'OTHER',
      ],
      required: true,
      default: 'OTHER',
    },
    
    // Status and resolution
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED', 'ESCALATED'],
      default: 'OPEN',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    
    // Resolution details
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Admin who resolved the dispute
    },
    resolution: {
      type: String,
      // Resolution description
    },
    resolutionDate: {
      type: Date,
    },
    resolutionAction: {
      type: String,
      enum: [
        'APPROVED_FOR_CLIENT',
        'APPROVED_FOR_PROFESSIONAL',
        'PARTIAL_REFUND',
        'FULL_REFUND',
        'REWORK_REQUIRED',
        'NO_ACTION',
        'ESCALATED_TO_ARBITRATION',
      ],
    },
    
    // Evidence and attachments
    evidence: [
      {
        type: {
          type: String,
          enum: ['PHOTO', 'VIDEO', 'DOCUMENT', 'MESSAGE', 'OTHER'],
        },
        url: String,
        description: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    
    // Financial impact
    amountInvolved: {
      type: Number,
      // Amount in dispute (if applicable)
    },
    currency: {
      type: String,
      default: 'INR',
    },
    
    // Timeline
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      // 48-hour deadline for resolution
    },
    
    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      // Additional context-specific data
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
disputeSchema.index({ status: 1, raisedAt: -1 });
disputeSchema.index({ projectId: 1, status: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ category: 1, status: 1 });

// Pre-save hook: Update lastUpdated
disputeSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

// Method: Calculate time remaining until deadline
disputeSchema.methods.getTimeRemaining = function () {
  if (!this.deadline) return null;
  const now = new Date();
  const remaining = this.deadline - now;
  return remaining > 0 ? remaining : 0; // Return 0 if deadline passed
};

// Method: Check if dispute is overdue
disputeSchema.methods.isOverdue = function () {
  if (!this.deadline) return false;
  return new Date() > this.deadline && this.status === 'OPEN';
};

// Method: Mark as resolved
disputeSchema.methods.markResolved = async function (resolvedBy, resolution, resolutionAction) {
  this.status = 'RESOLVED';
  this.resolvedBy = resolvedBy;
  this.resolution = resolution;
  this.resolutionAction = resolutionAction;
  this.resolutionDate = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('Dispute', disputeSchema);

