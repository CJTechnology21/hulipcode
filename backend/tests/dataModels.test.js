const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Wallet = require('../models/Wallet');
const Quote = require('../models/Quote');
const Project = require('../models/Project');
const User = require('../models/User');
const Lead = require('../models/Lead');

describe('Data Models - Contract and Wallet', () => {
  let testArchitect;
  let testClient;
  let testLead;
  let testQuote;
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
      status: 'IN_PROGRESS',
      architectId: testArchitect._id,
      quoteId: testQuote._id,
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

  describe('Contract Model', () => {
    test('Should create contract with required fields', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        pdf_url: 'https://example.com/contract.pdf',
        signed_by_client: false,
        signed_by_professional: false,
      });

      expect(contract.quoteId.toString()).toBe(testQuote._id.toString());
      expect(contract.version_number).toBe(1);
      expect(contract.signed_by_client).toBe(false);
      expect(contract.signed_by_professional).toBe(false);
      expect(contract.status).toBe('draft');
    });

    test('Should have version_number field', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 2,
      });

      expect(contract.version_number).toBe(2);
    });

    test('Should have terms_blob field', async () => {
      const termsData = {
        sections: [
          { title: 'Section 1', content: 'Terms content' },
          { title: 'Section 2', content: 'More terms' },
        ],
        totalAmount: 500000,
      };

      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        terms_blob: termsData,
      });

      expect(contract.terms_blob).toBeDefined();
      expect(contract.terms_blob.sections).toBeDefined();
      expect(contract.terms_blob.totalAmount).toBe(500000);
    });

    test('Should have pdf_url field', async () => {
      const pdfUrl = 'https://s3.amazonaws.com/bucket/contract.pdf';
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        pdf_url: pdfUrl,
      });

      expect(contract.pdf_url).toBe(pdfUrl);
    });

    test('Should have signed_by_client field', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        signed_by_client: true,
      });

      expect(contract.signed_by_client).toBe(true);
    });

    test('Should have signed_by_professional field', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        signed_by_professional: true,
      });

      expect(contract.signed_by_professional).toBe(true);
    });

    test('Should update status to fully_signed when both parties sign', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        signed_by_client: false,
        signed_by_professional: false,
      });

      expect(contract.status).toBe('draft');

      contract.signed_by_client = true;
      contract.signed_by_professional = true;
      await contract.save();

      expect(contract.status).toBe('fully_signed');
    });

    test('Should update status to partially_signed when one party signs', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
      });

      contract.signed_by_client = true;
      await contract.save();

      expect(contract.status).toBe('partially_signed');
    });

    test('Should have isFullySigned virtual', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        signed_by_client: true,
        signed_by_professional: true,
      });

      expect(contract.isFullySigned).toBe(true);
    });

    test('Should mark client signed using method', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        leegalityDocumentId: 'doc-123',
      });

      await contract.markClientSigned(testClient._id, 'doc-123');

      expect(contract.signed_by_client).toBe(true);
      expect(contract.clientSignature.signedBy.toString()).toBe(testClient._id.toString());
      expect(contract.status).toBe('partially_signed');
    });

    test('Should mark professional signed using method', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        signed_by_client: true,
      });

      await contract.markProfessionalSigned(testArchitect._id, 'doc-123');

      expect(contract.signed_by_professional).toBe(true);
      expect(contract.professionalSignature.signedBy.toString()).toBe(testArchitect._id.toString());
      expect(contract.status).toBe('fully_signed');
    });

    test('Should accept projectId field', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        projectId: testProject._id,
        version_number: 1,
      });

      expect(contract.projectId.toString()).toBe(testProject._id.toString());
    });

    test('Should have leegalityDocumentId field', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        leegalityDocumentId: 'leegality-doc-123',
      });

      expect(contract.leegalityDocumentId).toBe('leegality-doc-123');
    });

    test('Should have leegalitySigningLinks array', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
        leegalitySigningLinks: [
          {
            signerEmail: 'client@example.com',
            signerName: 'Client Name',
            signingUrl: 'https://leegality.com/sign/123',
            status: 'sent',
          },
        ],
      });

      expect(contract.leegalitySigningLinks.length).toBe(1);
      expect(contract.leegalitySigningLinks[0].signerEmail).toBe('client@example.com');
    });
  });

  describe('Wallet Model - reserved_amount field', () => {
    test('Should have reserved_amount field', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 20000,
      });

      expect(wallet.reserved_amount).toBe(20000);
    });

    test('Should default reserved_amount to 0', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
      });

      expect(wallet.reserved_amount).toBe(0);
    });

    test('Should calculate availableBalance correctly', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 30000,
      });

      expect(wallet.availableBalance).toBe(70000); // 100000 - 30000
    });

    test('Should calculate availableBalance as 0 if reserved exceeds balance', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 150000,
      });

      expect(wallet.availableBalance).toBe(0); // Should not be negative
    });

    test('Should reserve amount using reserveAmount method', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 0,
      });

      await wallet.reserveAmount(25000, 'Pending withdrawal');

      expect(wallet.reserved_amount).toBe(25000);
      expect(wallet.availableBalance).toBe(75000);
    });

    test('Should throw error if trying to reserve more than available', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 0,
      });

      await expect(wallet.reserveAmount(150000)).rejects.toThrow('Insufficient available balance');
    });

    test('Should release reserved amount using releaseReserved method', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 50000,
      });

      await wallet.releaseReserved(20000);

      expect(wallet.reserved_amount).toBe(30000);
      expect(wallet.availableBalance).toBe(70000);
    });

    test('Should throw error if trying to release more than reserved', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 30000,
      });

      await expect(wallet.releaseReserved(50000)).rejects.toThrow('Cannot release more than reserved amount');
    });

    test('Should check available balance before withdrawal', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 40000,
      });

      // Should succeed - available balance is 60000
      await wallet.addWithdrawal(50000);

      expect(wallet.balance).toBe(50000);
      expect(wallet.reserved_amount).toBe(40000);
      expect(wallet.availableBalance).toBe(10000);

      // Should fail - available balance is only 10000
      await expect(wallet.addWithdrawal(20000)).rejects.toThrow('Insufficient available balance');
    });

    test('Should have provider_wallet_id field', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        providerWalletId: 'castler-wallet-123',
      });

      expect(wallet.providerWalletId).toBe('castler-wallet-123');
    });
  });

  describe('Contract Model - Relationships', () => {
    test('Should populate quoteId', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
      });

      const populated = await Contract.findById(contract._id).populate('quoteId', 'qid quoteAmount');

      expect(populated.quoteId).toBeDefined();
      expect(populated.quoteId.qid).toBeDefined();
    });

    test('Should populate projectId', async () => {
      const contract = await Contract.create({
        quoteId: testQuote._id,
        projectId: testProject._id,
        version_number: 1,
      });

      const populated = await Contract.findById(contract._id).populate('projectId', 'name status');

      expect(populated.projectId).toBeDefined();
      expect(populated.projectId.name).toBe('Test Project');
    });
  });

  describe('Wallet Model - Relationships', () => {
    test('Should populate projectId', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
      });

      const populated = await Wallet.findById(wallet._id).populate('projectId', 'name status');

      expect(populated.projectId).toBeDefined();
      expect(populated.projectId.name).toBe('Test Project');
    });
  });

  describe('Contract Model - Version Management', () => {
    test('Should create multiple versions of contract', async () => {
      const contract1 = await Contract.create({
        quoteId: testQuote._id,
        version_number: 1,
      });

      const contract2 = await Contract.create({
        quoteId: testQuote._id,
        version_number: 2,
      });

      expect(contract1.version_number).toBe(1);
      expect(contract2.version_number).toBe(2);
      expect(contract1.quoteId.toString()).toBe(contract2.quoteId.toString());
    });

    test('Should enforce minimum version_number of 1', async () => {
      await expect(
        Contract.create({
          quoteId: testQuote._id,
          version_number: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe('Wallet Model - Balance Operations', () => {
    test('Should maintain reserved_amount after deposit', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 20000,
      });

      await wallet.addDeposit(50000);

      expect(wallet.balance).toBe(150000);
      expect(wallet.reserved_amount).toBe(20000);
      expect(wallet.availableBalance).toBe(130000);
    });

    test('Should maintain reserved_amount after withdrawal', async () => {
      const wallet = await Wallet.create({
        projectId: testProject._id,
        balance: 100000,
        reserved_amount: 20000,
      });

      await wallet.addWithdrawal(30000);

      expect(wallet.balance).toBe(70000);
      expect(wallet.reserved_amount).toBe(20000);
      expect(wallet.availableBalance).toBe(50000);
    });
  });
});

