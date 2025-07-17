const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();

// Utils
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber) => /^[6-9]\d{9}$/.test(phoneNumber);

// Google OAuth2
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

// Set cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @route   POST /api/auth/signup
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

// @route   POST /api/auth/login
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

// @route   POST /api/auth/google
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

// @route   POST /api/auth/google/details
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

// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
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

// // Utility validators
// const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// const isValidPhoneNumber = (phoneNumber) => /^[6-9]\d{9}$/.test(phoneNumber);
// require("dotenv").config(); // ✅ TEMP add this to force load env
// // OAuth2 Client for Google
// const oauth2Client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
//   // 'postmessage' // must match frontend usage (e.g., useGoogleLogin)
// );


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

//     if (!role) return res.status(400).json({ message: 'Role is required' });

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

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
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

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
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
//     if (!code) return res.status(400).json({ message: 'Authorization code missing' });

//     const { tokens } = await oauth2Client.getToken(code);
//     if (!tokens?.id_token) return res.status(400).json({ message: 'Unable to retrieve ID token' });

//     const ticket = await oauth2Client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub } = payload;

//     if (!email || !name || !sub) {
//       return res.status(400).json({ message: 'Incomplete Google account data' });
//     }

//     let user = await User.findOne({ email });
//     if (!user) {
//       const hashedSub = await bcrypt.hash(sub, 10);
//       const newUserData = {
//         name,
//         email,
//         password: hashedSub,
//         role: role || "client",
//       };

//       if (phoneNumber) {
//         newUserData.phoneNumber = phoneNumber;
//       }

//       user = await User.create(newUserData);
//     }


//     // if (!user) {
//     //   const hashedSub = await bcrypt.hash(sub, 10);
//     //   user = await User.create({
//     //     name,
//     //     email,
//     //     password: hashedSub,
//     //     role: role || "client",

//     //   });
//     // }

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Google Auth Error:", err);
//     res.status(500).json({ message: err.message || "Google authentication failed" });
//   }
// };

// //controller to handle details
// const googleDetails = async (req, res) => {
//   try {
//     const { id, role, phoneNumber } = req.body;

//     if (!id || !role || !phoneNumber) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check for phone duplication
//     const existingUserWithPhone = await User.findOne({ phoneNumber });
//     if (existingUserWithPhone && existingUserWithPhone._id.toString() !== id) {
//       return res.status(400).json({ message: "Phone number already in use" });
//     }

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.role = role;
//     user.phoneNumber = phoneNumber;
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Google Details Error:", err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   googleAuth,
//   googleDetails,
// };
