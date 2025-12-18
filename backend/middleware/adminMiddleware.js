/**
 * Admin Middleware
 * Ensures only admin users can access admin endpoints
 */

const { isAdmin } = require('./aclMiddleware');

/**
 * Middleware to require admin access
 */
const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is admin
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        error: 'You do not have permission to access this resource',
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking admin permissions',
      error: error.message,
    });
  }
};

module.exports = { requireAdmin };

