/**
 * Verification Script for Contract and Wallet Models
 * Ensures models are properly defined and can be loaded
 * 
 * Usage: node backend/scripts/verifyModels.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function verifyModels() {
  try {
    console.log('🔍 Verifying Data Models...\n');

    // Connect to database
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/huelip';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Load models
    console.log('📦 Loading models...');
    const Contract = require('../models/Contract');
    const Wallet = require('../models/Wallet');
    console.log('✅ Models loaded\n');

    // Verify Contract model
    console.log('📄 Verifying Contract Model:');
    const contractSchema = Contract.schema;
    const contractFields = contractSchema.obj;
    
    const requiredContractFields = [
      'version_number',
      'terms_blob',
      'pdf_url',
      'signed_by_client',
      'signed_by_professional',
    ];

    for (const field of requiredContractFields) {
      if (contractFields[field] !== undefined) {
        console.log(`  ✅ ${field} - exists`);
      } else {
        console.log(`  ❌ ${field} - MISSING`);
      }
    }

    // Verify Wallet model
    console.log('\n💰 Verifying Wallet Model:');
    const walletSchema = Wallet.schema;
    const walletFields = walletSchema.obj;

    const requiredWalletFields = [
      'balance',
      'reserved_amount',
      'providerWalletId',
    ];

    for (const field of requiredWalletFields) {
      if (walletFields[field] !== undefined) {
        console.log(`  ✅ ${field} - exists`);
      } else {
        console.log(`  ❌ ${field} - MISSING`);
      }
    }

    // Check virtuals
    console.log('\n🔧 Verifying Virtuals:');
    const contractVirtuals = Object.keys(contractSchema.virtuals);
    const walletVirtuals = Object.keys(walletSchema.virtuals);

    if (contractVirtuals.includes('isFullySigned')) {
      console.log('  ✅ Contract.isFullySigned - exists');
    } else {
      console.log('  ❌ Contract.isFullySigned - MISSING');
    }

    if (walletVirtuals.includes('availableBalance')) {
      console.log('  ✅ Wallet.availableBalance - exists');
    } else {
      console.log('  ❌ Wallet.availableBalance - MISSING');
    }

    // Check methods
    console.log('\n⚙️  Verifying Methods:');
    const contractMethods = Object.keys(contractSchema.methods);
    const walletMethods = Object.keys(walletSchema.methods);

    if (contractMethods.includes('markClientSigned')) {
      console.log('  ✅ Contract.markClientSigned() - exists');
    } else {
      console.log('  ❌ Contract.markClientSigned() - MISSING');
    }

    if (contractMethods.includes('markProfessionalSigned')) {
      console.log('  ✅ Contract.markProfessionalSigned() - exists');
    } else {
      console.log('  ❌ Contract.markProfessionalSigned() - MISSING');
    }

    if (walletMethods.includes('reserveAmount')) {
      console.log('  ✅ Wallet.reserveAmount() - exists');
    } else {
      console.log('  ❌ Wallet.reserveAmount() - MISSING');
    }

    if (walletMethods.includes('releaseReserved')) {
      console.log('  ✅ Wallet.releaseReserved() - exists');
    } else {
      console.log('  ❌ Wallet.releaseReserved() - MISSING');
    }

    // Check indexes
    console.log('\n📇 Verifying Indexes:');
    const contractIndexes = await Contract.collection.getIndexes();
    const walletIndexes = await Wallet.collection.getIndexes();

    console.log(`  ✅ Contract indexes: ${Object.keys(contractIndexes).length} found`);
    console.log(`  ✅ Wallet indexes: ${Object.keys(walletIndexes).length} found`);

    console.log('\n✅ Model verification completed successfully!');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyModels().catch(console.error);
}

module.exports = { verifyModels };

