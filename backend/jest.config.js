/**
 * Jest Configuration
 * Testing framework configuration for backend tests
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage configuration
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/',
    '/migrations/',
    '/scripts/',
  ],
  coverageReporters: ['text', 'lcov', 'html'],

  // Module paths
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout (30 seconds for async operations)
  testTimeout: 30000,

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
  ],

  // Transform configuration (if needed for ES6+)
  transform: {},

  // Global variables
  globals: {
    'NODE_ENV': 'test',
  },

  // Module name mapping (if using path aliases)
  moduleNameMapper: {},

  // Maximum number of concurrent workers
  maxWorkers: '50%',
};

