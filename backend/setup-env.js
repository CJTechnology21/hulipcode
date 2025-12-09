/**
 * Setup script to create .env file from .env.example
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Generate a random JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Replace placeholder JWT_SECRET with generated one
const envContent = envExample.replace(
  'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345',
  `JWT_SECRET=${jwtSecret}`
);

// Write .env file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ .env file created successfully!');
console.log('✅ JWT_SECRET has been auto-generated');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Edit backend/.env and fill in:');
console.log('      - MONGO_URI (your MongoDB connection string)');
console.log('      - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
console.log('      - AWS credentials (if using S3)');
console.log('      - VAPID keys (run: node utils/generateVapidKeys.js)');
console.log('   2. Place serviceAccountKey.json in backend/ directory');
console.log('   3. Run: npm install');
console.log('   4. Run: npm run dev');

