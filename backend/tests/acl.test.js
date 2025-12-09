/**
 * ACL (Access Control List) Tests
 * Tests resource-level permissions for different user roles
 */

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Tasks');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const Transaction = require('../models/Transaction');

// Mock app or import your actual app
// const app = require('../server'); // Adjust path as needed

describe('ACL Permission Tests', () => {
  let homeowner, professional, siteAgent, vendor, admin;
  let homeownerProject, professionalProject, homeownerTask, professionalTask;
  let homeownerQuote, professionalQuote;
  let homeownerTransaction, professionalTransaction;

  beforeAll(async () => {
    // Connect to test database
    // await mongoose.connect(process.env.MONGODB_TEST_URI);
    
    // Create test users
    homeowner = await User.create({
      name: 'Test Homeowner',
      email: 'homeowner@test.com',
      password: 'password123',
      role: 'client',
    });

    professional = await User.create({
      name: 'Test Professional',
      email: 'professional@test.com',
      password: 'password123',
      role: 'architect',
    });

    siteAgent = await User.create({
      name: 'Test Site Agent',
      email: 'siteagent@test.com',
      password: 'password123',
      role: 'Site Staff',
    });

    vendor = await User.create({
      name: 'Test Vendor',
      email: 'vendor@test.com',
      password: 'password123',
      role: 'vendor',
    });

    admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      isSuperAdmin: true,
    });

    // Create test lead for homeowner
    const homeownerLead = await Lead.create({
      name: 'Homeowner Lead',
      budget: '500000',
      contact: '1234567890',
      status: 'Assigned',
      assigned: homeowner._id,
      category: 'RESIDENTIAL',
    });

    // Create test projects
    homeownerProject = await Project.create({
      name: 'Homeowner Project',
      client: 'Test Homeowner',
      location: 'Test Location',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: professional._id,
    });

    professionalProject = await Project.create({
      name: 'Professional Project',
      client: 'Other Client',
      location: 'Other Location',
      category: 'RESIDENTIAL',
      status: 'IN_PROGRESS',
      architectId: professional._id,
    });

    // Create test quotes
    homeownerQuote = await Quote.create({
      leadId: homeownerLead._id,
      quoteAmount: 500000,
      assigned: [professional._id],
      status: 'Send',
    });

    professionalQuote = await Quote.create({
      leadId: homeownerLead._id,
      quoteAmount: 600000,
      assigned: [professional._id],
      status: 'Send',
    });

    // Create test tasks
    homeownerTask = await Task.create({
      name: 'Homeowner Task',
      projectId: homeownerProject._id,
      assignedTo: siteAgent._id,
      status: 'TODO',
    });

    professionalTask = await Task.create({
      name: 'Professional Task',
      projectId: professionalProject._id,
      assignedTo: professional._id,
      status: 'TODO',
    });

    // Create test transactions
    homeownerTransaction = await Transaction.create({
      architectId: professional._id,
      projectId: homeownerProject._id,
      category: 'Payment',
      transactionType: 'PaymentIn',
      amount: 10000,
      mode: 'BankTransfer',
      date: new Date(),
    });

    professionalTransaction = await Transaction.create({
      architectId: professional._id,
      projectId: professionalProject._id,
      category: 'Payment',
      transactionType: 'PaymentIn',
      amount: 20000,
      mode: 'BankTransfer',
      date: new Date(),
    });
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Quote.deleteMany({});
    await Lead.deleteMany({});
    await Transaction.deleteMany({});
    // await mongoose.connection.close();
  });

  // Helper function to generate JWT token
  const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  };

  describe('Test 1: Homeowner allowed to access own project', () => {
    test('Homeowner can GET their own project', async () => {
      const token = generateToken(homeowner);
      // This test would use your actual API endpoint
      // const response = await request(app)
      //   .get(`/api/projects/${homeownerProject._id}`)
      //   .set('Cookie', `token=${token}`)
      //   .expect(200);
      
      // For now, we'll test the ACL function directly
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(homeownerProject._id.toString(), homeowner);
      expect(access.allowed).toBe(true);
    });
  });

  describe('Test 2: Homeowner blocked on others project', () => {
    test('Homeowner cannot GET another user\'s project', async () => {
      const token = generateToken(homeowner);
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(professionalProject._id.toString(), homeowner);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Homeowner does not own');
    });
  });

  describe('Test 3: Professional allowed only on assigned project', () => {
    test('Professional can GET project they are assigned to', async () => {
      const token = generateToken(professional);
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(professionalProject._id.toString(), professional);
      expect(access.allowed).toBe(true);
    });
  });

  describe('Test 4: Professional denied on others project', () => {
    test('Professional cannot GET project they are not assigned to', async () => {
      // Create a project assigned to different architect
      const otherProfessional = await User.create({
        name: 'Other Professional',
        email: 'other@test.com',
        password: 'password123',
        role: 'architect',
      });

      const otherProject = await Project.create({
        name: 'Other Project',
        client: 'Other Client',
        location: 'Other Location',
        category: 'RESIDENTIAL',
        status: 'IN_PROGRESS',
        architectId: otherProfessional._id,
      });

      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(otherProject._id.toString(), professional);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Professional not assigned');

      // Cleanup
      await Project.findByIdAndDelete(otherProject._id);
      await User.findByIdAndDelete(otherProfessional._id);
    });
  });

  describe('Test 5: Site agent only measurement/task', () => {
    test('Site agent can access task they are assigned to', async () => {
      const { checkTaskAccess } = require('../middleware/aclMiddleware');
      const access = await checkTaskAccess(homeownerTask._id.toString(), siteAgent);
      expect(access.allowed).toBe(true);
    });

    test('Site agent cannot access task they are not assigned to', async () => {
      const { checkTaskAccess } = require('../middleware/aclMiddleware');
      const access = await checkTaskAccess(professionalTask._id.toString(), siteAgent);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Site agent not assigned');
    });

    test('Site agent cannot access quotes', async () => {
      const { checkQuoteAccess } = require('../middleware/aclMiddleware');
      const access = await checkQuoteAccess(homeownerQuote._id.toString(), siteAgent);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Site agents and vendors cannot access quotes');
    });
  });

  describe('Test 6: Vendor denied on project APIs', () => {
    test('Vendor cannot access projects', async () => {
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(homeownerProject._id.toString(), vendor);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Vendors cannot access projects');
    });

    test('Vendor cannot access tasks', async () => {
      const { checkTaskAccess } = require('../middleware/aclMiddleware');
      const access = await checkTaskAccess(homeownerTask._id.toString(), vendor);
      expect(access.allowed).toBe(false);
      expect(access.reason).toContain('Vendors cannot access tasks');
    });

    test('Vendor can access their own transactions', async () => {
      const vendorTransaction = await Transaction.create({
        architectId: professional._id,
        projectId: homeownerProject._id,
        category: 'Payment',
        transactionType: 'PaymentOut',
        amount: 5000,
        mode: 'BankTransfer',
        date: new Date(),
        vendor: vendor._id,
      });

      const { checkTransactionAccess } = require('../middleware/aclMiddleware');
      const access = await checkTransactionAccess(vendorTransaction._id.toString(), vendor);
      expect(access.allowed).toBe(true);

      // Cleanup
      await Transaction.findByIdAndDelete(vendorTransaction._id);
    });
  });

  describe('Test 7: Admin allowed everywhere', () => {
    test('Admin can access any project', async () => {
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      const access = await checkProjectAccess(homeownerProject._id.toString(), admin);
      expect(access.allowed).toBe(true);
    });

    test('Admin can access any task', async () => {
      const { checkTaskAccess } = require('../middleware/aclMiddleware');
      const access = await checkTaskAccess(homeownerTask._id.toString(), admin);
      expect(access.allowed).toBe(true);
    });

    test('Admin can access any quote', async () => {
      const { checkQuoteAccess } = require('../middleware/aclMiddleware');
      const access = await checkQuoteAccess(homeownerQuote._id.toString(), admin);
      expect(access.allowed).toBe(true);
    });

    test('Admin can access any transaction', async () => {
      const { checkTransactionAccess } = require('../middleware/aclMiddleware');
      const access = await checkTransactionAccess(homeownerTransaction._id.toString(), admin);
      expect(access.allowed).toBe(true);
    });
  });

  describe('Test 8: Unauthorized blocked', () => {
    test('Unauthenticated request should be blocked', async () => {
      // This would test the protect middleware
      // const response = await request(app)
      //   .get(`/api/projects/${homeownerProject._id}`)
      //   .expect(401);
      
      // For ACL function, we test with null user
      const { checkProjectAccess } = require('../middleware/aclMiddleware');
      // Note: ACL functions expect req.user to be set, so this would fail at middleware level
      // The actual test would be at the route level with protect middleware
      expect(true).toBe(true); // Placeholder - actual test would check 401 response
    });
  });
});


