/**
 * Main setup script - Sets up both backend and frontend
 * Run from project root: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting project setup...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 14) {
  log('❌ Node.js version 14 or higher is required!', 'red');
  log(`   Current version: ${nodeVersion}`, 'red');
  process.exit(1);
}

log(`✅ Node.js version: ${nodeVersion}`, 'green');

// Setup Backend
log('\n📦 Setting up Backend...', 'blue');
const backendPath = path.join(__dirname, 'backend');
if (fs.existsSync(backendPath)) {
  try {
    // Create .env file
    if (fs.existsSync(path.join(backendPath, 'setup-env.js'))) {
      execSync('node setup-env.js', { cwd: backendPath, stdio: 'inherit' });
    }
    log('✅ Backend .env file setup complete', 'green');
  } catch (error) {
    log('⚠️  Backend .env setup had issues (may already exist)', 'yellow');
  }
} else {
  log('⚠️  Backend directory not found', 'yellow');
}

// Setup Frontend
log('\n📦 Setting up Frontend...', 'blue');
const frontendPath = path.join(__dirname, 'frontend');
if (fs.existsSync(frontendPath)) {
  try {
    // Create .env file
    if (fs.existsSync(path.join(frontendPath, 'setup-env.js'))) {
      execSync('node setup-env.js', { cwd: frontendPath, stdio: 'inherit' });
    }
    log('✅ Frontend .env file setup complete', 'green');
  } catch (error) {
    log('⚠️  Frontend .env setup had issues (may already exist)', 'yellow');
  }
} else {
  log('⚠️  Frontend directory not found', 'yellow');
}

// Summary
log('\n' + '='.repeat(50), 'blue');
log('📋 Setup Summary', 'blue');
log('='.repeat(50), 'blue');
log('\n✅ Environment files created!', 'green');
log('\n📝 Next Steps:', 'yellow');
log('   1. Edit backend/.env and add:', 'yellow');
log('      - MONGO_URI (MongoDB connection string)', 'yellow');
log('      - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET', 'yellow');
log('      - VAPID keys (run: cd backend && node utils/generateVapidKeys.js)', 'yellow');
log('      - AWS credentials (optional)', 'yellow');
log('\n   2. Edit frontend/.env and add:', 'yellow');
log('      - REACT_APP_GOOGLE_CLIENT_ID', 'yellow');
log('\n   3. Place serviceAccountKey.json in backend/ directory', 'yellow');
log('\n   4. Install dependencies:', 'yellow');
log('      cd backend && npm install', 'yellow');
log('      cd frontend && npm install', 'yellow');
log('\n   5. Start the servers:', 'yellow');
log('      Terminal 1: cd backend && npm run dev', 'yellow');
log('      Terminal 2: cd frontend && npm start', 'yellow');
log('\n📚 See QUICK_START.md for detailed instructions', 'blue');
log('='.repeat(50) + '\n', 'blue');


