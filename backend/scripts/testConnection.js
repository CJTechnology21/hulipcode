// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...\n');
  
  // Check if MONGO_URI is set
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env file');
    console.error('💡 Please add MONGO_URI to your .env file');
    process.exit(1);
  }
  
  console.log('✅ MONGO_URI found in .env file');
  console.log('MongoDB URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@'));
  console.log('');
  
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };
    
    console.log('⏳ Attempting to connect...');
    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('   Database:', mongoose.connection.db.databaseName);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    console.log('   Ready State:', mongoose.connection.readyState);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n✅ Found ${collections.length} collections in database`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting steps:');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   1. Check your internet connection');
      console.error('   2. Verify the MongoDB hostname in MONGO_URI');
      console.error('   3. If using MongoDB Atlas, check network access settings');
    } else if (error.message.includes('authentication failed')) {
      console.error('   1. Check username and password in MONGO_URI');
      console.error('   2. Verify database user has proper permissions');
      console.error('   3. If using MongoDB Atlas, check database user credentials');
    } else if (error.message.includes('timeout')) {
      console.error('   1. Check if MongoDB server is running');
      console.error('   2. Verify network connectivity');
      console.error('   3. Check firewall settings');
      console.error('   4. If using MongoDB Atlas, check IP whitelist');
    } else {
      console.error('   1. Verify MONGO_URI format is correct');
      console.error('   2. Check MongoDB server status');
      console.error('   3. Review error message above for specific issues');
    }
    
    process.exit(1);
  }
}

testConnection();



