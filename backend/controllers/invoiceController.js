const Invoice = require("../models/Invoice");

// ✅ Create Invoice
const createInvoice = async (req, res) => {
    try {
        const { firm, date, amount, projectId } = req.body;

        if (!firm || !date || !amount || !projectId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const invoice = new Invoice({ firm, date, amount, projectId });
        await invoice.save();

        res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ message: "Error creating invoice", error: error.message });
    }
};

// ✅ Get All Invoices
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("projectId", "name");
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices", error: error.message });
    }
};

// ✅ Get Invoice by ID
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("projectId", "name");
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoice", error: error.message });
    }
};

// ✅ Update Invoice
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json({ message: "Invoice updated", invoice });
    } catch (error) {
        res.status(500).json({ message: "Error updating invoice", error: error.message });
    }
};

// ✅ Delete Invoice
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json({ message: "Invoice deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice", error: error.message });
    }
};


module.exports = { createInvoice, deleteInvoice, updateInvoice, getInvoiceById, getInvoices }