#!/usr/bin/env node

/**
 * Test Runner Script
 * Provides a convenient way to run tests with different options
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const testType = args[0] || 'all';

// Test type mappings
const testCommands = {
  all: ['jest', '--coverage', '--verbose'],
  watch: ['jest', '--watch'],
  coverage: ['jest', '--coverage'],
  verbose: ['jest', '--verbose'],
  unit: ['jest', '--testPathPattern=tests/.*\\.test\\.js$'],
  permissions: ['jest', 'tests/acl.test.js'],
  tasks: ['jest', 'tests/taskManager.test.js'],
  financials: ['jest', 'tests/financials.test.js'],
  webhooks: ['jest', 'tests/webhooks.test.js'],
  security: ['jest', 'tests/security.test.js'],
  admin: ['jest', 'tests/adminTools.test.js'],
  models: ['jest', 'tests/dataModels.test.js'],
  wallet: ['jest', 'tests/wallet.test.js'],
  notifications: ['jest', 'tests/notifications.test.js'],
  revisions: ['jest', 'tests/quoteRevisions.test.js'],
};

// Get command for test type
const command = testCommands[testType];

if (!command) {
  console.error(`❌ Unknown test type: ${testType}`);
  console.log('\nAvailable test types:');
  Object.keys(testCommands).forEach(type => {
    console.log(`  - ${type}`);
  });
  process.exit(1);
}

// Set environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

console.log(`🧪 Running tests: ${testType}`);
console.log(`📦 Command: ${command.join(' ')}\n`);

// Run Jest
const jestProcess = spawn('npx', command, {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..'),
});

jestProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Tests completed successfully');
  } else {
    console.log(`\n❌ Tests failed with code ${code}`);
    process.exit(code);
  }
});

jestProcess.on('error', (error) => {
  console.error('❌ Error running tests:', error);
  process.exit(1);
});

