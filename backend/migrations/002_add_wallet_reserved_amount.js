/**
 * Migration: Add reserved_amount field to Wallet model
 * Adds reserved_amount field to existing wallets
 * 
 * Run: node backend/migrations/002_add_wallet_reserved_amount.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Wallet = require('../models/Wallet');

async function up() {
  try {
    console.log('🔄 Running migration: Add reserved_amount to Wallet...');

    // Connect to database
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/huelip';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Update all existing wallets to have reserved_amount = 0
    const result = await Wallet.updateMany(
      { reserved_amount: { $exists: false } },
      { $set: { reserved_amount: 0 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} wallet(s) with reserved_amount field`);

    // Verify schema
    const sampleWallet = new Wallet({
      projectId: new mongoose.Types.ObjectId(),
      balance: 1000,
      reserved_amount: 100,
    });

    await sampleWallet.validate();
    console.log('✅ Wallet model schema validated');

    console.log('✅ Migration completed: reserved_amount added to Wallet');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

async function down() {
  try {
    console.log('🔄 Rolling back migration: Remove reserved_amount from Wallet...');

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/huelip';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove reserved_amount field from all wallets
    const result = await Wallet.updateMany(
      {},
      { $unset: { reserved_amount: '' } }
    );

    console.log(`✅ Removed reserved_amount from ${result.modifiedCount} wallet(s)`);
    console.log('✅ Rollback completed');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2] || 'up';
  if (command === 'up') {
    up().catch(console.error);
  } else if (command === 'down') {
    down().catch(console.error);
  } else {
    console.log('Usage: node 002_add_wallet_reserved_amount.js [up|down]');
  }
}

module.exports = { up, down };

