/* ===========================================
   Contract Controller - Simplified
   =========================================== */

const fs = require("fs");
const path = require("path");
const { htmlToPdfBase64 } = require("../utils/htmlToPdf");
const { sendToLeegality } = require("../services/leegalityService");

exports.sendHtmlForSigning = async (req, res) => {
  try {
    const { html, signers, fileName, profileId, irn } = req.body;

    console.log("\n=== STARTING CONTRACT SIGNING ===");
    console.log("Signers:", signers?.map(s => ({ name: s.name, email: s.email })));

    // Validate input
    if (!html) {
      return res.status(400).json({ 
        success: false,
        error: "HTML content is required" 
      });
    }

    if (!signers || !Array.isArray(signers) || signers.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "At least one signer is required with name and email" 
      });
    }

    // Validate signers have emails
    for (let i = 0; i < signers.length; i++) {
      const signer = signers[i];
      if (!signer || !signer.email || !signer.email.trim()) {
        return res.status(400).json({ 
          success: false,
          error: `Signer ${i + 1} (${signer?.name || 'Unknown'}) is missing a valid email address.` 
        });
      }
    }

    console.log("STEP 1: HTML → PDF...");
    const pdfBase64 = await htmlToPdfBase64(html);
    
    // Validate the base64 string
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      throw new Error("PDF conversion failed: Invalid base64 string returned");
    }
    
    // Check if it's actually base64 (not comma-separated numbers)
    if (/^\d+,\d+/.test(pdfBase64)) {
      throw new Error("PDF conversion failed: Buffer was not converted to base64 correctly. Got comma-separated numbers instead.");
    }
    
    // Validate base64 format
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(pdfBase64)) {
      throw new Error("PDF conversion failed: Invalid base64 format");
    }
    
    console.log("✅ PDF Generated Successfully! Size:", pdfBase64.length, "characters");
    console.log("✅ Base64 starts with:", pdfBase64.substring(0, 20));

    console.log("STEP 2: Sending to Leegality...");
    const response = await sendToLeegality({
      pdfBase64,
      fileName: fileName || `Service_Agreement_${irn || Date.now()}.pdf`,
      signers
    });

    // Extract signing links and document ID from response
    // Leegality API returns: { data: { documentId, invitees: [{ signUrl, ... }] } }
    const documentId = response.data?.data?.documentId || 
                      response.data?.documentId || 
                      response.data?.document_id || 
                      response.documentId ||
                      response.document_id;

    // Extract invitees from nested data structure (Leegality nests it in data.data.invitees)
    const invitees = response.data?.data?.invitees || 
                     response.data?.invitees || 
                     response.invitees || 
                     [];

    // Extract signing links from invitees
    const signingLinks = invitees
      .map(invitee => invitee.signUrl || invitee.signingUrl || invitee.url)
      .filter(Boolean);

    console.log("✅ Leegality Signing Request Created!");
    console.log("Document ID:", documentId);
    console.log("Extracted invitees:", invitees.length);
    console.log("Extracted signing links:", signingLinks.length);
    console.log("Signing links:", signingLinks);

    console.log("✅ Leegality Signing Request Created!");
    console.log("Document ID:", documentId);
    console.log("Signing Links Count:", signingLinks.length);

    res.json({
      success: true,
      message: "Signing request created successfully",
      documentId: documentId,
      signingLinks: signingLinks,
      invitees: invitees.map((invitee, index) => ({
        name: invitee.name || signers[index]?.name,
        email: invitee.email || signers[index]?.email,
        signingUrl: invitee.signUrl || invitee.signingUrl || invitee.url || signingLinks[index],
        status: "SENT"
      })),
      data: response
    });

  } catch (err) {
    console.error("❌ Contract Signing Error:", err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Convert HTML to Base64 PDF
 * POST /api/contracts/html-to-pdf
 */
exports.convertHtmlToPdf = async (req, res) => {
  try {
    const { html, pdfOptions } = req.body;

    if (!html) {
      return res.status(400).json({ 
        success: false,
        error: "HTML content is required" 
      });
    }

    console.log("Converting HTML to PDF...");
    const pdfBase64 = await htmlToPdfBase64(html);

    res.json({
      success: true,
      pdfBase64: pdfBase64
    });

  } catch (err) {
    console.error("HTML to PDF conversion error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "PDF conversion failed" 
    });
  }
};

/**
 * Get contract status from Leegality
 * GET /api/contracts/status/:documentId
 */
exports.getContractStatus = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ 
        success: false,
        error: "Document ID is required" 
      });
    }

    // TODO: Implement Leegality status check API call
    res.json({
      success: true,
      documentId: documentId,
      status: "pending",
      message: "Status check not yet implemented. Use Leegality Dashboard to check status."
    });

  } catch (err) {
    console.error("Contract status error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to get contract status" 
    });
  }
};

/**
 * Return signed contract PDF if available on disk (downloaded via Leegality webhook)
 * GET /api/contracts/:id/signed-document
 */
exports.getSignedContractDocument = async (req, res) => {
  try {
    const Contract = require("../models/Contract");
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: "Contract not found",
      });
    }

    // Prefer Leegality document ID, fall back to contract ID
    const documentId =
      contract.leegalityDocumentId || contract._id?.toString();

    const signedDir = path.join(__dirname, "..", "signed-contracts");
    const signedPath = path.join(signedDir, `${documentId}.pdf`);

    if (!fs.existsSync(signedPath)) {
      return res.status(404).json({
        success: false,
        error:
          "Signed contract not available yet. Please sign the contract.",
      });
    }

    return res.sendFile(path.resolve(signedPath));
  } catch (err) {
    console.error("Get signed contract error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch signed contract",
    });
  }
};

/**
 * Get all contracts with populated quote and lead data
 * GET /api/contracts
 */
exports.getAllContracts = async (req, res) => {
  try {
    const Contract = require("../models/Contract");
    const contracts = await Contract.find()
      .populate({
        path: "quoteId",
        populate: {
          path: "leadId",
          select: "name contact email city category isHuelip"
        },
        select: "qid quoteAmount"
      })
      .populate("projectId", "name status")
      .populate("clientSignature.signedBy", "name email")
      .populate("professionalSignature.signedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contracts: contracts
    });
  } catch (err) {
    console.error("Get contracts error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to fetch contracts" 
    });
  }
};

/**
 * Get single contract by ID
 * GET /api/contracts/:id
 */
exports.getContractById = async (req, res) => {
  try {
    const Contract = require("../models/Contract");
    const contract = await Contract.findById(req.params.id)
      .populate({
        path: "quoteId",
        populate: {
          path: "leadId",
          select: "name contact email city category isHuelip"
        },
        select: "qid quoteAmount summary"
      })
      .populate("projectId", "name status")
      .populate("clientSignature.signedBy", "name email")
      .populate("professionalSignature.signedBy", "name email");

    if (!contract) {
      return res.status(404).json({ 
        success: false,
        error: "Contract not found" 
      });
    }

    res.json({
      success: true,
      contract: contract
    });
  } catch (err) {
    console.error("Get contract error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to fetch contract" 
    });
  }
};

/**
 * Create contract from quote
 * POST /api/contracts/create-from-quote
 */
exports.createContractFromQuote = async (req, res) => {
  try {
    const Contract = require("../models/Contract");
    const Quote = require("../models/Quote");
    const { quoteId } = req.body;

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        error: "Quote ID is required"
      });
    }

    // Check if contract already exists for this quote
    const existingContract = await Contract.findOne({ quoteId });
    if (existingContract) {
      return res.status(400).json({
        success: false,
        error: "Contract already exists for this quote",
        contract: existingContract
      });
    }

    // Fetch quote with populated data
    const quote = await Quote.findById(quoteId)
      .populate("leadId", "name contact email city category isHuelip")
      .populate("assigned", "name email");

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: "Quote not found"
      });
    }

    // Calculate total amount
    const totalAmount = quote.summary?.reduce((sum, row) => {
      return sum + (Number(row.amount) || 0) + (Number(row.tax) || 0);
    }, 0) || quote.quoteAmount || 0;

    // Create contract
    const contract = await Contract.create({
      quoteId: quote._id,
      version_number: 1,
      status: "pending_signature",
      metadata: {
        totalAmount: totalAmount,
        currency: "INR",
        contractType: "msa",
      },
    });

    // Populate and return
    const populatedContract = await Contract.findById(contract._id)
      .populate({
        path: "quoteId",
        populate: {
          path: "leadId",
          select: "name contact email city category isHuelip"
        },
        select: "qid quoteAmount"
      });

    res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract: populatedContract
    });
  } catch (err) {
    console.error("Create contract error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create contract"
    });
  }
};
