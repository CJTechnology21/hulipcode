const mongoose = require('mongoose');
const Task = require('../models/Tasks');
const Project = require('../models/Project');
const User = require('../models/User');
const LedgerEntry = require('../models/LedgerEntry');
const {
  createCredit,
  createDebit,
  computePayable,
  calculatePlatformFee,
  calculateWithheld,
  calculatePenalty,
  calculatePayoutBreakdown,
  getLedgerEntries,
  getTotalPaid,
} = require('../services/ledgerService');
const { calculatePayout } = require('../services/taskProgressService');

describe('Financials Module', () => {
  let testArchitect;
  let testClient;
  let testProject;
  let testTask;

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

    // Create test project
    testProject = await Project.create({
      name: 'Test Financial Project',
      client: 'Test Client',
      location: 'Test Location',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
    });

    // Create test task
    testTask = await Task.create({
      name: 'Test Financial Task',
      description: 'Test task for financial calculations',
      projectId: testProject._id,
      assignedTo: testArchitect._id,
      startDate: new Date('2024-01-01'),
      status: 'DONE',
      value: 100000, // ₹100,000
      weight_pct: 20,
    });
  });

  afterEach(async () => {
    // Clean up
    await LedgerEntry.deleteMany({});
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('LedgerEntry Model', () => {
    test('Should create a credit entry', async () => {
      const entry = await LedgerEntry.create({
        projectId: testProject._id,
        taskId: testTask._id,
        entryType: 'CREDIT',
        category: 'TASK_PAYOUT',
        amount: 100000,
        description: 'Test credit entry',
        status: 'PROCESSED',
      });

      expect(entry.entryType).toBe('CREDIT');
      expect(entry.amount).toBe(100000);
      expect(entry.category).toBe('TASK_PAYOUT');
    });

    test('Should create a debit entry', async () => {
      const entry = await LedgerEntry.create({
        projectId: testProject._id,
        taskId: testTask._id,
        entryType: 'DEBIT',
        category: 'PLATFORM_FEE',
        amount: 4000,
        description: 'Test debit entry',
        status: 'PROCESSED',
      });

      expect(entry.entryType).toBe('DEBIT');
      expect(entry.amount).toBe(4000);
      expect(entry.category).toBe('PLATFORM_FEE');
    });
  });

  describe('Ledger Service - createCredit', () => {
    test('Should create a credit entry via service', async () => {
      const credit = await createCredit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'TASK_PAYOUT',
        amount: 100000,
        description: 'Task payout credit',
        createdBy: testArchitect._id,
      });

      expect(credit.entryType).toBe('CREDIT');
      expect(credit.amount).toBe(100000);
      expect(credit.status).toBe('PROCESSED');
    });

    test('Should throw error for invalid credit amount', async () => {
      await expect(
        createCredit({
          projectId: testProject._id,
          category: 'TASK_PAYOUT',
          amount: -100,
          description: 'Invalid credit',
        })
      ).rejects.toThrow();
    });
  });

  describe('Ledger Service - createDebit', () => {
    test('Should create a debit entry via service', async () => {
      const debit = await createDebit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'PLATFORM_FEE',
        amount: 4000,
        description: 'Platform fee debit',
        createdBy: testArchitect._id,
      });

      expect(debit.entryType).toBe('DEBIT');
      expect(debit.amount).toBe(4000);
      expect(debit.status).toBe('PROCESSED');
    });

    test('Should throw error for invalid debit amount', async () => {
      await expect(
        createDebit({
          projectId: testProject._id,
          category: 'PLATFORM_FEE',
          amount: 0,
          description: 'Invalid debit',
        })
      ).rejects.toThrow();
    });
  });

  describe('Ledger Service - computePayable', () => {
    test('Should compute payable amount correctly', () => {
      const result = computePayable(50, 20000, 100000);
      
      expect(result.progress).toBe(50);
      expect(result.earnedAmount).toBe(50000);
      expect(result.previousPaid).toBe(20000);
      expect(result.payableAmount).toBe(30000);
    });

    test('Should return 0 payable if previousPaid exceeds earned', () => {
      const result = computePayable(30, 50000, 100000);
      
      expect(result.earnedAmount).toBe(30000);
      expect(result.payableAmount).toBe(0);
    });

    test('Should throw error for invalid progress', () => {
      expect(() => computePayable(150, 0, 100000)).toThrow();
      expect(() => computePayable(-10, 0, 100000)).toThrow();
    });
  });

  describe('Platform Fee Calculation (4%)', () => {
    test('Should calculate platform fee correctly', () => {
      const result = calculatePlatformFee(100000);
      
      expect(result.feePercent).toBe(4);
      expect(result.grossAmount).toBe(100000);
      expect(result.feeAmount).toBe(4000); // 4% of 100,000
      expect(result.netAfterFee).toBe(96000); // 100,000 - 4,000
    });

    test('Should handle zero amount', () => {
      const result = calculatePlatformFee(0);
      
      expect(result.feeAmount).toBe(0);
      expect(result.netAfterFee).toBe(0);
    });
  });

  describe('Withheld Calculation (15%)', () => {
    test('Should calculate withheld amount correctly', () => {
      const result = calculateWithheld(96000);
      
      expect(result.withheldPercent).toBe(15);
      expect(result.netAmount).toBe(96000);
      expect(result.withheldAmount).toBe(14400); // 15% of 96,000
      expect(result.payableAfterWithheld).toBe(81600); // 96,000 - 14,400
    });

    test('Should handle zero amount', () => {
      const result = calculateWithheld(0);
      
      expect(result.withheldAmount).toBe(0);
      expect(result.payableAfterWithheld).toBe(0);
    });
  });

  describe('Penalty Calculation', () => {
    test('Should calculate penalty correctly', () => {
      const result = calculatePenalty(81600, 'Late delivery', 5);
      
      expect(result.penaltyPercent).toBe(5);
      expect(result.baseAmount).toBe(81600);
      expect(result.penaltyAmount).toBe(4080); // 5% of 81,600
      expect(result.netAfterPenalty).toBe(77520); // 81,600 - 4,080
      expect(result.reason).toBe('Late delivery');
    });

    test('Should handle zero penalty', () => {
      const result = calculatePenalty(81600, '', 0);
      
      expect(result.penaltyAmount).toBe(0);
      expect(result.netAfterPenalty).toBe(81600);
    });
  });

  describe('Complete Payout Breakdown', () => {
    test('Should calculate complete payout breakdown', async () => {
      const result = await calculatePayoutBreakdown({
        grossAmount: 100000,
        progress: 50,
        previousPaid: 20000,
        projectTotal: 200000,
        penaltyPercent: 0,
        penaltyReason: '',
      });

      expect(result.grossAmount).toBe(100000);
      expect(result.platformFee.feeAmount).toBe(4000); // 4% of 100,000
      expect(result.withheld.withheldAmount).toBe(14400); // 15% of 96,000
      expect(result.penalty.penaltyAmount).toBe(0);
      expect(result.deductions.total).toBe(18400); // 4,000 + 14,400
      expect(result.finalPayable).toBe(81600); // 100,000 - 4,000 - 14,400
    });

    test('Should include penalty in breakdown', async () => {
      const result = await calculatePayoutBreakdown({
        grossAmount: 100000,
        progress: 50,
        previousPaid: 20000,
        projectTotal: 200000,
        penaltyPercent: 5,
        penaltyReason: 'Late delivery',
      });

      expect(result.penalty.penaltyAmount).toBe(4080); // 5% of 81,600
      expect(result.deductions.total).toBe(22480); // 4,000 + 14,400 + 4,080
      expect(result.finalPayable).toBe(77520); // 100,000 - 4,000 - 14,400 - 4,080
    });
  });

  describe('Payout Calculation Integration', () => {
    test('Should calculate payout with fees and withheld', async () => {
      const payout = await calculatePayout(testProject._id);

      expect(payout.grossPayout).toBe(100000);
      expect(payout.financials).toBeDefined();
      expect(payout.financials.platformFee.amount).toBe(4000);
      expect(payout.financials.withheld.amount).toBe(14400);
      expect(payout.financials.finalPayable).toBe(81600);
    });

    test('Should calculate payout with penalty', async () => {
      const payout = await calculatePayout(testProject._id, {
        penaltyPercent: 5,
        penaltyReason: 'Late delivery',
      });

      expect(payout.financials.penalty.amount).toBeGreaterThan(0);
      expect(payout.financials.penalty.reason).toBe('Late delivery');
    });
  });

  describe('Ledger Entries Tracking', () => {
    test('Should get ledger entries for project', async () => {
      // Create some ledger entries
      await createCredit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'TASK_PAYOUT',
        amount: 100000,
        description: 'Test credit',
        createdBy: testArchitect._id,
      });

      await createDebit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'PLATFORM_FEE',
        amount: 4000,
        description: 'Test fee',
        createdBy: testArchitect._id,
      });

      const entries = await getLedgerEntries(testProject._id);

      expect(entries.length).toBe(2);
      expect(entries[0].entryType).toBe('DEBIT'); // Most recent first
      expect(entries[1].entryType).toBe('CREDIT');
    });

    test('Should calculate total paid amount', async () => {
      // Create multiple credit entries
      await createCredit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'TASK_PAYOUT',
        amount: 50000,
        description: 'First payout',
        createdBy: testArchitect._id,
      });

      await createCredit({
        projectId: testProject._id,
        taskId: testTask._id,
        category: 'TASK_PAYOUT',
        amount: 30000,
        description: 'Second payout',
        createdBy: testArchitect._id,
      });

      const totalPaid = await getTotalPaid(testProject._id);

      expect(totalPaid).toBe(80000); // 50,000 + 30,000
    });

    test('Should filter ledger entries by category', async () => {
      await createCredit({
        projectId: testProject._id,
        category: 'TASK_PAYOUT',
        amount: 100000,
        description: 'Payout',
        createdBy: testArchitect._id,
      });

      await createDebit({
        projectId: testProject._id,
        category: 'PLATFORM_FEE',
        amount: 4000,
        description: 'Fee',
        createdBy: testArchitect._id,
      });

      const feeEntries = await getLedgerEntries(testProject._id, {
        category: 'PLATFORM_FEE',
      });

      expect(feeEntries.length).toBe(1);
      expect(feeEntries[0].category).toBe('PLATFORM_FEE');
    });
  });

  describe('End-to-End Financial Flow', () => {
    test('Should create all ledger entries when task is approved', async () => {
      // Create a task in REVIEW status
      const reviewTask = await Task.create({
        name: 'Review Task',
        projectId: testProject._id,
        status: 'REVIEW',
        value: 100000,
        startDate: new Date('2024-01-01'),
      });

      // Simulate approval process
      const payout = await calculatePayout(testProject._id);
      
      // Create ledger entries
      if (payout.financials) {
        await createCredit({
          projectId: testProject._id,
          taskId: reviewTask._id,
          category: 'TASK_PAYOUT',
          amount: reviewTask.value,
          description: `Task payout: ${reviewTask.name}`,
          createdBy: testArchitect._id,
        });

        await createDebit({
          projectId: testProject._id,
          taskId: reviewTask._id,
          category: 'PLATFORM_FEE',
          amount: payout.financials.platformFee.amount,
          description: 'Platform fee',
          createdBy: testArchitect._id,
        });

        await createDebit({
          projectId: testProject._id,
          taskId: reviewTask._id,
          category: 'WITHHELD',
          amount: payout.financials.withheld.amount,
          description: 'Withheld amount',
          createdBy: testArchitect._id,
        });
      }

      const entries = await getLedgerEntries(testProject._id);
      
      // Should have at least 3 entries (1 credit + 2 debits)
      expect(entries.length).toBeGreaterThanOrEqual(3);
      
      const creditEntries = entries.filter(e => e.entryType === 'CREDIT');
      const debitEntries = entries.filter(e => e.entryType === 'DEBIT');
      
      expect(creditEntries.length).toBeGreaterThanOrEqual(1);
      expect(debitEntries.length).toBeGreaterThanOrEqual(2);
    });
  });
});

