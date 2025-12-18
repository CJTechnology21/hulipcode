/**
 * Migration: Add Contract Model
 * Creates Contract collection and indexes
 * 
 * Run: node backend/migrations/001_add_contract_model.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Contract = require('../models/Contract');

async function up() {
  try {
    console.log('🔄 Running migration: Add Contract Model...');

    // Connect to database
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/huelip';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Create indexes (Mongoose will create them automatically on first save)
    // But we can verify the model is properly defined
    const sampleContract = new Contract({
      quoteId: new mongoose.Types.ObjectId(),
      version_number: 1,
      status: 'draft',
    });

    // Validate schema
    await sampleContract.validate();

    console.log('✅ Contract model schema validated');

    // Create indexes explicitly
    await Contract.collection.createIndex({ quoteId: 1, version_number: 1 });
    await Contract.collection.createIndex({ projectId: 1 });
    await Contract.collection.createIndex({ status: 1 });
    await Contract.collection.createIndex({ leegalityDocumentId: 1 });

    console.log('✅ Contract indexes created');

    console.log('✅ Migration completed: Contract model added');
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
    console.log('🔄 Rolling back migration: Remove Contract Model...');

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/huelip';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Drop Contract collection
    await mongoose.connection.db.collection('contracts').drop();
    console.log('✅ Contract collection dropped');

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
    console.log('Usage: node 001_add_contract_model.js [up|down]');
  }
}

module.exports = { up, down };

