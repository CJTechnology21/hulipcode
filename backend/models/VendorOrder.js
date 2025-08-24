// models/VendorOrder.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
});

const ReturnSchema = new mongoose.Schema({
    item: { type: String, required: true },
    qty: { type: Number, required: true },
    reason: { type: String },
    date: { type: Date, default: Date.now },
});

const VendorOrderSchema = new mongoose.Schema(
    {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Architect/Client/Admin
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Vendor User
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
        paymentTerms: { type: String, default: "Net 30" },
        deliveryDate: { type: Date },
        notes: { type: String },

        items: [ItemSchema],
        returns: [ReturnSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("VendorOrder", VendorOrderSchema);
