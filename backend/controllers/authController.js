const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
// dotenv.config() is already called in server.js

// Validation utils
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// Accept any 10-digit phone number (matching frontend validation)
const isValidPhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

// Google OAuth2 setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Set token in HTTP-only cookie

const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';

  // For localhost development, use 'Lax' with secure: false
  // For production/cross-origin, use 'None' with secure: true
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd, // true in production, false in dev
    sameSite: isProd ? 'None' : 'Lax', // None for cross-origin (prod), Lax for same-origin (dev)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// const setTokenCookie = (res, token) => {
//   const isProd = process.env.NODE_ENV === 'production';

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? 'None' : 'Lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
// };

// ==============================
// Register
// ==============================
const registerUser = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, role } = req.body;

    if (!name || name.trim().length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber))
      return res.status(400).json({ message: 'Enter a valid phone number (10 digits)' });

    if (!email || !isValidEmail(email))
      return res.status(400).json({ message: 'Enter a valid email address' });

    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });

    if (!role)
      return res.status(400).json({ message: 'Role is required' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ==============================
// Login
// ==============================
const loginUser = async (req, res) => {
  try {
    // Support both 'email' and 'emailOrPhone' from frontend
    const { email, emailOrPhone, password } = req.body;
    const loginIdentifier = email || emailOrPhone;

    console.log('=== Login Attempt ===');
    console.log('Login identifier received:', loginIdentifier ? (isValidEmail(loginIdentifier) ? loginIdentifier.substring(0, 5) + '...' : 'phone: ' + loginIdentifier.substring(0, 3) + '***') : 'MISSING');
    console.log('Password received:', password ? '***' : 'MISSING');

    // Validate that we have either email or phone
    if (!loginIdentifier) {
      console.log('❌ No email or phone provided');
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    // Validate format (must be valid email OR valid phone)
    const isEmail = isValidEmail(loginIdentifier);
    const isPhone = isValidPhoneNumber(loginIdentifier);

    if (!isEmail && !isPhone) {
      console.log('❌ Invalid email or phone format');
      return res.status(400).json({ message: 'Enter a valid email address or phone number' });
    }

    if (!password) {
      console.log('❌ Password missing');
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check JWT_SECRET before proceeding
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
    }

    console.log('Looking up user in database...');
    
    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB is not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again in a moment.' 
      });
    }
    
    // Find user by email OR phone number
    const user = isEmail 
      ? await User.findOne({ email: loginIdentifier })
      : await User.findOne({ phoneNumber: loginIdentifier });
    
    if (!user) {
      console.log('❌ User not found with identifier:', isEmail ? 'email' : 'phone');
      return res.status(400).json({ message: 'No user found with this email or phone number' });
    }

    console.log('User found, comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: 'Incorrect password' });
    }

    console.log('Password matched, generating token...');
    const token = generateToken(user);
    console.log('Token generated successfully');

    console.log('Setting cookie...');
    setTokenCookie(res, token);
    console.log('Cookie set successfully');

    console.log('✅ Login successful for user:', user.email);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('❌ Login Error Details:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    // Provide more specific error messages
    if (err.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
    }
    if (err.name === 'MongoError' || err.name === 'MongooseError' || err.message.includes('buffering timed out')) {
      console.error('💡 MongoDB Connection Issue:');
      console.error('   - Check if MongoDB is running');
      console.error('   - Verify MONGO_URI in .env file');
      console.error('   - Check network connectivity');
      return res.status(503).json({ 
        message: 'Database connection error. Please check your MongoDB connection and try again.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ==============================
// Google Auth
// ==============================
const googleAuth = async (req, res) => {
  try {
    const { code, role, phoneNumber } = req.body;

    if (!code)
      return res.status(400).json({ message: 'Authorization code missing' });

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens?.id_token)
      return res.status(400).json({ message: 'Unable to retrieve ID token' });

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    if (!email || !name || !sub)
      return res.status(400).json({ message: 'Incomplete Google account data' });

    let user = await User.findOne({ email });
    if (!user) {
      const hashedSub = await bcrypt.hash(sub, 10);
      const newUserData = {
        name,
        email,
        password: hashedSub,
        role: role || 'client',
      };

      if (phoneNumber) newUserData.phoneNumber = phoneNumber;

      user = await User.create(newUserData);
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ message: err.message || 'Google authentication failed' });
  }
};

// ==============================
// Google: Fill Extra Details
// ==============================
const googleDetails = async (req, res) => {
  try {
    const { id, role, phoneNumber } = req.body;

    if (!id || !role || !phoneNumber)
      return res.status(400).json({ message: 'Missing required fields' });

    const existingUserWithPhone = await User.findOne({ phoneNumber });
    if (existingUserWithPhone && existingUserWithPhone._id.toString() !== id)
      return res.status(400).json({ message: 'Phone number already in use' });

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.role = role;
    user.phoneNumber = phoneNumber;
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Google Details Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ==============================
// Logout
// ==============================
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  googleDetails,
  logout,
};
