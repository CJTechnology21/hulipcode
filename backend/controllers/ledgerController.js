const { getLedgerEntries } = require('../services/ledgerService');
const LedgerEntry = require('../models/LedgerEntry');
const { checkProjectAccess } = require('../middleware/aclMiddleware');

/**
 * Get ledger entries for a project
 * @route GET /api/ledger/project/:projectId
 */
const getLedgerEntriesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, entryType } = req.query;

    // Check project access
    if (req.user) {
      const access = await checkProjectAccess(projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({
          message: access.reason || 'Access denied to this project',
        });
      }
    }

    // Build filters
    const filters = {};
    if (category) {
      filters.category = category;
    }
    if (entryType) {
      filters.entryType = entryType.toUpperCase();
    }

    // Get ledger entries
    const entries = await getLedgerEntries(projectId, filters);

    res.status(200).json({
      entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    res.status(500).json({
      message: 'Server error while fetching ledger entries',
    });
  }
};

/**
 * Get single ledger entry by ID
 * @route GET /api/ledger/:id
 */
const getLedgerEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await LedgerEntry.findById(id)
      .populate('projectId', 'name')
      .populate('taskId', 'name value')
      .populate('createdBy', 'name email');

    if (!entry) {
      return res.status(404).json({
        message: 'Ledger entry not found',
      });
    }

    // Check project access
    if (req.user) {
      const access = await checkProjectAccess(entry.projectId._id || entry.projectId, req.user);
      if (!access.allowed) {
        return res.status(403).json({
          message: access.reason || 'Access denied to this ledger entry',
        });
      }
    }

    res.status(200).json({
      entry,
    });
  } catch (error) {
    console.error('Error fetching ledger entry:', error);
    res.status(500).json({
      message: 'Server error while fetching ledger entry',
    });
  }
};

module.exports = {
  getLedgerEntriesByProject,
  getLedgerEntryById,
};

