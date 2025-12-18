/**
 * Security Module Tests
 * Tests for encryption and audit logging
 */

const mongoose = require('mongoose');
const {
  encrypt,
  decrypt,
  encryptEmail,
  decryptEmail,
  encryptPhone,
  decryptPhone,
  isEncrypted,
  generateEncryptionKey,
} = require('../utils/encryption');
const AuditLog = require('../models/AuditLog');
const {
  createAuditLog,
  logContractSigning,
  logPayoutRelease,
  logContractRejection,
  logPayoutCancellation,
} = require('../services/auditService');
const Contract = require('../models/Contract');
const Wallet = require('../models/Wallet');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const User = require('../models/User');

describe('Security Module - Encryption & Audit Logging', () => {
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
      balance: 100000,
      status: 'active',
    });

    // Create test contract
    testContract = await Contract.create({
      quoteId: testQuote._id,
      projectId: testProject._id,
      version_number: 1,
      leegalityDocumentId: 'leegality_doc_test_123',
      status: 'pending_signature',
    });
  });

  afterEach(async () => {
    // Clean up
    await AuditLog.deleteMany({});
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

  describe('Encryption Utility', () => {
    test('Should encrypt and decrypt string values', () => {
      const plaintext = 'test@example.com';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':'); // Encrypted format has colons
      expect(decrypted).toBe(plaintext);
    });

    test('Should encrypt email addresses', () => {
      const email = 'user@example.com';
      const encrypted = encryptEmail(email);
      const decrypted = decryptEmail(encrypted);

      expect(encrypted).not.toBe(email);
      expect(decrypted).toBe(email.toLowerCase().trim());
    });

    test('Should encrypt phone numbers', () => {
      const phone = '1234567890';
      const encrypted = encryptPhone(phone);
      const decrypted = decryptPhone(encrypted);

      expect(encrypted).not.toBe(phone);
      expect(decrypted).toBe(phone);
    });

    test('Should handle phone numbers with formatting', () => {
      const phone = '+91-123-456-7890';
      const encrypted = encryptPhone(phone);
      const decrypted = decryptPhone(encrypted);

      // Phone should be cleaned (non-digits removed) before encryption
      expect(decrypted).toBe('911234567890');
    });

    test('Should check if value is encrypted', () => {
      const plaintext = 'test@example.com';
      const encrypted = encrypt(plaintext);

      expect(isEncrypted(plaintext)).toBe(false);
      expect(isEncrypted(encrypted)).toBe(true);
    });

    test('Should handle null and undefined values', () => {
      expect(encrypt(null)).toBe(null);
      expect(encrypt(undefined)).toBe(undefined);
      expect(decrypt(null)).toBe(null);
      expect(decrypt(undefined)).toBe(undefined);
    });

    test('Should handle non-string values', () => {
      const number = 12345;
      expect(encrypt(number)).toBe(number);
      expect(decrypt(number)).toBe(number);
    });

    test('Should generate encryption key', () => {
      const key = generateEncryptionKey();
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBe(64); // 32 bytes = 64 hex chars
    });

    test('Should produce different encrypted values for same input (due to random IV)', () => {
      const plaintext = 'test@example.com';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      // Different IVs should produce different encrypted values
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to the same value
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    test('Should handle backward compatibility (non-encrypted values)', () => {
      const plaintext = 'test@example.com';
      // If value is not encrypted, decrypt should return as-is
      const result = decrypt(plaintext);
      expect(result).toBe(plaintext);
    });
  });

  describe('Audit Log Model', () => {
    test('Should create audit log entry', async () => {
      const auditLog = await AuditLog.create({
        eventType: 'CONTRACT_SIGNED',
        actorId: testClient._id,
        actorRole: 'client',
        action: 'Contract signed',
        targetType: 'CONTRACT',
        targetId: testContract._id,
        description: 'Test contract signing',
      });

      expect(auditLog.eventType).toBe('CONTRACT_SIGNED');
      expect(auditLog.actorId.toString()).toBe(testClient._id.toString());
      expect(auditLog.targetId.toString()).toBe(testContract._id.toString());
    });

    test('Should have required fields', async () => {
      await expect(
        AuditLog.create({
          // Missing required fields
        })
      ).rejects.toThrow();
    });

    test('Should validate eventType enum', async () => {
      await expect(
        AuditLog.create({
          eventType: 'INVALID_EVENT',
          actorId: testClient._id,
          actorRole: 'client',
          action: 'Test action',
        })
      ).rejects.toThrow();
    });

    test('Should create log with metadata', async () => {
      const auditLog = await AuditLog.create({
        eventType: 'PAYOUT_RELEASED',
        actorId: testArchitect._id,
        actorRole: 'architect',
        action: 'Payout released',
        targetType: 'PROJECT',
        targetId: testProject._id,
        amount: 50000,
        currency: 'INR',
        metadata: {
          transactionId: 'txn_123',
          breakdown: { fee: 2000, net: 48000 },
        },
      });

      expect(auditLog.amount).toBe(50000);
      expect(auditLog.metadata.transactionId).toBe('txn_123');
    });
  });

  describe('Audit Service', () => {
    test('Should create audit log via service', async () => {
      const auditLog = await createAuditLog({
        eventType: 'CONTRACT_SIGNED',
        actorId: testClient._id,
        action: 'Contract signed by client',
        targetType: 'CONTRACT',
        targetId: testContract._id,
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.eventType).toBe('CONTRACT_SIGNED');
      expect(auditLog.actorRole).toBe('client');
    });

    test('Should log contract signing', async () => {
      const auditLog = await logContractSigning({
        contractId: testContract._id,
        actorId: testClient._id,
        signerType: 'client',
        metadata: {
          documentId: 'doc_123',
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.eventType).toBe('CONTRACT_SIGNED');
      expect(auditLog.metadata.signerType).toBe('client');
    });

    test('Should log payout release', async () => {
      const auditLog = await logPayoutRelease({
        projectId: testProject._id,
        actorId: testArchitect._id,
        amount: 50000,
        currency: 'INR',
        metadata: {
          transactionId: 'txn_123',
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.eventType).toBe('PAYOUT_RELEASED');
      expect(auditLog.amount).toBe(50000);
      expect(auditLog.targetId.toString()).toBe(testProject._id.toString());
    });

    test('Should log contract rejection', async () => {
      const auditLog = await logContractRejection({
        contractId: testContract._id,
        actorId: testClient._id,
        metadata: {
          reason: 'Terms not acceptable',
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.eventType).toBe('CONTRACT_REJECTED');
    });

    test('Should log payout cancellation', async () => {
      const auditLog = await logPayoutCancellation({
        projectId: testProject._id,
        actorId: testArchitect._id,
        metadata: {
          reason: 'Insufficient funds',
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.eventType).toBe('PAYOUT_CANCELLED');
    });

    test('Should encrypt actor email in audit log', async () => {
      const auditLog = await createAuditLog({
        eventType: 'CONTRACT_SIGNED',
        actorId: testClient._id,
        action: 'Contract signed',
        targetType: 'CONTRACT',
        targetId: testContract._id,
      });

      // Actor email should be encrypted
      if (auditLog.actorEmail) {
        expect(isEncrypted(auditLog.actorEmail)).toBe(true);
        expect(decryptEmail(auditLog.actorEmail)).toBe(testClient.email);
      }
    });

    test('Should extract IP and user agent from request', async () => {
      const mockReq = {
        ip: '192.168.1.1',
        headers: {
          'user-agent': 'Mozilla/5.0 Test Browser',
        },
      };

      const auditLog = await createAuditLog({
        eventType: 'CONTRACT_SIGNED',
        actorId: testClient._id,
        action: 'Contract signed',
        req: mockReq,
      });

      expect(auditLog.ipAddress).toBe('192.168.1.1');
      expect(auditLog.userAgent).toBe('Mozilla/5.0 Test Browser');
    });
  });

  describe('Contract Model - Audit Integration', () => {
    test('Should create audit log when client signs contract', async () => {
      await testContract.markClientSigned(testClient._id, 'doc_123');

      const auditLogs = await AuditLog.find({
        eventType: 'CONTRACT_SIGNED',
        targetId: testContract._id,
      });

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].metadata.signerType).toBe('client');
    });

    test('Should create audit log when professional signs contract', async () => {
      await testContract.markProfessionalSigned(testArchitect._id, 'doc_123');

      const auditLogs = await AuditLog.find({
        eventType: 'CONTRACT_SIGNED',
        targetId: testContract._id,
      });

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].metadata.signerType).toBe('professional');
    });
  });

  describe('Wallet Model - Audit Integration', () => {
    test('Should create audit log when payout is released', async () => {
      await testWallet.addWithdrawal(50000, 'txn_123', testArchitect._id);

      const auditLogs = await AuditLog.find({
        eventType: 'PAYOUT_RELEASED',
        targetId: testProject._id,
      });

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].amount).toBe(50000);
      expect(auditLogs[0].metadata.transactionId).toBe('txn_123');
    });

    test('Should not create audit log if actorId not provided', async () => {
      await testWallet.addWithdrawal(50000, 'txn_123');

      const auditLogs = await AuditLog.find({
        eventType: 'PAYOUT_RELEASED',
        targetId: testProject._id,
      });

      expect(auditLogs.length).toBe(0);
    });
  });

  describe('Audit Log Queries', () => {
    beforeEach(async () => {
      // Create multiple audit logs for testing queries
      await logContractSigning({
        contractId: testContract._id,
        actorId: testClient._id,
        signerType: 'client',
      });

      await logPayoutRelease({
        projectId: testProject._id,
        actorId: testArchitect._id,
        amount: 50000,
      });
    });

    test('Should get audit logs for a target', async () => {
      const logs = await AuditLog.getTargetLogs('CONTRACT', testContract._id);

      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].targetType).toBe('CONTRACT');
    });

    test('Should get audit logs for an actor', async () => {
      const logs = await AuditLog.getActorLogs(testClient._id);

      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].actorId.toString()).toBe(testClient._id.toString());
    });

    test('Should get audit logs by event type', async () => {
      const logs = await AuditLog.getEventLogs('CONTRACT_SIGNED');

      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].eventType).toBe('CONTRACT_SIGNED');
    });
  });
});

