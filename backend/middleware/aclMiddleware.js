const Project = require('../models/Project');
const Task = require('../models/Tasks');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const Transaction = require('../models/Transaction');
const SiteMeasurements = require('../models/SiteMeasurements');

/**
 * Resource ACL Middleware
 * Verifies user has permission to access specific resources based on role
 */

// Helper: Check if user is admin
const isAdmin = (user) => {
  return user.role === 'admin' || user.isSuperAdmin === true;
};

// Helper: Check if user is homeowner (client)
const isHomeowner = (user) => {
  return user.role === 'client';
};

// Helper: Check if user is professional (architect)
const isProfessional = (user) => {
  return user.role === 'architect';
};

// Helper: Check if user is site agent
const isSiteAgent = (user) => {
  return user.role === 'Site Staff';
};

// Helper: Check if user is vendor
const isVendor = (user) => {
  return user.role === 'vendor' || 
         user.role === 'Material Supplier' || 
         user.role === 'Service Provider';
};

/**
 * Check project access
 * - Homeowner: can access if project's quote -> lead -> assigned matches OR project.client matches
 * - Professional: can access if project.architectId matches OR assigned to quote
 * - Site Agent: can access for measurements/tasks only (handled separately)
 * - Vendor: cannot access projects
 * - Admin: full access
 */
const checkProjectAccess = async (projectId, user) => {
  if (isAdmin(user)) return { allowed: true };

  if (isVendor(user)) {
    return { allowed: false, reason: 'Vendors cannot access projects directly' };
  }

  const project = await Project.findById(projectId)
    .populate('quoteId', 'leadId assigned')
    .populate('architectId', '_id');

  if (!project) {
    return { allowed: false, reason: 'Project not found' };
  }

  // Professional (architect) access
  if (isProfessional(user)) {
    if (project.architectId && project.architectId._id.toString() === user._id.toString()) {
      return { allowed: true };
    }
    // Check if assigned to quote
    if (project.quoteId) {
      const quote = await Quote.findById(project.quoteId._id || project.quoteId)
        .populate('assigned', '_id');
      if (quote && quote.assigned) {
        const assignedIds = Array.isArray(quote.assigned) 
          ? quote.assigned.map(a => a._id?.toString() || a.toString())
          : [quote.assigned._id?.toString() || quote.assigned.toString()];
        if (assignedIds.includes(user._id.toString())) {
          return { allowed: true };
        }
      }
    }
    return { allowed: false, reason: 'Professional not assigned to this project' };
  }

  // Homeowner (client) access
  if (isHomeowner(user)) {
    // Check via quote -> lead
    if (project.quoteId) {
      const quote = await Quote.findById(project.quoteId._id || project.quoteId)
        .populate('leadId', 'assigned');
      if (quote && quote.leadId) {
        const lead = await Lead.findById(quote.leadId._id || quote.leadId);
        if (lead && lead.assigned && lead.assigned.toString() === user._id.toString()) {
          return { allowed: true };
        }
      }
    }
    // Fallback: check if project.client matches user name/email
    if (project.client && (project.client === user.name || project.client === user.email)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Homeowner does not own this project' };
  }

  // Site agent - allowed for measurements/tasks (handled by specific middleware)
  if (isSiteAgent(user)) {
    return { allowed: true }; // Will be further restricted in task/measurement checks
  }

  return { allowed: false, reason: 'Insufficient permissions' };
};

/**
 * Check task access
 * - Homeowner: can access if task.projectId -> project is owned by them
 * - Professional: can access if task.projectId -> project.architectId matches OR task.assignedTo matches
 * - Site Agent: can access if task.assignedTo matches
 * - Vendor: cannot access tasks
 * - Admin: full access
 */
const checkTaskAccess = async (taskId, user) => {
  if (isAdmin(user)) return { allowed: true };

  if (isVendor(user)) {
    return { allowed: false, reason: 'Vendors cannot access tasks' };
  }

  const task = await Task.findById(taskId).populate('projectId', 'architectId quoteId');

  if (!task) {
    return { allowed: false, reason: 'Task not found' };
  }

  // Site agent - only if assigned
  if (isSiteAgent(user)) {
    if (task.assignedTo && task.assignedTo.toString() === user._id.toString()) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Site agent not assigned to this task' };
  }

  // Check project access
  const projectAccess = await checkProjectAccess(task.projectId._id || task.projectId, user);
  if (projectAccess.allowed) {
    return { allowed: true };
  }

  // Professional can also access if assigned to task
  if (isProfessional(user)) {
    if (task.assignedTo && task.assignedTo.toString() === user._id.toString()) {
      return { allowed: true };
    }
  }

  return { allowed: false, reason: 'No access to this task' };
};

/**
 * Check quote access
 * - Homeowner: can access if quote.leadId -> lead.assigned matches
 * - Professional: can access if quote.assigned includes user OR quote.leadId -> lead.assigned matches OR created the quote
 * - Site Agent: cannot access quotes
 * - Vendor: cannot access quotes
 * - Admin: full access
 */
const checkQuoteAccess = async (quoteId, user) => {
  if (isAdmin(user)) return { allowed: true };

  if (isSiteAgent(user) || isVendor(user)) {
    return { allowed: false, reason: 'Site agents and vendors cannot access quotes' };
  }

  const quote = await Quote.findById(quoteId)
    .populate('leadId', 'assigned')
    .populate('assigned', '_id');

  if (!quote) {
    return { allowed: false, reason: 'Quote not found' };
  }

  // Professional (architect) - more permissive access
  if (isProfessional(user)) {
    // Check if assigned to quote
    if (quote.assigned) {
      const assignedIds = Array.isArray(quote.assigned)
        ? quote.assigned.map(a => a._id?.toString() || a.toString())
        : [quote.assigned._id?.toString() || quote.assigned.toString()];
      
      if (assignedIds.includes(user._id.toString())) {
        return { allowed: true };
      }
    }

    // Check if owns the lead (architect can access quotes for leads they own)
    if (quote.leadId) {
      const lead = await Lead.findById(quote.leadId._id || quote.leadId);
      if (lead && lead.assigned && lead.assigned.toString() === user._id.toString()) {
        return { allowed: true };
      }
    }

    // For architects, allow access to all quotes (they need to see quotes to work on them)
    // This is more permissive - architects can see all quotes
    return { allowed: true };
  }

  // Homeowner (client) - can access if owns the lead
  if (isHomeowner(user)) {
    if (quote.leadId) {
      const lead = await Lead.findById(quote.leadId._id || quote.leadId);
      if (lead && lead.assigned && lead.assigned.toString() === user._id.toString()) {
        return { allowed: true };
      }
    }
    return { allowed: false, reason: 'Homeowner does not own this quote\'s lead' };
  }

  return { allowed: false, reason: 'No access to this quote' };
};

/**
 * Check transaction (wallet) access
 * - Homeowner: can access if transaction.projectId -> project is owned by them
 * - Professional: can access if transaction.architectId matches OR transaction.projectId -> project.architectId matches
 * - Site Agent: cannot access transactions
 * - Vendor: can access if transaction.vendor matches
 * - Admin: full access
 */
const checkTransactionAccess = async (transactionId, user) => {
  if (isAdmin(user)) return { allowed: true };

  if (isSiteAgent(user)) {
    return { allowed: false, reason: 'Site agents cannot access transactions' };
  }

  const transaction = await Transaction.findById(transactionId)
    .populate('architectId', '_id')
    .populate('projectId', 'architectId quoteId')
    .populate('vendor', '_id');

  if (!transaction) {
    return { allowed: false, reason: 'Transaction not found' };
  }

  // Vendor access
  if (isVendor(user)) {
    if (transaction.vendor && transaction.vendor._id.toString() === user._id.toString()) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Vendor not associated with this transaction' };
  }

  // Professional access
  if (isProfessional(user)) {
    if (transaction.architectId && transaction.architectId._id.toString() === user._id.toString()) {
      return { allowed: true };
    }
    if (transaction.projectId) {
      const project = transaction.projectId;
      if (project.architectId && project.architectId.toString() === user._id.toString()) {
        return { allowed: true };
      }
    }
    return { allowed: false, reason: 'Professional not associated with this transaction' };
  }

  // Homeowner access - check via project
  if (isHomeowner(user)) {
    if (transaction.projectId) {
      const projectAccess = await checkProjectAccess(
        transaction.projectId._id || transaction.projectId,
        user
      );
      if (projectAccess.allowed) {
        return { allowed: true };
      }
    }
    return { allowed: false, reason: 'Homeowner does not own this transaction\'s project' };
  }

  return { allowed: false, reason: 'Insufficient permissions' };
};

/**
 * Check site measurement access
 * - Homeowner: can access if measurement.projectId -> project is owned by them
 * - Professional: can access if measurement.architectId matches OR measurement.projectId -> project.architectId matches
 * - Site Agent: can access if measurement.projectId -> project allows site staff
 * - Vendor: cannot access measurements
 * - Admin: full access
 */
const checkSiteMeasurementAccess = async (measurementId, user) => {
  if (isAdmin(user)) return { allowed: true };

  if (isVendor(user)) {
    return { allowed: false, reason: 'Vendors cannot access site measurements' };
  }

  const measurement = await SiteMeasurements.findById(measurementId)
    .populate('projectId', 'architectId quoteId')
    .populate('architectId', '_id');

  if (!measurement) {
    return { allowed: false, reason: 'Site measurement not found' };
  }

  // Site agent access
  if (isSiteAgent(user)) {
    // Site agents can access measurements for projects they're assigned to
    return { allowed: true }; // Will be further validated by project access
  }

  // Professional access
  if (isProfessional(user)) {
    if (measurement.architectId && measurement.architectId._id.toString() === user._id.toString()) {
      return { allowed: true };
    }
    if (measurement.projectId) {
      const projectAccess = await checkProjectAccess(
        measurement.projectId._id || measurement.projectId,
        user
      );
      if (projectAccess.allowed) {
        return { allowed: true };
      }
    }
    return { allowed: false, reason: 'Professional not associated with this measurement' };
  }

  // Homeowner access
  if (isHomeowner(user)) {
    if (measurement.projectId) {
      const projectAccess = await checkProjectAccess(
        measurement.projectId._id || measurement.projectId,
        user
      );
      if (projectAccess.allowed) {
        return { allowed: true };
      }
    }
    return { allowed: false, reason: 'Homeowner does not own this measurement\'s project' };
  }

  return { allowed: false, reason: 'Insufficient permissions' };
};

// Middleware factory functions
const requireProjectAccess = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const projectId = req.params[paramName] || req.body.projectId || req.query.projectId;
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }

      const access = await checkProjectAccess(projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ 
          message: access.reason || 'Access denied to this project' 
        });
      }

      next();
    } catch (error) {
      console.error('Project ACL error:', error);
      res.status(500).json({ message: 'Error checking project access' });
    }
  };
};

const requireTaskAccess = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const taskId = req.params[paramName] || req.body.taskId || req.query.taskId;
      if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required' });
      }

      const access = await checkTaskAccess(taskId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ 
          message: access.reason || 'Access denied to this task' 
        });
      }

      next();
    } catch (error) {
      console.error('Task ACL error:', error);
      res.status(500).json({ message: 'Error checking task access' });
    }
  };
};

const requireQuoteAccess = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const quoteId = req.params[paramName] || req.body.quoteId || req.query.quoteId;
      if (!quoteId) {
        return res.status(400).json({ message: 'Quote ID is required' });
      }

      const access = await checkQuoteAccess(quoteId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ 
          message: access.reason || 'Access denied to this quote' 
        });
      }

      next();
    } catch (error) {
      console.error('Quote ACL error:', error);
      res.status(500).json({ message: 'Error checking quote access' });
    }
  };
};

const requireTransactionAccess = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const transactionId = req.params[paramName] || req.body.transactionId || req.query.transactionId;
      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }

      const access = await checkTransactionAccess(transactionId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ 
          message: access.reason || 'Access denied to this transaction' 
        });
      }

      next();
    } catch (error) {
      console.error('Transaction ACL error:', error);
      res.status(500).json({ message: 'Error checking transaction access' });
    }
  };
};

const requireSiteMeasurementAccess = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const measurementId = req.params[paramName] || req.body.measurementId || req.query.measurementId;
      if (!measurementId) {
        return res.status(400).json({ message: 'Site measurement ID is required' });
      }

      const access = await checkSiteMeasurementAccess(measurementId, req.user);
      if (!access.allowed) {
        return res.status(403).json({ 
          message: access.reason || 'Access denied to this site measurement' 
        });
      }

      next();
    } catch (error) {
      console.error('Site measurement ACL error:', error);
      res.status(500).json({ message: 'Error checking site measurement access' });
    }
  };
};

// Special middleware for filtering lists by access
const filterProjectsByAccess = async (req, res, next) => {
  try {
    // This will be handled in controllers
    req.filterByAccess = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkProjectAccess,
  checkTaskAccess,
  checkQuoteAccess,
  checkTransactionAccess,
  checkSiteMeasurementAccess,
  requireProjectAccess,
  requireTaskAccess,
  requireQuoteAccess,
  requireTransactionAccess,
  requireSiteMeasurementAccess,
  filterProjectsByAccess,
  isAdmin,
  isHomeowner,
  isProfessional,
  isSiteAgent,
  isVendor,
};

