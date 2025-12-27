const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in environment variables');
      throw new Error('MONGO_URI is required but not found in .env file');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

    // Connection options to handle timeouts and improve reliability
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
      // Attempt to reconnect after a delay
      setTimeout(async () => {
        try {
          await mongoose.connect(process.env.MONGO_URI, options);
          console.log('✅ MongoDB reconnected successfully');
        } catch (err) {
          console.error('❌ Reconnection failed:', err.message);
        }
      }, 5000); // Retry after 5 seconds
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Handle connection close
    mongoose.connection.on('close', () => {
      console.warn('⚠️ MongoDB connection closed');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('💡 DNS resolution failed. Check:');
      console.error('   - Your internet connection');
      console.error('   - MongoDB URI hostname is correct');
      console.error('   - If using MongoDB Atlas, check your network access settings');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication failed. Check:');
      console.error('   - MongoDB username and password in MONGO_URI');
      console.error('   - Database user has proper permissions');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Connection timeout. Check:');
      console.error('   - MongoDB server is running');
      console.error('   - Network connectivity');
      console.error('   - Firewall settings');
      console.error('   - If using MongoDB Atlas, check IP whitelist');
    } else if (error.message.includes('MONGO_URI')) {
      console.error('💡 MONGO_URI not set. Check:');
      console.error('   - .env file exists in backend directory');
      console.error('   - MONGO_URI is defined in .env file');
      console.error('   - Format: MONGO_URI=mongodb://username:password@host:port/database');
    }
    
    // Don't exit the process, but log the error clearly
    throw error;
  }
};

module.exports = connectDB;
