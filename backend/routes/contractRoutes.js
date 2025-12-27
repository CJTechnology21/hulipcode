const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  sendHtmlForSigning, 
  getContractStatus, 
  convertHtmlToPdf,
  getAllContracts,
  getContractById,
  createContractFromQuote,
  getSignedContractDocument
} = require("../controllers/contractController");

/**
 * @route   POST /api/contracts/html-to-pdf
 * @desc    Convert HTML to Base64 PDF
 * @access  Public (add auth middleware if needed)
 * 
 * Body:
 * {
 *   html: string (required),
 *   pdfOptions?: { format, margin, printBackground }
 * }
 */
router.post("/html-to-pdf", convertHtmlToPdf);

/**
 * @route   POST /api/contracts/send-for-signing
 * @desc    Convert HTML to PDF and send to Leegality for signing
 * @access  Public (add auth middleware if needed)
 * 
 * Body:
 * {
 *   html: string (required),
 *   fileName?: string,
 *   signers: [{ name, email, phone?, role? }] (required),
 *   profileId?: string
 * }
 */
router.post("/send-for-signing", sendHtmlForSigning);

/**
 * @route   GET /api/contracts/status/:documentId
 * @desc    Get contract status from Leegality
 * @access  Public (add auth middleware if needed)
 */
router.get("/status/:documentId", getContractStatus);

/**
 * @route   GET /api/contracts
 * @desc    Get all contracts with populated data
 * @access  Protected - requires authentication
 */
router.get("/", protect, getAllContracts);

/**
 * @route   POST /api/contracts/create-from-quote
 * @desc    Create contract from quote
 * @access  Protected - requires authentication
 */
router.post("/create-from-quote", protect, createContractFromQuote);

/**
 * @route   GET /api/contracts/:id/signed-document
 * @desc    Stream signed contract PDF if available
 * @access  Public (add auth middleware if needed)
 */
router.get("/:id/signed-document", getSignedContractDocument);

/**
 * @route   GET /api/contracts/:id
 * @desc    Get single contract by ID
 * @access  Public (add auth middleware if needed)
 */
router.get("/:id", getContractById);

module.exports = router;
