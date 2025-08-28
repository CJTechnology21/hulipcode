const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema(
    {
        architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        category: { type: String, enum: ["Payment", "Sales", "Expense", "MyAccount"], required: true },
        transactionType: { type: String, enum: ["PaymentIn", "PaymentOut", "DebitNote", "CreditNote", "PartyToPartyPayment", "SalesInvoice", "MaterialSales", "MaterialPurchase", "MaterialReturn", "MaterialTransfer", "SubConBill", "OtherExpense", "IPaid", "IReceived"], required: true },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "INR" },
        mode: { type: String, enum: ["Cash", "BankTransfer", "UPI", "Cheque", "Card", "Other"], required: true },
        party: { type: String },
        vendor: { type: String },
        material: { type: String },
        quantity: { type: Number, min: 0 },
        date: { type: Date, required: true },
        dueDate: { type: Date },
        notes: { type: String, maxlength: 500 },
        proofs: [{ fileUrl: String, fileType: { type: String, enum: ["image", "pdf"] } }],
        status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
        projectBalance: { type: Number, default: 0 },
    },
    { timestamps: true }
);
const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction

// // models/Transaction.js
// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema(
//     {
//         architectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         projectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Project",
//             required: true,
//         },

//         // Category
//         category: {
//             type: String,
//             enum: ["Payment", "Sales", "Expense", "MyAccount"],
//             required: true,
//         },

//         // Transaction Type
//         transactionType: {
//             type: String,
//             enum: [
//                 "PaymentIn",
//                 "PaymentOut",
//                 "DebitNote",
//                 "CreditNote",
//                 "PartyToPartyPayment",
//                 "SalesInvoice",
//                 "MaterialSales",
//                 "MaterialPurchase",
//                 "MaterialReturn",
//                 "MaterialTransfer",
//                 "SubConBill",
//                 "OtherExpense",
//                 "IPaid",
//                 "IReceived",
//             ],
//             required: true,
//         },

//         amount: {
//             type: Number,
//             required: true,
//             min: 0,
//         },
//         currency: {
//             type: String,
//             default: "INR",
//         },

//         mode: {
//             type: String,
//             enum: ["Cash", "BankTransfer", "UPI", "Cheque", "Card", "Other"],
//             required: true,
//         },

//         party: {
//             type: String,
//             required: false,
//         },

//         status: {
//             type: String,
//             enum: ["pending", "completed", "cancelled"],
//             default: "pending",
//         },

//         notes: {
//             type: String,
//             maxlength: 500,
//         },

//         proofs: [
//             {
//                 fileUrl: { type: String, required: true },
//                 fileType: { type: String, enum: ["image", "pdf"], required: true },
//             },
//         ],

//         // ✅ Running balance of the project at this transaction point
//         projectBalance: {
//             type: Number,
//             default: 0,
//         },
//     },
//     { timestamps: true }
// );

// const Transaction = mongoose.model("Transaction", transactionSchema)
// module.exports = Transaction