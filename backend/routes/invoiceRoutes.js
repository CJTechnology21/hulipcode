const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoicesByProject,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

// Routes
router.post("/", createInvoice);      // Create invoice
router.get("/", getInvoices);         // Get all invoices
router.get("/", getInvoicesByProject);   // Get single invoice
router.put("/:id", updateInvoice);    // Update invoice
router.delete("/:id", deleteInvoice); // Delete invoice

module.exports = router;
