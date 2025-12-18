# How to Run Tests Locally

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `jest` - Testing framework
- `supertest` - HTTP assertion library

### 2. Start MongoDB

Ensure MongoDB is running:

```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb-test mongo

# Option 3: MongoDB Atlas (set MONGO_URI)
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:permissions    # ACL/permission tests
npm run test:tasks          # Task management tests
npm run test:financials     # Financial calculation tests
npm run test:webhooks       # Webhook tests
npm run test:security       # Security tests
npm run test:admin          # Admin tools tests

# Run with coverage
npm run test:coverage

# Run in watch mode (auto-rerun on file changes)
npm run test:watch
```

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:verbose` | Run with verbose output |
| `npm run test:permissions` | Run ACL/permission tests |
| `npm run test:tasks` | Run task management tests |
| `npm run test:financials` | Run financial calculation tests |
| `npm run test:webhooks` | Run webhook tests |
| `npm run test:security` | Run security tests |
| `npm run test:admin` | Run admin tools tests |

## Using Test Runner Script

```bash
# Run all tests
node scripts/runTests.js all

# Run specific test suite
node scripts/runTests.js permissions
node scripts/runTests.js tasks
node scripts/runTests.js financials
node scripts/runTests.js webhooks
node scripts/runTests.js security
node scripts/runTests.js admin

# Run with coverage
node scripts/runTests.js coverage

# Run in watch mode
node scripts/runTests.js watch
```

## Environment Variables

Tests use these environment variables (with defaults):

```bash
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/test
JWT_SECRET=test-jwt-secret-key
ENCRYPTION_KEY=test-encryption-key-32-bytes-long!!
ESCROW_PROVIDER=mock
LEEGALITY_WEBHOOK_SECRET=test-secret
```

You can override these by creating a `.env.test` file or setting them in your environment.

## Expected Output

When tests run successfully, you'll see:

```
PASS  tests/acl.test.js
PASS  tests/financials.test.js
PASS  tests/webhooks.test.js
PASS  tests/taskManager.test.js
PASS  tests/security.test.js
PASS  tests/adminTools.test.js

Test Suites: 6 passed, 6 total
Tests:       120 passed, 120 total
Snapshots:   0 total
Time:        25.456 s
```

## Coverage Report

After running `npm run test:coverage`, open:

```
backend/coverage/lcov-report/index.html
```

This shows:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB
mongod

# Or use Docker
docker start mongodb-test
```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Tests Timeout

**Error:** `Timeout - Async callback was not invoked`

**Solution:**
- Check database connection
- Increase timeout in test file: `jest.setTimeout(60000)`
- Check for hanging async operations

### Module Not Found

**Error:** `Cannot find module 'supertest'`

**Solution:**
```bash
npm install --save-dev jest supertest
```

## Test Files

All test files are in `backend/tests/`:

- `acl.test.js` - Permission/ACL tests
- `adminTools.test.js` - Admin tools tests
- `dataModels.test.js` - Data model tests
- `financials.test.js` - Financial calculations tests
- `notifications.test.js` - Notification tests
- `projectStateMachine.test.js` - Project state machine tests
- `quoteRevisions.test.js` - Quote revision tests
- `security.test.js` - Security (encryption/audit) tests
- `taskManager.test.js` - Task management tests
- `wallet.test.js` - Wallet/escrow tests
- `webhooks.test.js` - Webhook processing tests

## Writing New Tests

See `backend/tests/README.md` for detailed guide on writing tests.

Quick example:

```javascript
const mongoose = require('mongoose');
const Model = require('../models/Model');

describe('Feature Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Should do something', async () => {
    const result = await Model.create({ ... });
    expect(result).toBeDefined();
  });
});
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines. See `TESTING_INFRASTRUCTURE_SUMMARY.md` for GitHub Actions example.

