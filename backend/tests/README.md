# Testing Infrastructure

## Overview

This directory contains all test files for the Huelip Platform backend. Tests are written using Jest and Supertest for API testing.

## Test Structure

```
backend/tests/
├── setup.js                 # Global test setup
├── utils/
│   └── testHelpers.js      # Test utility functions
├── acl.test.js             # Permission/ACL tests
├── adminTools.test.js      # Admin tools tests
├── dataModels.test.js      # Data model tests
├── financials.test.js      # Financial calculations tests
├── notifications.test.js   # Notification tests
├── projectStateMachine.test.js  # Project state machine tests
├── quoteRevisions.test.js  # Quote revision tests
├── security.test.js        # Security (encryption/audit) tests
├── taskManager.test.js    # Task management tests
├── wallet.test.js         # Wallet/escrow tests
└── webhooks.test.js       # Webhook processing tests
```

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** running locally or accessible test database
3. **Environment Variables** set in `.env` or test environment

## Installation

Install test dependencies:

```bash
cd backend
npm install
```

This will install:
- `jest` - Testing framework
- `supertest` - HTTP assertion library

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Permissions/ACL tests
npm run test:permissions

# Task management tests
npm run test:tasks

# Financial calculations tests
npm run test:financials

# Webhook tests
npm run test:webhooks

# Security tests
npm run test:security

# Admin tools tests
npm run test:admin
```

### Run with Coverage

```bash
npm run test:coverage
```

### Run in Watch Mode

```bash
npm run test:watch
```

### Run Verbose Output

```bash
npm run test:verbose
```

### Using Test Runner Script

```bash
# Run all tests
node scripts/runTests.js all

# Run specific test suite
node scripts/runTests.js permissions
node scripts/runTests.js tasks
node scripts/runTests.js financials
node scripts/runTests.js webhooks

# Run with coverage
node scripts/runTests.js coverage
```

## Test Configuration

### Jest Configuration

Jest is configured in `jest.config.js`:
- Test environment: Node.js
- Test timeout: 30 seconds
- Coverage directory: `coverage/`
- Setup file: `tests/setup.js`

### Environment Variables

Tests use the following environment variables (with defaults):

```bash
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
MONGO_URI=mongodb://localhost:27017/test
ENCRYPTION_KEY=test-encryption-key-32-bytes-long!!
ESCROW_PROVIDER=mock
LEEGALITY_WEBHOOK_SECRET=test-secret
```

### Database Setup

Tests use a separate test database. Make sure:
1. MongoDB is running
2. Test database is accessible (default: `mongodb://localhost:27017/test`)
3. Test database is cleaned between test runs

## Writing Tests

### Test File Structure

```javascript
const mongoose = require('mongoose');
const Model = require('../models/Model');

describe('Feature Tests', () => {
  let testData;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    }
  });

  beforeEach(async () => {
    // Set up test data
    testData = await Model.create({ ... });
  });

  afterEach(async () => {
    // Clean up test data
    await Model.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  test('Should do something', async () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

### Using Test Helpers

```javascript
const {
  createTestUser,
  createTestAdmin,
  createTestProject,
  cleanupTestData,
} = require('./utils/testHelpers');

describe('Feature Tests', () => {
  beforeEach(async () => {
    const user = await createTestUser({ role: 'client' });
    const project = await createTestProject(user._id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });
});
```

### API Testing with Supertest

```javascript
const request = require('supertest');
const express = require('express');
const routes = require('../routes/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Tests', () => {
  test('Should return 200', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Test Categories

### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Fast execution

### Integration Tests
- Test interactions between components
- Use real database connections
- Test API endpoints

### Permission Tests (`acl.test.js`)
- Test access control for different user roles
- Verify resource-level permissions
- Test ACL middleware

### Financial Tests (`financials.test.js`)
- Test payout calculations
- Test platform fees
- Test withheld amounts
- Test ledger entries

### Webhook Tests (`webhooks.test.js`)
- Test webhook signature validation
- Test webhook processing
- Test error handling

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after each test
3. **Naming**: Use descriptive test names
4. **Assertions**: Use specific assertions
5. **Mocking**: Mock external services and APIs
6. **Coverage**: Aim for high test coverage
7. **Speed**: Keep tests fast (use test database)

## Troubleshooting

### Tests Fail to Connect to Database

**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running: `mongodb://localhost:27017`
2. Check `MONGO_URI` environment variable
3. Verify network connectivity

### Tests Timeout

**Error:** `Timeout - Async callback was not invoked`

**Solution:**
1. Increase timeout in test: `jest.setTimeout(30000)`
2. Check for hanging database connections
3. Verify async operations complete

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. Stop other instances of the server
2. Use different port for tests
3. Set `PORT` environment variable

## Continuous Integration

Tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    cd backend
    npm install
    npm test
```

## Coverage Reports

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Mongoose Testing](https://mongoosejs.com/docs/jest.html)

