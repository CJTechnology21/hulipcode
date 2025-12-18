const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Tasks');
const Lead = require('../models/Lead');
const RFQ = require('../models/RFQ');
const {
  sendNotification,
  notifyTaskSubmitted,
  notifyTaskApproved,
  notifyTaskRejected,
  notifyEscrowDepositReceived,
  notifyRFQResponse,
  NOTIFICATION_EVENTS,
  CHANNELS,
} = require('../services/notificationService');
const emailAdapter = require('../services/adapters/emailAdapter');
const smsAdapter = require('../services/adapters/smsAdapter');
const pushAdapter = require('../services/adapters/pushAdapter');

describe('Notifications Module', () => {
  let testArchitect;
  let testClient;
  let testProject;
  let testTask;
  let testLead;

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
    // Track adapter calls (simple spy pattern)
    emailAdapter._callCount = 0;
    emailAdapter._lastCall = null;
    smsAdapter._callCount = 0;
    smsAdapter._lastCall = null;
    pushAdapter._callCount = 0;
    pushAdapter._lastCall = null;

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

    // Create test project
    testProject = await Project.create({
      name: 'Test Project',
      client: 'Test Client',
      location: 'Test City',
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
      status: 'REVIEW',
      value: 100000,
      weight_pct: 20,
    });
  });

  afterEach(async () => {
    // Clean up
    await Task.deleteMany({});
    await Project.deleteMany({});
    await Lead.deleteMany({});
    await RFQ.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Email Adapter', () => {
    test('Should call email adapter when sending email notification', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: {
          email: 'test@example.com',
        },
        data: {
          taskName: 'Test Task',
        },
        channels: [CHANNELS.EMAIL],
      });

      expect(emailAdapter._callCount).toBe(1);
      expect(emailAdapter._lastCall.to).toBe('test@example.com');
      expect(emailAdapter._lastCall.subject).toBeDefined();
      expect(emailAdapter._lastCall.body).toBeDefined();

      // Restore original
      emailAdapter.send = originalSend;
    });

    test('Should not call email adapter if email not provided', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: {},
        data: {},
        channels: [CHANNELS.EMAIL],
      });

      expect(emailAdapter._callCount).toBe(0);

      // Restore original
      emailAdapter.send = originalSend;
    });
  });

  describe('SMS Adapter', () => {
    test('Should call SMS adapter when sending SMS notification', async () => {
      const originalSend = smsAdapter.send;
      smsAdapter.send = async (params) => {
        smsAdapter._callCount++;
        smsAdapter._lastCall = params;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_APPROVED,
        recipient: {
          phone: '+911234567890',
        },
        data: {
          taskName: 'Test Task',
        },
        channels: [CHANNELS.SMS],
      });

      expect(smsAdapter._callCount).toBe(1);
      expect(smsAdapter._lastCall.to).toBe('+911234567890');
      expect(smsAdapter._lastCall.message).toBeDefined();

      // Restore original
      smsAdapter.send = originalSend;
    });

    test('Should not call SMS adapter if phone not provided', async () => {
      const originalSend = smsAdapter.send;
      smsAdapter.send = async (params) => {
        smsAdapter._callCount++;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_APPROVED,
        recipient: {},
        data: {},
        channels: [CHANNELS.SMS],
      });

      expect(smsAdapter._callCount).toBe(0);

      // Restore original
      smsAdapter.send = originalSend;
    });
  });

  describe('Push Adapter', () => {
    test('Should call push adapter when sending push notification', async () => {
      const originalSend = pushAdapter.send;
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        pushAdapter._lastCall = params;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_REJECTED,
        recipient: {
          pushToken: 'fcm-token-123',
        },
        data: {
          taskName: 'Test Task',
        },
        channels: [CHANNELS.PUSH],
      });

      expect(pushAdapter._callCount).toBe(1);
      expect(pushAdapter._lastCall.token).toBe('fcm-token-123');
      expect(pushAdapter._lastCall.title).toBeDefined();
      expect(pushAdapter._lastCall.body).toBeDefined();

      // Restore original
      pushAdapter.send = originalSend;
    });

    test('Should not call push adapter if token not provided', async () => {
      const originalSend = pushAdapter.send;
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_REJECTED,
        recipient: {},
        data: {},
        channels: [CHANNELS.PUSH],
      });

      expect(pushAdapter._callCount).toBe(0);

      // Restore original
      pushAdapter.send = originalSend;
    });
  });

  describe('Task Submitted Notification', () => {
    test('Should trigger notification when task is submitted', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalEmailSend(params);
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        pushAdapter._lastCall = params;
        return originalPushSend(params);
      };

      const result = await notifyTaskSubmitted({
        task: testTask,
        project: testProject,
        submittedBy: testArchitect,
        recipient: {
          email: testArchitect.email,
          pushToken: 'fcm-token-123',
        },
      });

      expect(result.eventType).toBe(NOTIFICATION_EVENTS.TASK_SUBMITTED);
      expect(emailAdapter._callCount).toBeGreaterThan(0);
      expect(pushAdapter._callCount).toBeGreaterThan(0);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      pushAdapter.send = originalPushSend;
    });

    test('Should include task and project data in notification', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async (params) => {
        emailAdapter._lastCall = params;
        return originalSend(params);
      };

      await notifyTaskSubmitted({
        task: testTask,
        project: testProject,
        submittedBy: testArchitect,
        recipient: {
          email: testArchitect.email,
        },
      });

      expect(emailAdapter._lastCall.data.taskName).toBe(testTask.name);
      expect(emailAdapter._lastCall.data.projectName).toBe(testProject.name);

      // Restore original
      emailAdapter.send = originalSend;
    });
  });

  describe('Task Approved Notification', () => {
    test('Should trigger notification when task is approved', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalEmailSend(params);
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalPushSend(params);
      };

      const payoutData = {
        financials: {
          finalPayable: 81600,
        },
      };

      const result = await notifyTaskApproved({
        task: testTask,
        project: testProject,
        approvedBy: testArchitect,
        payout: payoutData,
        recipient: {
          email: testArchitect.email,
          pushToken: 'fcm-token-123',
        },
      });

      expect(result.eventType).toBe(NOTIFICATION_EVENTS.TASK_APPROVED);
      expect(emailAdapter._callCount).toBeGreaterThan(0);
      expect(pushAdapter._callCount).toBeGreaterThan(0);
      expect(emailAdapter._lastCall.data.finalPayable).toBe(81600);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      pushAdapter.send = originalPushSend;
    });
  });

  describe('Task Rejected Notification', () => {
    test('Should trigger notification when task is rejected', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalEmailSend(params);
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalPushSend(params);
      };

      const rejectionReason = 'Proofs are not clear enough';

      const result = await notifyTaskRejected({
        task: testTask,
        project: testProject,
        rejectedBy: testArchitect,
        rejectionReason,
        recipient: {
          email: testArchitect.email,
          pushToken: 'fcm-token-123',
        },
      });

      expect(result.eventType).toBe(NOTIFICATION_EVENTS.TASK_REJECTED);
      expect(emailAdapter._callCount).toBeGreaterThan(0);
      expect(pushAdapter._callCount).toBeGreaterThan(0);
      expect(emailAdapter._lastCall.data.rejectionReason).toBe(rejectionReason);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      pushAdapter.send = originalPushSend;
    });
  });

  describe('Escrow Deposit Received Notification', () => {
    test('Should trigger notification when escrow deposit is received', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalSmsSend = smsAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalEmailSend(params);
      };
      
      smsAdapter.send = async (params) => {
        smsAdapter._callCount++;
        smsAdapter._lastCall = params;
        return originalSmsSend(params);
      };

      const result = await notifyEscrowDepositReceived({
        project: testProject,
        amount: 500000,
        depositedBy: testClient,
        recipient: {
          email: testArchitect.email,
          phone: '+911234567890',
        },
      });

      expect(result.eventType).toBe(NOTIFICATION_EVENTS.ESCROW_DEPOSIT_RECEIVED);
      expect(emailAdapter._callCount).toBeGreaterThan(0);
      expect(smsAdapter._callCount).toBeGreaterThan(0);
      expect(emailAdapter._lastCall.data.amount).toBe(500000);
      expect(emailAdapter._lastCall.data.projectName).toBe(testProject.name);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      smsAdapter.send = originalSmsSend;
    });
  });

  describe('RFQ Response Notification', () => {
    test('Should trigger notification when RFQ response is received', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        emailAdapter._lastCall = params;
        return originalEmailSend(params);
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalPushSend(params);
      };

      const rfq = { name: 'RFQ-001', _id: 'rfq-id-123' };
      const supplier = testClient;
      const totalAmount = 100000;

      const result = await notifyRFQResponse({
        rfq,
        supplier,
        totalAmount,
        recipient: {
          email: testArchitect.email,
          pushToken: 'fcm-token-123',
        },
      });

      expect(result.eventType).toBe(NOTIFICATION_EVENTS.RFQ_RESPONSE);
      expect(emailAdapter._callCount).toBeGreaterThan(0);
      expect(pushAdapter._callCount).toBeGreaterThan(0);
      expect(emailAdapter._lastCall.data.totalAmount).toBe(totalAmount);
      expect(emailAdapter._lastCall.data.supplierName).toBe(supplier.name);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      pushAdapter.send = originalPushSend;
    });
  });

  describe('Multiple Channels', () => {
    test('Should send via multiple channels simultaneously', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalSmsSend = smsAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async (params) => {
        emailAdapter._callCount++;
        return originalEmailSend(params);
      };
      
      smsAdapter.send = async (params) => {
        smsAdapter._callCount++;
        return originalSmsSend(params);
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalPushSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: {
          email: 'test@example.com',
          phone: '+911234567890',
          pushToken: 'fcm-token-123',
        },
        data: {},
        channels: [CHANNELS.EMAIL, CHANNELS.SMS, CHANNELS.PUSH],
      });

      expect(emailAdapter._callCount).toBe(1);
      expect(smsAdapter._callCount).toBe(1);
      expect(pushAdapter._callCount).toBe(1);

      // Restore originals
      emailAdapter.send = originalEmailSend;
      smsAdapter.send = originalSmsSend;
      pushAdapter.send = originalPushSend;
    });
  });

  describe('Error Handling', () => {
    test('Should handle adapter errors gracefully', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async () => {
        throw new Error('Email service unavailable');
      };

      const result = await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: {
          email: 'test@example.com',
        },
        data: {},
        channels: [CHANNELS.EMAIL],
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('email');

      // Restore original
      emailAdapter.send = originalSend;
    });

    test('Should continue with other channels if one fails', async () => {
      const originalEmailSend = emailAdapter.send;
      const originalPushSend = pushAdapter.send;
      
      emailAdapter.send = async () => {
        throw new Error('Email failed');
      };
      
      pushAdapter.send = async (params) => {
        pushAdapter._callCount++;
        return originalPushSend(params);
      };

      const result = await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: {
          email: 'test@example.com',
          pushToken: 'fcm-token-123',
        },
        data: {},
        channels: [CHANNELS.EMAIL, CHANNELS.PUSH],
      });

      expect(result.success).toBe(false); // Overall success is false due to email failure
      expect(result.channels.push).toBeDefined(); // Push succeeded
      expect(result.errors.length).toBeGreaterThan(0); // Email error recorded

      // Restore originals
      emailAdapter.send = originalEmailSend;
      pushAdapter.send = originalPushSend;
    });
  });

  describe('Notification Content Generation', () => {
    test('Should generate correct content for task_submitted event', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async (params) => {
        emailAdapter._lastCall = params;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.TASK_SUBMITTED,
        recipient: { email: 'test@example.com' },
        data: {
          taskName: 'Install Windows',
          projectName: 'Test Project',
          submittedBy: 'John Doe',
        },
        channels: [CHANNELS.EMAIL],
      });

      expect(emailAdapter._lastCall.subject).toBe('Task Submitted for Review');
      expect(emailAdapter._lastCall.body).toContain('Install Windows');
      expect(emailAdapter._lastCall.html).toContain('Test Project');

      // Restore original
      emailAdapter.send = originalSend;
    });

    test('Should generate correct content for escrow_deposit_received event', async () => {
      const originalSend = emailAdapter.send;
      emailAdapter.send = async (params) => {
        emailAdapter._lastCall = params;
        return originalSend(params);
      };

      await sendNotification({
        eventType: NOTIFICATION_EVENTS.ESCROW_DEPOSIT_RECEIVED,
        recipient: { email: 'test@example.com' },
        data: {
          projectName: 'Test Project',
          amount: 500000,
          depositedBy: 'Client Name',
        },
        channels: [CHANNELS.EMAIL],
      });

      expect(emailAdapter._lastCall.subject).toBe('Escrow Deposit Received');
      expect(emailAdapter._lastCall.body).toContain('500,000');
      expect(emailAdapter._lastCall.html).toContain('Test Project');

      // Restore original
      emailAdapter.send = originalSend;
    });
  });
});

