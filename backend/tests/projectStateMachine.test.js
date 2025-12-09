const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const {
  PROJECT_STATES,
  canTransition,
  getValidNextStates,
  validateTransition,
  isTerminalState,
  getInitialState,
  getStateForQuoteProject,
} = require('../services/projectStateMachine');

describe('Project State Machine', () => {
  let testArchitect;
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
    // Create test architect
    testArchitect = await User.create({
      name: 'Test Architect',
      email: `architect${Date.now()}@test.com`,
      password: 'password123',
      role: 'architect',
    });

    // Create test project with initial state
    testProject = await Project.create({
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test Location',
      category: 'RESIDENTIAL',
      status: getInitialState(),
      architectId: testArchitect._id,
    });
  });

  afterEach(async () => {
    // Clean up
    await Project.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('State Transitions - Allowed', () => {
    test('NEW → BRIEFED should be allowed', () => {
      const result = canTransition(PROJECT_STATES.NEW, PROJECT_STATES.BRIEFED);
      expect(result.valid).toBe(true);
    });

    test('BRIEFED → QUOTED should be allowed', () => {
      const result = canTransition(PROJECT_STATES.BRIEFED, PROJECT_STATES.QUOTED);
      expect(result.valid).toBe(true);
    });

    test('QUOTED → CONTRACT_PENDING should be allowed', () => {
      const result = canTransition(PROJECT_STATES.QUOTED, PROJECT_STATES.CONTRACT_PENDING);
      expect(result.valid).toBe(true);
    });

    test('CONTRACT_PENDING → CONTRACT_SIGNED should be allowed', () => {
      const result = canTransition(PROJECT_STATES.CONTRACT_PENDING, PROJECT_STATES.CONTRACT_SIGNED);
      expect(result.valid).toBe(true);
    });

    test('CONTRACT_SIGNED → READY_TO_START should be allowed', () => {
      const result = canTransition(PROJECT_STATES.CONTRACT_SIGNED, PROJECT_STATES.READY_TO_START);
      expect(result.valid).toBe(true);
    });

    test('READY_TO_START → IN_PROGRESS should be allowed', () => {
      const result = canTransition(PROJECT_STATES.READY_TO_START, PROJECT_STATES.IN_PROGRESS);
      expect(result.valid).toBe(true);
    });

    test('IN_PROGRESS → QA should be allowed', () => {
      const result = canTransition(PROJECT_STATES.IN_PROGRESS, PROJECT_STATES.QA);
      expect(result.valid).toBe(true);
    });

    test('QA → COMPLETED should be allowed', () => {
      const result = canTransition(PROJECT_STATES.QA, PROJECT_STATES.COMPLETED);
      expect(result.valid).toBe(true);
    });

    test('COMPLETED → CLOSED should be allowed', () => {
      const result = canTransition(PROJECT_STATES.COMPLETED, PROJECT_STATES.CLOSED);
      expect(result.valid).toBe(true);
    });

    test('Same state transition should be allowed (no-op)', () => {
      const result = canTransition(PROJECT_STATES.NEW, PROJECT_STATES.NEW);
      expect(result.valid).toBe(true);
    });
  });

  describe('State Transitions - Blocked Invalid', () => {
    test('NEW → QUOTED should be blocked (must go through BRIEFED)', () => {
      const result = canTransition(PROJECT_STATES.NEW, PROJECT_STATES.QUOTED);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Cannot transition');
    });

    test('NEW → COMPLETED should be blocked', () => {
      const result = canTransition(PROJECT_STATES.NEW, PROJECT_STATES.COMPLETED);
      expect(result.valid).toBe(false);
    });

    test('BRIEFED → NEW should be blocked (no backward transition)', () => {
      const result = canTransition(PROJECT_STATES.BRIEFED, PROJECT_STATES.NEW);
      expect(result.valid).toBe(false);
    });

    test('IN_PROGRESS → NEW should be blocked', () => {
      const result = canTransition(PROJECT_STATES.IN_PROGRESS, PROJECT_STATES.NEW);
      expect(result.valid).toBe(false);
    });

    test('CLOSED → any state should be blocked (terminal state)', () => {
      const result = canTransition(PROJECT_STATES.CLOSED, PROJECT_STATES.NEW);
      expect(result.valid).toBe(false);
    });

    test('Invalid state should be rejected', () => {
      const result = canTransition(PROJECT_STATES.NEW, 'INVALID_STATE');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Invalid target state');
    });
  });

  describe('getValidNextStates', () => {
    test('Should return valid next states for NEW', () => {
      const nextStates = getValidNextStates(PROJECT_STATES.NEW);
      expect(nextStates).toEqual([PROJECT_STATES.BRIEFED]);
    });

    test('Should return valid next states for IN_PROGRESS', () => {
      const nextStates = getValidNextStates(PROJECT_STATES.IN_PROGRESS);
      expect(nextStates).toContain(PROJECT_STATES.QA);
      expect(nextStates).toContain(PROJECT_STATES.READY_TO_START);
    });

    test('Should return empty array for CLOSED (terminal state)', () => {
      const nextStates = getValidNextStates(PROJECT_STATES.CLOSED);
      expect(nextStates).toEqual([]);
    });
  });

  describe('validateTransition with Project Document', () => {
    test('Should validate allowed transition', async () => {
      testProject.status = PROJECT_STATES.NEW;
      await testProject.save();

      const validation = validateTransition(testProject, PROJECT_STATES.BRIEFED);
      expect(validation.success).toBe(true);
      expect(validation.validTransition).toBe(true);
    });

    test('Should reject invalid transition', async () => {
      testProject.status = PROJECT_STATES.NEW;
      await testProject.save();

      const validation = validateTransition(testProject, PROJECT_STATES.COMPLETED);
      expect(validation.success).toBe(false);
      expect(validation.validTransition).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('Helper Functions', () => {
    test('isTerminalState should return true for CLOSED', () => {
      expect(isTerminalState(PROJECT_STATES.CLOSED)).toBe(true);
    });

    test('isTerminalState should return false for other states', () => {
      expect(isTerminalState(PROJECT_STATES.NEW)).toBe(false);
      expect(isTerminalState(PROJECT_STATES.IN_PROGRESS)).toBe(false);
    });

    test('getInitialState should return NEW', () => {
      expect(getInitialState()).toBe(PROJECT_STATES.NEW);
    });

    test('getStateForQuoteProject should return CONTRACT_SIGNED', () => {
      expect(getStateForQuoteProject()).toBe(PROJECT_STATES.CONTRACT_SIGNED);
    });
  });

  describe('Full State Machine Flow', () => {
    test('Complete flow from NEW to CLOSED should work', async () => {
      const states = [
        PROJECT_STATES.NEW,
        PROJECT_STATES.BRIEFED,
        PROJECT_STATES.QUOTED,
        PROJECT_STATES.CONTRACT_PENDING,
        PROJECT_STATES.CONTRACT_SIGNED,
        PROJECT_STATES.READY_TO_START,
        PROJECT_STATES.IN_PROGRESS,
        PROJECT_STATES.QA,
        PROJECT_STATES.COMPLETED,
        PROJECT_STATES.CLOSED,
      ];

      for (let i = 0; i < states.length - 1; i++) {
        const currentState = states[i];
        const nextState = states[i + 1];
        
        testProject.status = currentState;
        await testProject.save();

        const validation = validateTransition(testProject, nextState);
        expect(validation.success).toBe(true);
        expect(validation.validTransition).toBe(true);
      }
    });
  });
});





