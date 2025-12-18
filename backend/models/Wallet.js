const mongoose = require('mongoose');

/**
 * Wallet Model - Escrow wallet for project payments
 * Each project has one wallet that holds escrow funds
 */
const walletSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true, // One wallet per project
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      required: false, // Optional - some projects may not have quotes
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
    reserved_amount: {
      type: Number,
      default: 0,
      min: 0,
      // Amount reserved for pending transactions/withdrawals
      // Available balance = balance - reserved_amount
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'closed', 'pending'],
      default: 'pending', // pending until first deposit
    },
    // External provider details (e.g., Castler, Razorpay)
    provider: {
      type: String,
      enum: ['castler', 'razorpay', 'internal', 'manual'],
      default: 'internal', // For now, using internal tracking
    },
    providerWalletId: {
      type: String, // External wallet ID from provider
      sparse: true,
    },
    // Metadata
    metadata: {
      totalDeposited: { type: Number, default: 0 },
      totalWithdrawn: { type: Number, default: 0 },
      lastDepositAt: Date,
      lastWithdrawalAt: Date,
      depositCount: { type: Number, default: 0 },
      withdrawalCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for performance
walletSchema.index({ projectId: 1 });
walletSchema.index({ quoteId: 1 });
walletSchema.index({ status: 1 });

// Virtual: Calculate available balance (balance - reserved)
walletSchema.virtual('availableBalance').get(function () {
  return Math.max(0, this.balance - (this.reserved_amount || 0));
});

// Method: Add deposit
walletSchema.methods.addDeposit = async function (amount, transactionId = null) {
  if (amount <= 0) {
    throw new Error('Deposit amount must be positive');
  }

  this.balance += amount;
  this.metadata.totalDeposited += amount;
  this.metadata.lastDepositAt = new Date();
  this.metadata.depositCount += 1;
  
  if (this.status === 'pending') {
    this.status = 'active';
  }

  await this.save();
  return this;
};

// Method: Add withdrawal
walletSchema.methods.addWithdrawal = async function (amount, transactionId = null, actorId = null, req = null) {
  if (amount <= 0) {
    throw new Error('Withdrawal amount must be positive');
  }

  const availableBalance = this.balance - (this.reserved_amount || 0);
  if (availableBalance < amount) {
    throw new Error('Insufficient available balance');
  }

  this.balance -= amount;
  this.metadata.totalWithdrawn += amount;
  this.metadata.lastWithdrawalAt = new Date();
  this.metadata.withdrawalCount += 1;

  await this.save();

  // Create audit log entry for payout release
  if (actorId) {
    try {
      const { logPayoutRelease } = require('../services/auditService');
      await logPayoutRelease({
        projectId: this.projectId,
        actorId,
        amount,
        currency: this.currency || 'INR',
        metadata: {
          walletId: this._id,
          transactionId,
          balanceBefore: this.balance + amount,
          balanceAfter: this.balance,
          reservedAmount: this.reserved_amount,
        },
        req,
      });
    } catch (auditError) {
      console.error('Error creating audit log for payout release:', auditError);
      // Don't fail the withdrawal if audit logging fails
    }
  }

  return this;
};

// Method: Reserve amount (for pending transactions)
walletSchema.methods.reserveAmount = async function (amount, reason = 'Pending transaction') {
  if (amount <= 0) {
    throw new Error('Reserve amount must be positive');
  }

  const availableBalance = this.balance - (this.reserved_amount || 0);
  if (availableBalance < amount) {
    throw new Error('Insufficient available balance to reserve');
  }

  this.reserved_amount = (this.reserved_amount || 0) + amount;
  await this.save();
  return this;
};

// Method: Release reserved amount
walletSchema.methods.releaseReserved = async function (amount) {
  if (amount <= 0) {
    throw new Error('Release amount must be positive');
  }

  if ((this.reserved_amount || 0) < amount) {
    throw new Error('Cannot release more than reserved amount');
  }

  this.reserved_amount = Math.max(0, (this.reserved_amount || 0) - amount);
  await this.save();
  return this;
};

// Method: Freeze wallet
walletSchema.methods.freeze = async function () {
  this.status = 'frozen';
  await this.save();
  return this;
};

// Method: Unfreeze wallet
walletSchema.methods.unfreeze = async function () {
  if (this.status === 'frozen') {
    this.status = 'active';
    await this.save();
  }
  return this;
};

// Method: Close wallet
walletSchema.methods.close = async function () {
  if (this.balance > 0) {
    throw new Error('Cannot close wallet with remaining balance');
  }
  this.status = 'closed';
  await this.save();
  return this;
};

module.exports = mongoose.model('Wallet', walletSchema);

