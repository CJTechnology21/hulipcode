const mongoose = require('mongoose');
const Task = require('../models/Tasks');
const Project = require('../models/Project');
const User = require('../models/User');
const { validateProofs } = require('../services/taskProofValidation');
const { calculateProjectProgress, updateProjectProgress, calculatePayout } = require('../services/taskProgressService');

describe('Task Manager Module', () => {
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
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test Location',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
    });

    // Create test task
    testTask = await Task.create({
      name: 'Test Task',
      description: 'Test task description',
      projectId: testProject._id,
      assignedTo: testArchitect._id,
      startDate: new Date('2024-01-01'),
      status: 'IN_PROGRESS',
      value: 50000,
      weight_pct: 15,
    });
  });

  afterEach(async () => {
    // Clean up
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Task Model - New Fields', () => {
    test('Task should have value field', () => {
      expect(testTask.value).toBe(50000);
    });

    test('Task should have weight_pct field', () => {
      expect(testTask.weight_pct).toBe(15);
    });

    test('Task should have proofs array', () => {
      expect(Array.isArray(testTask.proofs)).toBe(true);
      expect(testTask.proofs.length).toBe(0);
    });

    test('Task should have rejection_reason field', () => {
      expect(testTask.rejection_reason).toBeUndefined();
    });

    test('Task should accept proofs with GPS and timestamp', async () => {
      const task = await Task.create({
        name: 'Task with Proofs',
        projectId: testProject._id,
        startDate: new Date('2024-01-01'),
        proofs: [
          {
            type: 'photo',
            url: 'https://example.com/photo1.jpg',
            gps: { latitude: 12.9716, longitude: 77.5946 },
            timestamp: new Date('2024-01-02'),
          },
        ],
      });

      expect(task.proofs.length).toBe(1);
      expect(task.proofs[0].gps.latitude).toBe(12.9716);
    });
  });

  describe('Proof Validation', () => {
    test('Should validate task with 3 photos', () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
        {
          type: 'photo',
          url: 'https://example.com/photo2.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
        {
          type: 'photo',
          url: 'https://example.com/photo3.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    test('Should validate task with 1 video', () => {
      const proofs = [
        {
          type: 'video',
          url: 'https://example.com/video1.mp4',
          thumbnail: 'https://example.com/thumb1.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(true);
    });

    test('Should validate task with complete checklist', async () => {
      const task = await Task.create({
        name: 'Task with Checklist',
        projectId: testProject._id,
        startDate: new Date('2024-01-01'),
        checklist: [
          { item: 'Item 1', completed: true },
          { item: 'Item 2', completed: true },
        ],
      });

      const validation = validateProofs(task, []);
      expect(validation.valid).toBe(true);
    });

    test('Should reject task with less than 3 photos', () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('Should reject proof without GPS', () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          timestamp: new Date('2024-01-02'),
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('GPS'))).toBe(true);
    });

    test('Should reject proof with timestamp before task start', () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2023-12-31'), // Before startDate
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('timestamp'))).toBe(true);
    });

    test('Should reject invalid GPS coordinates', () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          gps: { latitude: 200, longitude: 77.5946 }, // Invalid latitude
          timestamp: new Date('2024-01-02'),
        },
      ];

      const validation = validateProofs(testTask, proofs);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('latitude'))).toBe(true);
    });
  });

  describe('Task Submission', () => {
    test('Should submit task with valid proofs', async () => {
      const proofs = [
        {
          type: 'photo',
          url: 'https://example.com/photo1.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
        {
          type: 'photo',
          url: 'https://example.com/photo2.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
        {
          type: 'photo',
          url: 'https://example.com/photo3.jpg',
          gps: { latitude: 12.9716, longitude: 77.5946 },
          timestamp: new Date('2024-01-02'),
        },
      ];

      testTask.proofs = proofs;
      await testTask.save();

      testTask.status = 'REVIEW';
      testTask.submittedAt = new Date();
      await testTask.save();

      expect(testTask.status).toBe('REVIEW');
      expect(testTask.submittedAt).toBeDefined();
    });
  });

  describe('Task Rejection', () => {
    test('Should reject task with reason', async () => {
      testTask.status = 'REVIEW';
      await testTask.save();

      testTask.status = 'REJECTED';
      testTask.rejection_reason = 'Proofs are not clear enough';
      testTask.rejectedAt = new Date();
      await testTask.save();

      expect(testTask.status).toBe('REJECTED');
      expect(testTask.rejection_reason).toBe('Proofs are not clear enough');
      expect(testTask.rejectedAt).toBeDefined();
    });
  });

  describe('Task Approval and Progress Calculation', () => {
    test('Should approve task and update status to DONE', async () => {
      testTask.status = 'REVIEW';
      await testTask.save();

      testTask.status = 'DONE';
      testTask.approvedAt = new Date();
      testTask.progress = 100;
      await testTask.save();

      expect(testTask.status).toBe('DONE');
      expect(testTask.approvedAt).toBeDefined();
      expect(testTask.progress).toBe(100);
    });

    test('Should calculate project progress based on task weights', async () => {
      // Create multiple tasks with different weights
      const task1 = await Task.create({
        name: 'Task 1',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 20,
        value: 20000,
      });

      const task2 = await Task.create({
        name: 'Task 2',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 30,
        value: 30000,
      });

      const task3 = await Task.create({
        name: 'Task 3',
        projectId: testProject._id,
        status: 'IN_PROGRESS',
        weight_pct: 50,
        value: 50000,
      });

      const progressData = await calculateProjectProgress(testProject._id);

      expect(progressData.progress).toBe(50); // 20 + 30 = 50%
      expect(progressData.completedTasks).toBe(2);
      expect(progressData.totalTasks).toBe(3);
      expect(progressData.completedValue).toBe(50000); // 20000 + 30000
      expect(progressData.totalValue).toBe(100000); // 20000 + 30000 + 50000
    });

    test('Should update project progress when task is approved', async () => {
      const task1 = await Task.create({
        name: 'Task 1',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 25,
        value: 25000,
      });

      const task2 = await Task.create({
        name: 'Task 2',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 25,
        value: 25000,
      });

      const result = await updateProjectProgress(testProject._id);

      expect(result.project.progress).toBe(50); // 25 + 25 = 50%
      expect(result.progressData.progress).toBe(50);
    });

    test('Should calculate payout for completed tasks', async () => {
      const task1 = await Task.create({
        name: 'Task 1',
        projectId: testProject._id,
        status: 'DONE',
        value: 30000,
        approvedAt: new Date(),
      });

      const task2 = await Task.create({
        name: 'Task 2',
        projectId: testProject._id,
        status: 'DONE',
        value: 20000,
        approvedAt: new Date(),
      });

      const task3 = await Task.create({
        name: 'Task 3',
        projectId: testProject._id,
        status: 'IN_PROGRESS',
        value: 50000,
      });

      const payout = await calculatePayout(testProject._id);

      expect(payout.totalPayout).toBe(50000); // 30000 + 20000
      expect(payout.projectTotal).toBe(100000); // 30000 + 20000 + 50000
      expect(payout.payoutPercentage).toBe(50); // 50000 / 100000 * 100
      expect(payout.completedTasks).toBe(2);
    });

    test('Should handle progress calculation with no tasks', async () => {
      await Task.deleteMany({ projectId: testProject._id });

      const progressData = await calculateProjectProgress(testProject._id);

      expect(progressData.progress).toBe(0);
      expect(progressData.completedTasks).toBe(0);
      expect(progressData.totalTasks).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('Should handle task with zero weight_pct', async () => {
      const task = await Task.create({
        name: 'Task with zero weight',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 0,
      });

      const progressData = await calculateProjectProgress(testProject._id);
      expect(progressData.progress).toBe(0);
    });

    test('Should cap progress at 100%', async () => {
      const task1 = await Task.create({
        name: 'Task 1',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 60,
      });

      const task2 = await Task.create({
        name: 'Task 2',
        projectId: testProject._id,
        status: 'DONE',
        weight_pct: 50, // Total would be 110%
      });

      const progressData = await calculateProjectProgress(testProject._id);
      expect(progressData.progress).toBeLessThanOrEqual(100);
    });
  });
});





