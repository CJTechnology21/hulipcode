const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Create Transaction
const createTransaction = async (req, res) => {
  try {
    const { projectId, architectId, ...rest } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Valid projectId is required" });
    }

    if (!architectId || !mongoose.Types.ObjectId.isValid(architectId)) {
      return res.status(400).json({ message: "Valid architectId is required" });
    }

    const transaction = await Transaction.create({
      projectId,
      architectId,
      ...rest, // any other optional fields
    });

    res.status(201).json({ transaction });
  } catch (err) {
    console.error("Create Transaction Error:", err);
    res.status(500).json({ message: "Server error while creating transaction" });
  }
};


// Get all transactions with optional filters (projectId, architectId)
const getAllTransactions = async (req, res) => {
  try {
    const { projectId, architectId } = req.query;
    const filter = {};

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      filter.projectId = projectId;
    }

    if (architectId) {
      if (!mongoose.Types.ObjectId.isValid(architectId)) {
        return res.status(400).json({ message: "Invalid architectId" });
      }
      filter.architectId = architectId;
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json({ transactions });
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
};

// Get single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ transaction });
  } catch (err) {
    console.error("Get Transaction Error:", err);
    res.status(500).json({ message: "Server error while fetching transaction" });
  }
};

// Full update (PUT)
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ transaction });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ message: "Server error while updating transaction" });
  }
};

// Partial update (PATCH)
const patchTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ transaction });
  } catch (err) {
    console.error("Patch Transaction Error:", err);
    res.status(500).json({ message: "Server error while patching transaction" });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Delete Transaction Error:", err);
    res.status(500).json({ message: "Server error while deleting transaction" });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
};
