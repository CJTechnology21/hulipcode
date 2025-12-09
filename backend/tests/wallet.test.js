/**
 * Wallet & Escrow Tests
 * Tests for wallet creation, deposit webhooks, and balance visibility
 */

const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { createWallet, depositWebhook, getBalance } = require('../services/walletService');

describe('Wallet & Escrow Tests', () => {
  let testProject, testQuote, testLead, testArchitect, testHomeowner;

  beforeAll(async () => {
    // Connect to test database
    // await mongoose.connect(process.env.MONGODB_TEST_URI);

    // Create test users
    testArchitect = await User.create({
      name: 'Test Architect',
      email: 'architect@test.com',
      password: 'password123',
      role: 'architect',
    });

    testHomeowner = await User.create({
      name: 'Test Homeowner',
      email: 'homeowner@test.com',
      password: 'password123',
      role: 'client',
    });

    // Create test lead
    testLead = await Lead.create({
      name: 'Test Lead',
      budget: '500000',
      contact: '1234567890',
      status: 'Assigned',
      assigned: testHomeowner._id,
      category: 'RESIDENTIAL',
    });

    // Create test quote
    testQuote = await Quote.create({
      leadId: testLead._id,
      quoteAmount: 500000,
      assigned: [testArchitect._id],
      status: 'Approved',
    });

    // Create test project
    testProject = await Project.create({
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test Location',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
      quoteId: testQuote._id,
    });
  });

  afterAll(async () => {
    // Cleanup
    await Wallet.deleteMany({});
    await Project.deleteMany({});
    await Quote.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
    // await mongoose.connection.close();
  });

  describe('Test 1: Wallet creation', () => {
    test('Wallet is created when createWallet is called', async () => {
      const wallet = await createWallet(testProject);

      expect(wallet).toBeDefined();
      expect(wallet.projectId.toString()).toBe(testProject._id.toString());
      expect(wallet.quoteId.toString()).toBe(testQuote._id.toString());
      expect(wallet.balance).toBe(0);
      expect(wallet.status).toBe('pending');
      expect(wallet.currency).toBe('INR');
    });

    test('Wallet creation is idempotent (does not create duplicate)', async () => {
      const wallet1 = await createWallet(testProject);
      const wallet2 = await createWallet(testProject);

      expect(wallet1._id.toString()).toBe(wallet2._id.toString());
    });

    test('Wallet has correct metadata initialized', async () => {
      const wallet = await createWallet(testProject);
      
      expect(wallet.metadata.totalDeposited).toBe(0);
      expect(wallet.metadata.totalWithdrawn).toBe(0);
      expect(wallet.metadata.depositCount).toBe(0);
      expect(wallet.metadata.withdrawalCount).toBe(0);
    });
  });

  describe('Test 2: Deposit webhook updates balance', () => {
    test('Deposit webhook successfully updates wallet balance', async () => {
      // Create wallet first
      const wallet = await createWallet(testProject);

      // Simulate webhook payload
      const webhookPayload = {
        projectId: testProject._id.toString(),
        walletId: wallet._id.toString(),
        amount: 100000,
        transactionId: 'test-txn-123',
        status: 'success',
        currency: 'INR',
      };

      const result = await depositWebhook(webhookPayload);

      expect(result.success).toBe(true);
      expect(result.amount).toBe(100000);

      // Verify wallet balance updated
      const updatedWallet = await Wallet.findById(wallet._id);
      expect(updatedWallet.balance).toBe(100000);
      expect(updatedWallet.metadata.totalDeposited).toBe(100000);
      expect(updatedWallet.metadata.depositCount).toBe(1);
      expect(updatedWallet.status).toBe('active'); // Should change from pending to active
    });

    test('Multiple deposits accumulate correctly', async () => {
      const wallet = await createWallet(testProject);

      // First deposit
      await depositWebhook({
        projectId: testProject._id.toString(),
        amount: 200000,
        status: 'success',
      });

      // Second deposit
      await depositWebhook({
        projectId: testProject._id.toString(),
        amount: 150000,
        status: 'success',
      });

      const updatedWallet = await Wallet.findById(wallet._id);
      expect(updatedWallet.balance).toBe(350000);
      expect(updatedWallet.metadata.totalDeposited).toBe(350000);
      expect(updatedWallet.metadata.depositCount).toBe(2);
    });

    test('Failed deposit status does not update balance', async () => {
      const wallet = await createWallet(testProject);
      const initialBalance = wallet.balance;

      const result = await depositWebhook({
        projectId: testProject._id.toString(),
        amount: 50000,
        status: 'failed',
      });

      expect(result.success).toBe(false);

      const updatedWallet = await Wallet.findById(wallet._id);
      expect(updatedWallet.balance).toBe(initialBalance);
    });
  });

  describe('Test 3: Balance visible in project dashboard', () => {
    test('getBalance returns correct balance for project', async () => {
      // Create wallet and add deposit
      const wallet = await createWallet(testProject);
      await wallet.addDeposit(250000);

      const balanceData = await getBalance(testProject._id.toString());

      expect(balanceData.balance).toBe(250000);
      expect(balanceData.exists).toBe(true);
      expect(balanceData.currency).toBe('INR');
      expect(balanceData.status).toBe('active');
      expect(balanceData.projectId.toString()).toBe(testProject._id.toString());
    });

    test('getBalance returns zero balance if wallet does not exist', async () => {
      // Create a project without wallet
      const projectWithoutWallet = await Project.create({
        name: 'Project Without Wallet',
        client: 'Test Client',
        location: 'Test Location',
        category: 'RESIDENTIAL',
        status: 'IN_PROGRESS',
        architectId: testArchitect._id,
      });

      const balanceData = await getBalance(projectWithoutWallet._id.toString());

      expect(balanceData.balance).toBe(0);
      expect(balanceData.exists).toBe(false);
      expect(balanceData.status).toBe('not_created');
    });

    test('getBalance includes metadata', async () => {
      const wallet = await createWallet(testProject);
      await wallet.addDeposit(100000);
      await wallet.addWithdrawal(20000);

      const balanceData = await getBalance(testProject._id.toString());

      expect(balanceData.metadata).toBeDefined();
      expect(balanceData.metadata.totalDeposited).toBe(100000);
      expect(balanceData.metadata.totalWithdrawn).toBe(20000);
      expect(balanceData.balance).toBe(80000);
    });
  });

  describe('Test 4: Wallet methods work correctly', () => {
    test('addDeposit method increases balance', async () => {
      const wallet = await createWallet(testProject);
      await wallet.addDeposit(50000);

      expect(wallet.balance).toBe(50000);
      expect(wallet.metadata.totalDeposited).toBe(50000);
      expect(wallet.metadata.depositCount).toBe(1);
    });

    test('addWithdrawal method decreases balance', async () => {
      const wallet = await createWallet(testProject);
      await wallet.addDeposit(100000);
      await wallet.addWithdrawal(30000);

      expect(wallet.balance).toBe(70000);
      expect(wallet.metadata.totalWithdrawn).toBe(30000);
      expect(wallet.metadata.withdrawalCount).toBe(1);
    });

    test('addWithdrawal throws error on insufficient balance', async () => {
      const wallet = await createWallet(testProject);
      await wallet.addDeposit(10000);

      await expect(wallet.addWithdrawal(20000)).rejects.toThrow('Insufficient balance');
    });

    test('freeze and unfreeze methods work', async () => {
      const wallet = await createWallet(testProject);
      
      await wallet.freeze();
      expect(wallet.status).toBe('frozen');

      await wallet.unfreeze();
      expect(wallet.status).toBe('active');
    });
  });
});


