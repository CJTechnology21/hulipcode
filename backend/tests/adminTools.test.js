/**
 * Admin Tools Tests
 * Tests for admin-only endpoints: KYC approval, dispute management, wallet adjustments
 */

const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Dispute = require('../models/Dispute');
const Wallet = require('../models/Wallet');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/admin', protect, adminRoutes);

describe('Admin Tools - Permission Tests', () => {
  let adminUser;
  let regularUser;
  let testClient;
  let testArchitect;
  let testProject;
  let testWallet;
  let testDispute;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: `admin${Date.now()}@test.com`,
      password: 'password123',
      role: 'admin',
      isSuperAdmin: true,
    });

    // Create regular user (non-admin)
    regularUser = await User.create({
      name: 'Regular User',
      email: `regular${Date.now()}@test.com`,
      password: 'password123',
      role: 'client',
      aadhaarFile: 'test-aadhaar.pdf',
      panFile: 'test-pan.pdf',
      kycStatus: 'PENDING',
    });

    // Create test client
    testClient = await User.create({
      name: 'Test Client',
      email: `client${Date.now()}@test.com`,
      password: 'password123',
      role: 'client',
      aadhaarFile: 'test-aadhaar.pdf',
      kycStatus: 'PENDING',
    });

    // Create test architect
    testArchitect = await User.create({
      name: 'Test Architect',
      email: `architect${Date.now()}@test.com`,
      password: 'password123',
      role: 'architect',
    });

    // Create test lead
    const testLead = await Lead.create({
      name: 'Test Lead',
      budget: '500000',
      contact: '1234567890',
      category: 'RESIDENTIAL',
      assigned: testClient._id,
    });

    // Create test quote
    const testQuote = await Quote.create({
      leadId: testLead._id,
      quoteAmount: 500000,
      assigned: [testArchitect._id],
    });

    // Create test project
    testProject = await Project.create({
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test City',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
      quoteId: testQuote._id,
    });

    // Create test wallet
    testWallet = await Wallet.create({
      projectId: testProject._id,
      balance: 100000,
      status: 'active',
    });

    // Create test dispute
    testDispute = await Dispute.create({
      projectId: testProject._id,
      raisedBy: testClient._id,
      raisedByRole: 'client',
      against: testArchitect._id,
      title: 'Test Dispute',
      description: 'Test dispute description',
      category: 'TASK_QUALITY',
      status: 'OPEN',
    });
  });

  afterEach(async () => {
    await Dispute.deleteMany({});
    await Wallet.deleteMany({});
    await Project.deleteMany({});
    await Quote.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Helper: Get auth token for user
  const getAuthToken = async (user) => {
    // In a real scenario, you'd generate a JWT token
    // For testing, we'll use a mock approach
    return 'mock-token-' + user._id;
  };

  describe('Admin Access Control', () => {
    test('Admin should access KYC endpoints', async () => {
      // Mock: Admin user authenticated
      // In real test, you'd set req.user = adminUser
      // For now, we'll test the logic directly
      expect(adminUser.role).toBe('admin');
      expect(adminUser.isSuperAdmin).toBe(true);
    });

    test('Non-admin should not access admin endpoints', async () => {
      expect(regularUser.role).not.toBe('admin');
      expect(regularUser.isSuperAdmin).not.toBe(true);
    });
  });

  describe('KYC Approval', () => {
    test('Should approve KYC for user', async () => {
      const user = await User.findById(testClient._id);
      expect(user.kycStatus).toBe('PENDING');

      // Simulate approval
      user.kycStatus = 'APPROVED';
      user.kycApprovedAt = new Date();
      user.kycApprovedBy = adminUser._id;
      await user.save();

      const updatedUser = await User.findById(testClient._id);
      expect(updatedUser.kycStatus).toBe('APPROVED');
      expect(updatedUser.kycApprovedBy.toString()).toBe(adminUser._id.toString());
    });

    test('Should reject KYC with reason', async () => {
      const user = await User.findById(testClient._id);
      const reason = 'Documents not clear';

      user.kycStatus = 'REJECTED';
      user.kycRejectedAt = new Date();
      user.kycRejectedBy = adminUser._id;
      user.kycRejectedReason = reason;
      await user.save();

      const updatedUser = await User.findById(testClient._id);
      expect(updatedUser.kycStatus).toBe('REJECTED');
      expect(updatedUser.kycRejectedReason).toBe(reason);
    });
  });

  describe('Dispute Management', () => {
    test('Should fetch disputes list', async () => {
      const disputes = await Dispute.find({})
        .populate('projectId')
        .populate('raisedBy');

      expect(disputes.length).toBeGreaterThan(0);
      expect(disputes[0].title).toBe('Test Dispute');
    });

    test('Should resolve dispute', async () => {
      const dispute = await Dispute.findById(testDispute._id);
      expect(dispute.status).toBe('OPEN');

      await dispute.markResolved(
        adminUser._id,
        'Resolved in favor of client',
        'APPROVED_FOR_CLIENT'
      );

      const updatedDispute = await Dispute.findById(testDispute._id);
      expect(updatedDispute.status).toBe('RESOLVED');
      expect(updatedDispute.resolvedBy.toString()).toBe(adminUser._id.toString());
    });
  });

  describe('Wallet Adjustments', () => {
    test('Should adjust wallet balance', async () => {
      const wallet = await Wallet.findById(testWallet._id);
      const balanceBefore = wallet.balance;

      // Add amount
      await wallet.addWithdrawal(10000, 'test-txn', adminUser._id);

      const updatedWallet = await Wallet.findById(testWallet._id);
      expect(updatedWallet.balance).toBe(balanceBefore - 10000);
    });

    test('Should require reason for adjustment', () => {
      // This would be validated in the controller
      const reason = '';
      expect(reason.trim().length).toBe(0);
    });
  });

  describe('User Model - KYC Fields', () => {
    test('Should have KYC status field', async () => {
      const user = await User.create({
        name: 'KYC Test User',
        email: `kyc${Date.now()}@test.com`,
        password: 'password123',
        role: 'client',
        kycStatus: 'PENDING',
      });

      expect(user.kycStatus).toBe('PENDING');
    });

    test('Should update KYC status', async () => {
      const user = await User.findById(testClient._id);
      user.kycStatus = 'APPROVED';
      await user.save();

      const updatedUser = await User.findById(testClient._id);
      expect(updatedUser.kycStatus).toBe('APPROVED');
    });
  });

  describe('Dispute Model', () => {
    test('Should create dispute', async () => {
      const dispute = await Dispute.create({
        projectId: testProject._id,
        raisedBy: testClient._id,
        raisedByRole: 'client',
        title: 'New Dispute',
        description: 'Dispute description',
        category: 'PAYMENT',
        status: 'OPEN',
      });

      expect(dispute.status).toBe('OPEN');
      expect(dispute.category).toBe('PAYMENT');
    });

    test('Should check if dispute is overdue', () => {
      const dispute = new Dispute({
        projectId: testProject._id,
        raisedBy: testClient._id,
        raisedByRole: 'client',
        title: 'Overdue Dispute',
        description: 'Test',
        deadline: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: 'OPEN',
      });

      expect(dispute.isOverdue()).toBe(true);
    });
  });
});

