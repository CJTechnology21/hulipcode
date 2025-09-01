const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create Transaction
const createTransaction = async (req, res) => {
  try {
    const {
      projectId,
      architectId,
      category,
      transactionType,
      party,
      vendor,
      ...rest
    } = req.body;

    // ✅ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Valid projectId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(architectId)) {
      return res.status(400).json({ message: "Valid architectId is required" });
    }

    // ✅ Prepare proofs array
    let proofs = [];
    if (req.file) {
      const fileKey = `projects/${projectId}/transactions/${Date.now()}-${req.file.originalname}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      };

      await s3.upload(params).promise();

      proofs.push({
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        fileType: req.file.mimetype.includes("image") ? "image" : "pdf",
      });
    }

    // ✅ Create transaction
    const transaction = await Transaction.create({
      projectId,
      architectId,
      category,
      transactionType,
      party: party || null,
      vendor: vendor || null,
      proofs, // ✅ Save as an array of objects
      ...rest,
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

// // Full update (PUT)
// Full update (PUT) with S3 file upload

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Start with existing proofs
    let proofs = transaction.proofs || [];

    // If frontend sends proofs, prefer that
    if (req.body.proofs && Array.isArray(req.body.proofs)) {
      proofs = req.body.proofs;
    }

    // If file uploaded via backend (optional case), append it
    if (req.file) {
      const fileKey = `projects/${transaction.projectId}/transactions/${Date.now()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      };

      await s3.upload(params).promise();

      proofs.push({
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        fileType: req.file.mimetype.includes("image") ? "image" : "pdf",
      });
    }

    // Merge updated data
    const updateData = {
      ...req.body,
      proofs,
    };

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTransaction);
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ message: "Server error while updating transaction" });
  }
};

// const updateTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid transaction ID" });
//     }

//     const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     res.status(200).json({ transaction });
//   } catch (err) {
//     console.error("Update Transaction Error:", err);
//     res.status(500).json({ message: "Server error while updating transaction" });
//   }
// };

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

// Get cash flow summary (inflow, outflow, net)
const getCashFlowSummary = async (req, res) => {
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

    const transactions = await Transaction.find(filter);

    let inflow = 0;
    let outflow = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      if (
        ["Payment In", "I Received", "Sales Invoice", "Material Sales"].includes(
          t.transactionType
        )
      ) {
        inflow += amount;
      } else if (
        [
          "Payment Out",
          "I Paid",
          "Material Purchase",
          "Material Return",
          "Material Transfer",
          "Other Expense",
          "Sub Con Bill",
        ].includes(t.transactionType)
      ) {
        outflow += amount;
      }
    });

    res.status(200).json({
      inflow,
      outflow,
      net: inflow - outflow,
    });
  } catch (err) {
    console.error("Get Cash Flow Error:", err);
    res.status(500).json({ message: "Server error while calculating cash flow" });
  }
};


module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
  getCashFlowSummary,
};
