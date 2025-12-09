/**
 * Setup script to create .env file from .env.example
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('   If you want to recreate it, delete .env first.');
  process.exit(0);
}

// Check if .env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  process.exit(1);
}

// Read .env.example
const envContent = fs.readFileSync(envExamplePath, 'utf8');

// Write .env file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ .env file created successfully!');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Edit frontend/.env and fill in:');
console.log('      - REACT_APP_GOOGLE_CLIENT_ID');
console.log('   2. Run: npm install');
console.log('   3. Run: npm start');


