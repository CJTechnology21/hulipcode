/**
 * Jest Test Setup
 * Global setup and teardown for all tests
 */

const mongoose = require('mongoose');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Global beforeAll: Connect to test database
beforeAll(async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to test database');
    }
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
});

// Global afterAll: Close database connection
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
});

// Suppress console errors in tests (optional - uncomment if needed)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

// Mock environment variables for tests
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test-encryption-key-32-bytes-long!!';
process.env.ESCROW_PROVIDER = process.env.ESCROW_PROVIDER || 'mock';
process.env.LEEGALITY_WEBHOOK_SECRET = process.env.LEEGALITY_WEBHOOK_SECRET || 'test-secret';

