const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header if present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Fallback: check cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id || (decoded.user && decoded.user._id);

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;

//   // ✅ Try getting token from Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   // ✅ Fallback to token from cookie
//   if (!token && req.cookies?.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id || decoded._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Auth error:', err.message);
//     res.status(401).json({ message: 'Token invalid or expired' });
//   }
// };

// module.exports = { protect };

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id || decoded._id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     req.user = user; // will include _id field as Mongoose object
//     next();
//   } catch (err) {
//     console.error('Auth error:', err.message);
//     res.status(401).json({ message: 'Token invalid or expired' });
//   }
// };

// module.exports = { protect };