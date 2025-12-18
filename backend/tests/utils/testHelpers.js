/**
 * Test Helper Utilities
 * Common utilities for writing tests
 */

const mongoose = require('mongoose');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Quote = require('../../models/Quote');
const Lead = require('../../models/Lead');
const Task = require('../../models/Tasks');
const Wallet = require('../../models/Wallet');
const Contract = require('../../models/Contract');
const Dispute = require('../../models/Dispute');
const AuditLog = require('../../models/AuditLog');
const LedgerEntry = require('../../models/LedgerEntry');

/**
 * Clean up all test data
 */
const cleanupTestData = async () => {
  try {
    await AuditLog.deleteMany({});
    await Dispute.deleteMany({});
    await Contract.deleteMany({});
    await LedgerEntry.deleteMany({});
    await Task.deleteMany({});
    await Wallet.deleteMany({});
    await Quote.deleteMany({});
    await Project.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
};

/**
 * Create a test user
 */
const createTestUser = async (overrides = {}) => {
  const defaults = {
    name: `Test User ${Date.now()}`,
    email: `test${Date.now()}@test.com`,
    password: 'password123',
    role: 'client',
  };

  return await User.create({ ...defaults, ...overrides });
};

/**
 * Create a test admin user
 */
const createTestAdmin = async (overrides = {}) => {
  return await createTestUser({
    role: 'admin',
    isSuperAdmin: true,
    ...overrides,
  });
};

/**
 * Create a test architect
 */
const createTestArchitect = async (overrides = {}) => {
  return await createTestUser({
    role: 'architect',
    ...overrides,
  });
};

/**
 * Create a test client
 */
const createTestClient = async (overrides = {}) => {
  return await createTestUser({
    role: 'client',
    ...overrides,
  });
};

/**
 * Create a test project
 */
const createTestProject = async (architectId, overrides = {}) => {
  const defaults = {
    name: `Test Project ${Date.now()}`,
    client: 'Test Client',
    location: 'Test City',
    category: 'RESIDENTIAL',
    status: 'NEW',
    architectId,
  };

  return await Project.create({ ...defaults, ...overrides });
};

/**
 * Create a test lead
 */
const createTestLead = async (assignedUserId, overrides = {}) => {
  const defaults = {
    name: `Test Lead ${Date.now()}`,
    budget: '500000',
    contact: '1234567890',
    category: 'RESIDENTIAL',
    assigned: assignedUserId,
    status: 'Assigned',
  };

  return await Lead.create({ ...defaults, ...overrides });
};

/**
 * Create a test quote
 */
const createTestQuote = async (leadId, assignedUserId, overrides = {}) => {
  const defaults = {
    leadId,
    quoteAmount: 500000,
    assigned: [assignedUserId],
    status: 'Send',
  };

  return await Quote.create({ ...defaults, ...overrides });
};

/**
 * Create a test wallet
 */
const createTestWallet = async (projectId, overrides = {}) => {
  const defaults = {
    projectId,
    balance: 0,
    status: 'pending',
  };

  return await Wallet.create({ ...defaults, ...overrides });
};

/**
 * Create a test task
 */
const createTestTask = async (projectId, assignedTo, overrides = {}) => {
  const defaults = {
    name: `Test Task ${Date.now()}`,
    description: 'Test task description',
    projectId,
    assignedTo,
    status: 'TODO',
    value: 10000,
    weight_pct: 10,
  };

  return await Task.create({ ...defaults, ...overrides });
};

/**
 * Wait for async operations
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate JWT token for testing (if needed)
 */
const generateTestToken = (userId) => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'test-jwt-secret-key';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

module.exports = {
  cleanupTestData,
  createTestUser,
  createTestAdmin,
  createTestArchitect,
  createTestClient,
  createTestProject,
  createTestLead,
  createTestQuote,
  createTestWallet,
  createTestTask,
  wait,
  generateTestToken,
};

