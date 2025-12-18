/**
 * Webhook Processing Tests
 * Tests for escrow deposit and e-signature callback webhooks
 */

const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const webhookRoutes = require('../routes/webhookRoutes');
const { generateMockSignature } = require('../middleware/webhookSignature');
const Wallet = require('../models/Wallet');
const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const User = require('../models/User');

// Create test app
const app = express();
app.use(express.json());
app.use('/webhooks', webhookRoutes);

describe('Webhook Processing Tests', () => {
  let testArchitect;
  let testClient;
  let testLead;
  let testQuote;
  let testProject;
  let testWallet;
  let testContract;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    // Create test users
    testArchitect = await User.create({
      name: 'Test Architect',
      email: `architect${Date.now()}@test.com`,
      password: 'password123',
      role: 'architect',
    });

    testClient = await User.create({
      name: 'Test Client',
      email: `client${Date.now()}@test.com`,
      password: 'password123',
      role: 'client',
    });

    // Create test lead
    testLead = await Lead.create({
      name: 'Test Lead',
      budget: '500000',
      contact: '1234567890',
      category: 'RESIDENTIAL',
      assigned: testClient._id,
    });

    // Create test quote
    testQuote = await Quote.create({
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
      status: 'CONTRACT_PENDING',
      architectId: testArchitect._id,
      quoteId: testQuote._id,
    });

    // Create test wallet
    testWallet = await Wallet.create({
      projectId: testProject._id,
      quoteId: testQuote._id,
      balance: 0,
      status: 'pending',
    });

    // Create test contract
    testContract = await Contract.create({
      quoteId: testQuote._id,
      projectId: testProject._id,
      version_number: 1,
      leegalityDocumentId: 'leegality_doc_test_123',
      status: 'pending_signature',
      leegalitySigningLinks: [
        {
          signerEmail: testClient.email,
          signerName: testClient.name,
          signingUrl: 'https://leegality.com/sign/client',
          status: 'sent',
        },
        {
          signerEmail: testArchitect.email,
          signerName: testArchitect.name,
          signingUrl: 'https://leegality.com/sign/architect',
          status: 'sent',
        },
      ],
    });
  });

  afterEach(async () => {
    // Clean up
    await Contract.deleteMany({});
    await Wallet.deleteMany({});
    await Quote.deleteMany({});
    await Project.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Webhook Health Check', () => {
    test('Should return health check status', async () => {
      const response = await request(app)
        .get('/webhooks/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.escrowDeposit).toBe('/webhooks/escrow/deposit');
      expect(response.body.endpoints.esignCallback).toBe('/webhooks/esign/callback');
    });
  });

  describe('Escrow Deposit Webhook', () => {
    test('Should process valid deposit webhook', async () => {
      const payload = {
        projectId: testProject._id.toString(),
        amount: 100000,
        transactionId: 'test_txn_001',
        status: 'success',
        currency: 'INR',
      };

      const signature = generateMockSignature(payload, 'mock');

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(100000);
      expect(response.body.data.balance).toBe(100000);

      // Verify wallet was updated
      const updatedWallet = await Wallet.findById(testWallet._id);
      expect(updatedWallet.balance).toBe(100000);
      expect(updatedWallet.status).toBe('active');
    });

    test('Should reject webhook with invalid signature', async () => {
      const payload = {
        projectId: testProject._id.toString(),
        amount: 100000,
        transactionId: 'test_txn_002',
        status: 'success',
      };

      // Set NODE_ENV to production to enforce signature validation
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-signature', 'invalid-signature')
        .send(payload)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid webhook signature');

      // Restore NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    test('Should reject webhook with missing required fields', async () => {
      const payload = {
        projectId: testProject._id.toString(),
        // Missing amount and transactionId
        status: 'success',
      };

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('Should not process failed deposit status', async () => {
      const payload = {
        projectId: testProject._id.toString(),
        amount: 100000,
        transactionId: 'test_txn_003',
        status: 'failed',
      };

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not processed');

      // Verify wallet balance was not updated
      const updatedWallet = await Wallet.findById(testWallet._id);
      expect(updatedWallet.balance).toBe(0);
    });

    test('Should handle multiple deposits', async () => {
      // First deposit
      const payload1 = {
        projectId: testProject._id.toString(),
        amount: 100000,
        transactionId: 'test_txn_004',
        status: 'success',
      };

      await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload1)
        .expect(200);

      // Second deposit
      const payload2 = {
        projectId: testProject._id.toString(),
        amount: 150000,
        transactionId: 'test_txn_005',
        status: 'success',
      };

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload2)
        .expect(200);

      expect(response.body.data.balance).toBe(250000);

      // Verify wallet balance
      const updatedWallet = await Wallet.findById(testWallet._id);
      expect(updatedWallet.balance).toBe(250000);
      expect(updatedWallet.metadata.depositCount).toBe(2);
    });

    test('Should find wallet by walletId', async () => {
      const payload = {
        walletId: testWallet._id.toString(),
        amount: 50000,
        transactionId: 'test_txn_006',
        status: 'success',
      };

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.balance).toBe(50000);
    });
  });

  describe('E-Signature Callback Webhook', () => {
    test('Should process invitee.signed event', async () => {
      const payload = {
        documentId: 'leegality_doc_test_123',
        event: 'invitee.signed',
        invitee: {
          email: testClient.email,
          name: testClient.name,
          status: 'signed',
        },
        timestamp: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('partially_signed');

      // Verify contract was updated
      const updatedContract = await Contract.findById(testContract._id);
      expect(updatedContract.signed_by_client).toBe(true);
      expect(updatedContract.leegalitySigningLinks[0].status).toBe('signed');
    });

    test('Should process document.completed event', async () => {
      // First mark client as signed
      testContract.signed_by_client = true;
      await testContract.save();

      const payload = {
        documentId: 'leegality_doc_test_123',
        event: 'document.completed',
        timestamp: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('fully_signed');

      // Verify contract was updated
      const updatedContract = await Contract.findById(testContract._id);
      expect(updatedContract.status).toBe('fully_signed');

      // Verify project status was updated
      const updatedProject = await Project.findById(testProject._id);
      expect(updatedProject.status).toBe('CONTRACT_SIGNED');
    });

    test('Should process document.rejected event', async () => {
      const payload = {
        documentId: 'leegality_doc_test_123',
        event: 'document.rejected',
        timestamp: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify contract was updated
      const updatedContract = await Contract.findById(testContract._id);
      expect(updatedContract.status).toBe('cancelled');
    });

    test('Should reject callback with missing documentId', async () => {
      const payload = {
        event: 'invitee.signed',
        invitee: {
          email: testClient.email,
          name: testClient.name,
          status: 'signed',
        },
      };

      const response = await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing documentId');
    });

    test('Should handle contract not found gracefully', async () => {
      const payload = {
        documentId: 'non_existent_doc_id',
        event: 'invitee.signed',
        invitee: {
          email: testClient.email,
          name: testClient.name,
          status: 'signed',
        },
      };

      const response = await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Contract not found');
    });

    test('Should update signing link status on invitee.signed', async () => {
      const payload = {
        documentId: 'leegality_doc_test_123',
        event: 'invitee.signed',
        invitee: {
          email: testArchitect.email,
          name: testArchitect.name,
          status: 'signed',
        },
        timestamp: new Date().toISOString(),
      };

      await request(app)
        .post('/webhooks/esign/callback')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      // Verify signing link was updated
      const updatedContract = await Contract.findById(testContract._id);
      const architectLink = updatedContract.leegalitySigningLinks.find(
        link => link.signerEmail === testArchitect.email
      );
      expect(architectLink.status).toBe('signed');
      expect(architectLink.signedAt).toBeDefined();
    });
  });

  describe('Webhook Signature Validation', () => {
    test('Should validate mock signature in development mode', async () => {
      const payload = {
        projectId: testProject._id.toString(),
        amount: 100000,
        transactionId: 'test_txn_007',
        status: 'success',
      };

      const response = await request(app)
        .post('/webhooks/escrow/deposit')
        .set('x-bypass-signature', 'true')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('Should generate mock signature correctly', () => {
      const payload = { test: 'data' };
      const signature = generateMockSignature(payload, 'mock');
      
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });
  });
});

