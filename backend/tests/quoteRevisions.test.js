const mongoose = require('mongoose');
const Quote = require('../models/Quote');
const Project = require('../models/Project');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Task = require('../models/Tasks');
const LedgerEntry = require('../models/LedgerEntry');
const {
  createRevision,
  checkTopUpRequired,
  checkUnderPayment,
  checkContractSigningBlock,
  getOriginalQuote,
  getQuoteRevisions,
  calculateQuoteTotal,
} = require('../services/quoteRevisionService');

describe('Quote Revisions Module', () => {
  let testArchitect;
  let testClient;
  let testLead;
  let originalQuote;
  let testProject;

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
      budget: 500000,
      contact: '1234567890',
      category: 'RESIDENTIAL',
      city: 'Test City',
      assigned: testClient._id,
    });

    // Create original quote with summary
    originalQuote = await Quote.create({
      leadId: testLead._id,
      quoteAmount: 500000,
      assigned: [testArchitect._id],
      status: 'Approved',
      summary: [
        {
          space: 'Living Room',
          amount: 200000,
          tax: 36000,
          items: 10,
          workPackages: 2,
        },
        {
          space: 'Kitchen',
          amount: 300000,
          tax: 54000,
          items: 15,
          workPackages: 3,
        },
      ],
    });

    // Create test project
    testProject = await Project.create({
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test City',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
      quoteId: originalQuote._id,
    });
  });

  afterEach(async () => {
    // Clean up
    await LedgerEntry.deleteMany({});
    await Task.deleteMany({});
    await Quote.deleteMany({});
    await Project.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Quote Model - parent_quote_id field', () => {
    test('Should have parent_quote_id field', () => {
      expect(originalQuote.parent_quote_id).toBeUndefined();
      expect(originalQuote.isRevision).toBe(false);
      expect(originalQuote.revisionNumber).toBe(0);
    });

    test('Should accept parent_quote_id in revision', async () => {
      const revision = await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        quoteAmount: 550000,
        assigned: [testArchitect._id],
      });

      expect(revision.parent_quote_id.toString()).toBe(originalQuote._id.toString());
      expect(revision.isRevision).toBe(true);
      expect(revision.revisionNumber).toBe(1);
    });
  });

  describe('calculateQuoteTotal', () => {
    test('Should calculate total from summary', () => {
      const total = calculateQuoteTotal(originalQuote);
      // 200000 + 36000 + 300000 + 54000 = 590000
      expect(total).toBe(590000);
    });

    test('Should use quoteAmount if no summary', () => {
      const quoteWithoutSummary = {
        quoteAmount: 500000,
        summary: [],
      };
      const total = calculateQuoteTotal(quoteWithoutSummary);
      expect(total).toBe(500000);
    });
  });

  describe('getOriginalQuote', () => {
    test('Should return original quote for non-revision', async () => {
      const original = await getOriginalQuote(originalQuote._id);
      expect(original._id.toString()).toBe(originalQuote._id.toString());
    });

    test('Should return original quote for revision', async () => {
      const revision = await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        quoteAmount: 550000,
      });

      const original = await getOriginalQuote(revision._id);
      expect(original._id.toString()).toBe(originalQuote._id.toString());
    });
  });

  describe('checkTopUpRequired', () => {
    test('Should detect top-up required when revised > original', () => {
      const revisedQuote = {
        summary: [
          {
            space: 'Living Room',
            amount: 250000, // Increased
            tax: 45000,
          },
          {
            space: 'Kitchen',
            amount: 300000,
            tax: 54000,
          },
        ],
      };

      const result = checkTopUpRequired(originalQuote, revisedQuote);
      expect(result.requiresTopUp).toBe(true);
      expect(result.topUpAmount).toBeGreaterThan(0);
    });

    test('Should not require top-up when revised <= original', () => {
      const revisedQuote = {
        summary: [
          {
            space: 'Living Room',
            amount: 150000, // Decreased
            tax: 27000,
          },
          {
            space: 'Kitchen',
            amount: 300000,
            tax: 54000,
          },
        ],
      };

      const result = checkTopUpRequired(originalQuote, revisedQuote);
      expect(result.requiresTopUp).toBe(false);
      expect(result.topUpAmount).toBe(0);
    });
  });

  describe('checkUnderPayment', () => {
    test('Should detect under-payment when revised < previous payouts', async () => {
      // Create ledger entries for payouts
      await LedgerEntry.create({
        projectId: testProject._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 300000,
        description: 'Task payout',
        status: 'PROCESSED',
      });

      const revisedQuote = {
        summary: [
          {
            space: 'Living Room',
            amount: 100000, // Much less than payouts
            tax: 18000,
          },
        ],
      };

      const result = await checkUnderPayment(testProject._id, revisedQuote);
      expect(result.requiresAdminReview).toBe(true);
      expect(result.shortfallAmount).toBeGreaterThan(0);
    });

    test('Should not require admin review when revised >= previous payouts', async () => {
      await LedgerEntry.create({
        projectId: testProject._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 200000,
        description: 'Task payout',
        status: 'PROCESSED',
      });

      const revisedQuote = {
        summary: [
          {
            space: 'Living Room',
            amount: 250000,
            tax: 45000,
          },
        ],
      };

      const result = await checkUnderPayment(testProject._id, revisedQuote);
      expect(result.requiresAdminReview).toBe(false);
    });
  });

  describe('checkContractSigningBlock', () => {
    test('Should block contract signing when top-up required', async () => {
      const revision = await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        requiresTopUp: true,
        quoteAmount: 650000,
        summary: [
          {
            space: 'Living Room',
            amount: 300000,
            tax: 54000,
          },
          {
            space: 'Kitchen',
            amount: 300000,
            tax: 54000,
          },
        ],
      });

      const result = await checkContractSigningBlock(revision);
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('TOP_UP_REQUIRED');
      expect(result.canSign).toBe(false);
    });

    test('Should block contract signing when admin review required', async () => {
      // Create payouts
      await LedgerEntry.create({
        projectId: testProject._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 400000,
        description: 'Task payout',
        status: 'PROCESSED',
      });

      const revision = await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        requiresAdminReview: true,
        quoteAmount: 300000,
        summary: [
          {
            space: 'Living Room',
            amount: 150000,
            tax: 27000,
          },
        ],
      });

      const result = await checkContractSigningBlock(revision);
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('ADMIN_REVIEW_REQUIRED');
      expect(result.canSign).toBe(false);
    });

    test('Should allow contract signing for original quote', async () => {
      const result = await checkContractSigningBlock(originalQuote);
      expect(result.blocked).toBe(false);
      expect(result.canSign).toBe(true);
    });

    test('Should allow contract signing for valid revision', async () => {
      const revision = await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        quoteAmount: 550000,
        summary: [
          {
            space: 'Living Room',
            amount: 200000,
            tax: 36000,
          },
          {
            space: 'Kitchen',
            amount: 300000,
            tax: 54000,
          },
        ],
      });

      const result = await checkContractSigningBlock(revision);
      expect(result.blocked).toBe(false);
      expect(result.canSign).toBe(true);
    });
  });

  describe('createRevision', () => {
    test('Should create revision successfully', async () => {
      const revisionData = {
        assigned: [testArchitect._id],
        summary: [
          {
            space: 'Living Room',
            amount: 220000,
            tax: 39600,
            items: 12,
            workPackages: 2,
          },
          {
            space: 'Kitchen',
            amount: 300000,
            tax: 54000,
            items: 15,
            workPackages: 3,
          },
        ],
      };

      const result = await createRevision(originalQuote._id, revisionData);

      expect(result.revision).toBeDefined();
      expect(result.revision.isRevision).toBe(true);
      expect(result.revision.revisionNumber).toBe(1);
      expect(result.revision.parent_quote_id.toString()).toBe(originalQuote._id.toString());
      expect(result.originalQuote._id.toString()).toBe(originalQuote._id.toString());
    });

    test('Should set requiresTopUp flag when revision increases total', async () => {
      const revisionData = {
        assigned: [testArchitect._id],
        summary: [
          {
            space: 'Living Room',
            amount: 300000, // Increased
            tax: 54000,
          },
          {
            space: 'Kitchen',
            amount: 350000, // Increased
            tax: 63000,
          },
        ],
      };

      const result = await createRevision(originalQuote._id, revisionData);

      expect(result.revision.requiresTopUp).toBe(true);
      expect(result.topUpCheck.requiresTopUp).toBe(true);
      expect(result.canSignContract).toBe(false);
    });

    test('Should set requiresAdminReview flag when revision decreases below payouts', async () => {
      // Create payouts first
      await LedgerEntry.create({
        projectId: testProject._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 300000,
        description: 'Task payout',
        status: 'PROCESSED',
      });

      const revisionData = {
        assigned: [testArchitect._id],
        summary: [
          {
            space: 'Living Room',
            amount: 100000, // Much less than payouts
            tax: 18000,
          },
        ],
      };

      const result = await createRevision(originalQuote._id, revisionData);

      expect(result.revision.requiresAdminReview).toBe(true);
      expect(result.underPaymentCheck.requiresAdminReview).toBe(true);
      expect(result.canSignContract).toBe(false);
    });

    test('Should increment revision number correctly', async () => {
      // Create first revision
      const revision1Data = {
        assigned: [testArchitect._id],
        summary: originalQuote.summary,
      };
      const result1 = await createRevision(originalQuote._id, revision1Data);
      expect(result1.revision.revisionNumber).toBe(1);

      // Create second revision
      const revision2Data = {
        assigned: [testArchitect._id],
        summary: originalQuote.summary,
      };
      const result2 = await createRevision(originalQuote._id, revision2Data);
      expect(result2.revision.revisionNumber).toBe(2);
    });
  });

  describe('getQuoteRevisions', () => {
    test('Should get all revisions of a quote', async () => {
      // Create revisions
      await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 1,
        quoteAmount: 550000,
      });

      await Quote.create({
        leadId: testLead._id,
        parent_quote_id: originalQuote._id,
        isRevision: true,
        revisionNumber: 2,
        quoteAmount: 600000,
      });

      const revisions = await getQuoteRevisions(originalQuote._id);
      expect(revisions.length).toBe(2);
      expect(revisions[0].revisionNumber).toBe(1);
      expect(revisions[1].revisionNumber).toBe(2);
    });
  });

  describe('End-to-End Revision Flow', () => {
    test('Should handle complete revision flow with top-up', async () => {
      // 1. Create revision with increased amount
      const revisionData = {
        assigned: [testArchitect._id],
        summary: [
          {
            space: 'Living Room',
            amount: 300000,
            tax: 54000,
          },
          {
            space: 'Kitchen',
            amount: 350000,
            tax: 63000,
          },
        ],
      };

      const result = await createRevision(originalQuote._id, revisionData);

      // 2. Verify revision created
      expect(result.revision.requiresTopUp).toBe(true);

      // 3. Check contract signing block
      const blockCheck = await checkContractSigningBlock(result.revision);
      expect(blockCheck.blocked).toBe(true);
      expect(blockCheck.reason).toBe('TOP_UP_REQUIRED');
    });

    test('Should handle revision flow with under-payment', async () => {
      // 1. Create payouts
      await LedgerEntry.create({
        projectId: testProject._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 400000,
        description: 'Task payout',
        status: 'PROCESSED',
      });

      // 2. Create revision with decreased amount
      const revisionData = {
        assigned: [testArchitect._id],
        summary: [
          {
            space: 'Living Room',
            amount: 150000,
            tax: 27000,
          },
        ],
      };

      const result = await createRevision(originalQuote._id, revisionData);

      // 3. Verify admin review required
      expect(result.revision.requiresAdminReview).toBe(true);

      // 4. Check contract signing block
      const blockCheck = await checkContractSigningBlock(result.revision);
      expect(blockCheck.blocked).toBe(true);
      expect(blockCheck.reason).toBe('ADMIN_REVIEW_REQUIRED');
    });
  });
});

