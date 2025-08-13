const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// Validation utils
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber) => /^[6-9]\d{9}$/.test(phoneNumber);

// Google OAuth2 setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Set token in HTTP-only cookie
const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd ? true : false, // allow HTTP in dev
    sameSite: 'None', // ✅ always allow cross-origin
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
    const { email, password } = req.body;

    if (!email || !isValidEmail(email))
      return res.status(400).json({ message: 'Enter a valid email address' });

    if (!password)
      return res.status(400).json({ message: 'Password is required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'No user found with this email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password' });

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
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
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

// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
// require("dotenv").config();

// // Utils
// const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// const isValidPhoneNumber = (phoneNumber) => /^[6-9]\d{9}$/.test(phoneNumber);

// // Google OAuth2
// const oauth2Client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// // Generate JWT
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// };

// // Set cookie
// const setTokenCookie = (res, token) => {
//   const isProd = process.env.NODE_ENV === 'production';

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: isProd,                       // ✅ secure only in production
//     sameSite: isProd ? 'None' : 'Lax',   // ✅ Lax for localhost
//     maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days
//   });
// };
// // const setTokenCookie = (res, token) => {
// //   res.cookie('token', token, {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === 'production',
// //     sameSite: 'None',
// //     maxAge: 7 * 24 * 60 * 60 * 1000,
// //   });
// // };

// // @route   POST /api/auth/signup
// const registerUser = async (req, res) => {
//   try {
//     const { name, phoneNumber, email, password, role } = req.body;

//     if (!name || name.trim().length < 2)
//       return res.status(400).json({ message: 'Name must be at least 2 characters' });

//     if (!phoneNumber || !isValidPhoneNumber(phoneNumber))
//       return res.status(400).json({ message: 'Enter a valid phone number (10 digits)' });

//     if (!email || !isValidEmail(email))
//       return res.status(400).json({ message: 'Enter a valid email address' });

//     if (!password || password.length < 6)
//       return res.status(400).json({ message: 'Password must be at least 6 characters long' });

//     if (!role)
//       return res.status(400).json({ message: 'Role is required' });

//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: 'User already exists with this email' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       phoneNumber,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     const token = generateToken(user);
//     setTokenCookie(res, token);

//     res.status(201).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       }
//     });
//   } catch (err) {
//     console.error('Signup Error:', err);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // @route   POST /api/auth/login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !isValidEmail(email))
//       return res.status(400).json({ message: 'Enter a valid email address' });

//     if (!password)
//       return res.status(400).json({ message: 'Password is required' });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: 'No user found with this email' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Incorrect password' });

//     const token = generateToken(user);
//     setTokenCookie(res, token);

//     res.status(200).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       }
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // @route   POST /api/auth/google
// const googleAuth = async (req, res) => {
//   try {
//     const { code, role, phoneNumber } = req.body;
//     if (!code)
//       return res.status(400).json({ message: 'Authorization code missing' });

//     const { tokens } = await oauth2Client.getToken(code);
//     if (!tokens?.id_token)
//       return res.status(400).json({ message: 'Unable to retrieve ID token' });

//     const ticket = await oauth2Client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub } = payload;

//     if (!email || !name || !sub)
//       return res.status(400).json({ message: 'Incomplete Google account data' });

//     let user = await User.findOne({ email });
//     if (!user) {
//       const hashedSub = await bcrypt.hash(sub, 10);
//       const newUserData = {
//         name,
//         email,
//         password: hashedSub,
//         role: role || 'client',
//       };

//       if (phoneNumber) newUserData.phoneNumber = phoneNumber;
//       user = await User.create(newUserData);
//     }

//     const token = generateToken(user);
//     setTokenCookie(res, token);

//     res.status(200).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       }
//     });
//   } catch (err) {
//     console.error('Google Auth Error:', err);
//     res.status(500).json({ message: err.message || 'Google authentication failed' });
//   }
// };

// // @route   POST /api/auth/google/details
// const googleDetails = async (req, res) => {
//   try {
//     const { id, role, phoneNumber } = req.body;

//     if (!id || !role || !phoneNumber)
//       return res.status(400).json({ message: 'Missing required fields' });

//     const existingUserWithPhone = await User.findOne({ phoneNumber });
//     if (existingUserWithPhone && existingUserWithPhone._id.toString() !== id)
//       return res.status(400).json({ message: 'Phone number already in use' });

//     const user = await User.findById(id);
//     if (!user)
//       return res.status(404).json({ message: 'User not found' });

//     user.role = role;
//     user.phoneNumber = phoneNumber;
//     await user.save();

//     const token = generateToken(user);
//     setTokenCookie(res, token);

//     res.status(200).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       }
//     });
//   } catch (err) {
//     console.error('Google Details Error:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // @route   POST /api/auth/logout
// const logout = async (req, res) => {
//   console.log("✅ Logout route hit"); // Add this
//   try {
//     res.clearCookie('token', {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'None',
//     });
//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (err) {
//     console.error("❌ Logout Error:", err);
//     res.status(500).json({ error: 'Logout failed' });
//   }
// };



// module.exports = {
//   registerUser,
//   loginUser,
//   googleAuth,
//   googleDetails,
//   logout,
// };
