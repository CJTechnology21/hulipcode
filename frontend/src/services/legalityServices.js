import axios from "axios";

// Backend API Base URL (for HTML to PDF conversion)
const BACKEND_API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Leegality API Configuration (v3.0)
// Set these in your .env file:
// REACT_APP_LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0 (sandbox) or https://app1.leegality.com/api/v3.0 (production)
// REACT_APP_LEEGALITY_AUTH_TOKEN=your-auth-token-from-dashboard
// REACT_APP_LEEGALITY_PROFILE_ID=your-workflow-profile-id
// REACT_APP_LEEGALITY_PRIVATE_SALT=your-private-salt-for-webhook-verification (optional)

// Determine if we're in production or sandbox
const isProduction = process.env.REACT_APP_LEEGALITY_ENV === 'production' || 
                     process.env.NODE_ENV === 'production';

const LEGALITY_API_BASE = process.env.REACT_APP_LEEGALITY_API_BASE || 
  (isProduction 
    ? "https://app1.leegality.com/api/v3.0" 
    : "https://sandbox.leegality.com/api/v3.0");

const LEGALITY_AUTH_TOKEN = process.env.REACT_APP_LEEGALITY_AUTH_TOKEN || "";
const LEGALITY_PROFILE_ID = process.env.REACT_APP_LEEGALITY_PROFILE_ID || "";
const LEGALITY_PRIVATE_SALT = process.env.REACT_APP_LEEGALITY_PRIVATE_SALT || "";

// Log configuration on load (for debugging)
console.log("Leegality API Config:", {
  base: LEGALITY_API_BASE,
  environment: isProduction ? 'production' : 'sandbox',
  hasToken: !!LEGALITY_AUTH_TOKEN,
  hasProfileId: !!LEGALITY_PROFILE_ID,
  hasSalt: !!LEGALITY_PRIVATE_SALT,
});

/**
 * Convert HTML string to base64 PDF using backend API
 * @param {string} htmlContent - HTML content to convert
 * @returns {Promise<string>} Base64 encoded PDF
 */
const convertHtmlToPdfBase64 = async (htmlContent) => {
  try {
    console.log("Converting HTML to PDF via backend API...");
    
    const response = await axios.post(
      `${BACKEND_API_BASE}/api/contracts/html-to-pdf`,
      { html: htmlContent },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60 second timeout for PDF conversion
      }
    );

    if (response.data.success && response.data.pdfBase64) {
      return response.data.pdfBase64;
    } else {
      throw new Error(response.data.error || "PDF conversion failed");
    }
  } catch (error) {
    console.error("Backend PDF conversion error:", error);
    throw new Error(
      `Backend PDF conversion failed: ${error.response?.data?.error || error.message}. ` +
      "Please ensure your backend server is running and the /api/contracts/html-to-pdf endpoint is available."
    );
  }
};

/**
 * Send contract to Leegality API for signing process
 * Uses backend API to avoid CORS issues
 * Supports both PDF workflows and Template workflows
 * 
 * @param {Object} contractData - Contract data including document, user details, etc.
 * @param {string} contractData.profileId - Workflow Profile ID (required, can override env var)
 * 
 * For PDF Workflows:
 * @param {string} contractData.document - PDF file in base64 format OR HTML string (will be converted via backend)
 * @param {string} contractData.fileName - File name for the document (optional)
 * 
 * For Template Workflows:
 * @param {Object} contractData.fields - Object with field values to fill in the template
 *   Example: { "clientName": "John Doe", "totalAmount": "50000", ... }
 *   Get field names from Dashboard > Workflow > Download Form Fields
 * 
 * Common parameters:
 * @param {Array} contractData.signers - Array of signer details with name, email, phone
 * @param {string} contractData.irn - Internal Reference Number (optional)
 * @param {string} contractData.quoteId - Quote ID (used as IRN if irn not provided)
 * @param {boolean} contractData.useTemplate - Set to true if using Template workflow (auto-detected if fields provided)
 * 
 * @returns {Promise} API response with documentId and signing URLs
 */
export const sendContractToLegality = async (contractData) => {
  // Always use backend API to avoid CORS issues
  // Check if document is HTML
  const isHtml = contractData.document && 
                 typeof contractData.document === 'string' && 
                 contractData.document.trim().startsWith('<!DOCTYPE html>');
  
  if (isHtml) {
    console.log("HTML document detected. Using backend API for conversion and Leegality upload...");
    return sendHtmlContractViaBackend(contractData);
  }
  
  // For PDF or other formats, also use backend
  // But since we're generating HTML contracts, this should rarely be hit
  console.log("Non-HTML document detected. Attempting to use backend API...");
  console.warn("Note: For best results, use HTML format. Backend will convert to PDF.");
  
  // Try to use backend anyway - it might handle it
  try {
    return sendHtmlContractViaBackend(contractData);
  } catch (error) {
    console.error("Backend API failed, this should not happen for HTML contracts:", error);
    throw error;
  }
};

/**
 * Send HTML contract via backend API (handles HTML → PDF → Leegality)
 * @param {Object} contractData - Contract data
 * @returns {Promise} API response
 */
const sendHtmlContractViaBackend = async (contractData) => {
  try {
    // Validate and filter signers before sending
    const validSigners = (contractData.signers || []).filter(signer => {
      if (!signer.email || !signer.email.trim()) {
        console.warn("Signer without email skipped:", signer);
        return false;
      }
      return true;
    });

    if (validSigners.length === 0) {
      throw new Error("No valid signers found. All signers must have an email address.");
    }

    console.log("Sending contract with signers:", validSigners.map(s => ({ name: s.name, email: s.email })));

    const response = await axios.post(
      `${BACKEND_API_BASE}/api/contracts/send-for-signing`,
      {
        html: contractData.document,
        fileName: contractData.fileName || `Contract_${contractData.quoteId || Date.now()}.pdf`,
        signers: validSigners,
        profileId: contractData.profileId, // Pass profileId if provided
        irn: contractData.irn || contractData.quoteId,
        pdfOptions: contractData.pdfOptions,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 90000, // 90 second timeout for PDF conversion + Leegality API
      }
    );

    if (response.data.success) {
      console.log("=== Backend Response Analysis ===");
      console.log("Full backend response:", JSON.stringify(response.data, null, 2));
      console.log("documentId:", response.data.documentId);
      console.log("signingLinks:", response.data.signingLinks);
      console.log("invitees:", JSON.stringify(response.data.invitees, null, 2));
      
      // Extract signing links from invitees if not directly provided
      let signingLinks = response.data.signingLinks || [];
      
      // If no signing links but we have invitees, extract URLs from invitees
      if (signingLinks.length === 0 && response.data.invitees && Array.isArray(response.data.invitees)) {
        console.log("No signing links found, extracting from invitees...");
        response.data.invitees.forEach((invitee, index) => {
          console.log(`Invitee ${index}:`, JSON.stringify(invitee, null, 2));
          const link = invitee.signingUrl || invitee.signUrl || invitee.url || invitee.link || invitee.sign_url;
          if (link && !signingLinks.includes(link)) {
            signingLinks.push(link);
          }
        });
        console.log("Extracted signing links:", signingLinks);
      }
      
      // Build invitees array with signing URLs
      const invitees = response.data.invitees || signingLinks.map((link, index) => ({
        name: validSigners[index]?.name,
        email: validSigners[index]?.email,
        signingUrl: typeof link === 'string' ? link : (link.url || link.signingUrl),
        status: "SENT"
      }));
      
      console.log("Final invitees:", JSON.stringify(invitees, null, 2));
      console.log("=== End Backend Response Analysis ===");
      
      return {
        documentId: response.data.documentId,
        signingLinks: signingLinks,
        invitees: invitees,
        success: true,
        rawResponse: response.data,
      };
    } else {
      throw new Error(response.data.error || "Failed to send contract via backend");
    }
  } catch (error) {
    console.error("Backend API error:", error);
    const errorMessage = error.response?.data?.error || error.message;
    
    // Provide more helpful error messages
    if (errorMessage.includes("email") || errorMessage.includes("signer")) {
      throw new Error(
        `Signer validation error: ${errorMessage}. ` +
        "Please ensure all signers have valid email addresses. Check that you are logged in with a valid email."
      );
    }
    
    throw new Error(
      `Backend API error: ${errorMessage}. ` +
      "Please ensure your backend server is running and check the console for details."
    );
  }
};

/**
 * Send contract (PDF or Template) via backend API to avoid CORS
 * @param {Object} contractData - Contract data
 * @returns {Promise} API response
 */
const sendContractViaBackend = async (contractData) => {
  try {
    // For PDF contracts, we can still use html-to-sign endpoint by wrapping PDF in HTML
    // Or better: create a simple HTML wrapper and use the same endpoint
    // Actually, let's just use the html-to-sign endpoint which can handle both
    
    // If it's a PDF base64, convert it to a data URL in HTML format
    let htmlContent = contractData.document;
    
    // If it's not HTML, assume it's PDF base64 and create an HTML wrapper
    if (!htmlContent || !htmlContent.trim().startsWith('<!DOCTYPE html>')) {
      // It's likely a PDF base64, but html-to-sign expects HTML
      // So we'll use the direct API as fallback, but that has CORS issues
      // Better solution: always send HTML, or create backend endpoint for PDF
      console.warn("PDF base64 detected. Converting to HTML wrapper for backend API...");
      
      // Create a simple HTML that embeds the PDF
      // Actually, better to just use the backend's html-to-sign which accepts HTML
      // For PDF, we need a different approach
      
      // For now, use direct API but show warning about CORS
      console.warn("Using direct Leegality API for PDF (may have CORS issues).");
      console.warn("Consider converting to HTML format or using Template workflow.");
      return sendContractToLegalityDirect(contractData);
    }
    
    // If it's HTML, use html-to-sign endpoint
    return sendHtmlContractViaBackend(contractData);
    
  } catch (error) {
    console.error("Backend API error:", error);
    throw new Error(
      `Backend API error: ${error.response?.data?.error || error.message}. ` +
      "Please ensure your backend server is running."
    );
  }
};

/**
 * Send contract directly to Leegality API (original implementation)
 * Only used as fallback if backend is not available
 * @param {Object} contractData - Contract data
 * @returns {Promise} API response
 */
const sendContractToLegalityDirect = async (contractData) => {
  try {
    // Validate required configuration
    const profileId = contractData.profileId || LEGALITY_PROFILE_ID;
    if (!profileId) {
      const errorMessage = 
        "Leegality Profile ID (Workflow ID) is required.\n\n" +
        "To fix this, you have two options:\n" +
        "1. Set REACT_APP_LEEGALITY_PROFILE_ID in your .env file\n" +
        "2. Pass profileId in contractData when calling sendContractToLegality()\n\n" +
        "To get your Profile ID:\n" +
        "- Go to your Leegality Dashboard\n" +
        "- Create a Workflow (or use an existing one)\n" +
        "- Copy the Workflow ID/Profile ID\n" +
        "- Add it to your .env file: REACT_APP_LEEGALITY_PROFILE_ID=your-workflow-id";
      throw new Error(errorMessage);
    }

    if (!LEGALITY_AUTH_TOKEN) {
      const errorMessage = 
        "Leegality Auth Token is required.\n\n" +
        "To fix this:\n" +
        "1. Go to your Leegality Dashboard\n" +
        "2. Navigate to API Settings\n" +
        "3. Copy your Auth Token\n" +
        "4. Add it to your .env file: REACT_APP_LEEGALITY_AUTH_TOKEN=your-token-here\n\n" +
        "Note: Restart your development server after updating .env file";
      throw new Error(errorMessage);
    }

    // Detect workflow type: Template workflow if fields are provided, otherwise PDF workflow
    const isTemplateWorkflow = contractData.useTemplate || 
                               (contractData.fields && Object.keys(contractData.fields).length > 0);

    console.log("Leegality Service: Preparing payload...", {
      profileId: profileId,
      workflowType: isTemplateWorkflow ? "Template" : "PDF",
      hasDocument: !!contractData.document,
      hasFields: !!contractData.fields,
      fieldsCount: contractData.fields ? Object.keys(contractData.fields).length : 0,
      signersCount: contractData.signers?.length || 0,
      irn: contractData.irn || contractData.quoteId,
    });

    // Prepare invitees array according to Leegality API format
    const invitees = (contractData.signers || []).map((signer, index) => {
      const invitee = {
        name: signer.name || signer.email || "Signer",
        email: signer.email,
      };
      
      // Add phone if provided
      if (signer.phone) {
        invitee.phone = signer.phone;
      }
      
      // Add order if signing order is enabled (optional)
      if (signer.order !== undefined) {
        invitee.order = signer.order;
      } else if (contractData.enableSigningOrder) {
        invitee.order = index + 1;
      }
      
      return invitee;
    });

    if (invitees.length === 0) {
      throw new Error("At least one signer (invitee) is required with name and email.");
    }

    // Prepare file object according to workflow type
    let fileObject = {};

    if (isTemplateWorkflow) {
      // Template Workflow: Use fields to fill the template
      if (!contractData.fields || Object.keys(contractData.fields).length === 0) {
        throw new Error(
          "Template workflow requires 'fields' object with field values. " +
          "Get field names from your Dashboard > Workflow > Download Form Fields"
        );
      }

      fileObject = {
        name: contractData.fileName || `Contract_${contractData.quoteId || Date.now()}.pdf`,
        fields: contractData.fields, // Field values for template
      };

      // If document is also provided for template workflow, include it
      if (contractData.document) {
        let fileBase64 = contractData.document;
        
        // Check if document is HTML and needs conversion
        if (contractData.document && contractData.document.trim().startsWith('<!DOCTYPE html>')) {
          console.warn("Leegality Service: HTML document detected in Template workflow. PDF conversion required.");
          try {
            fileBase64 = await convertHtmlToPdfBase64(contractData.document);
          } catch (conversionError) {
            console.warn("PDF conversion failed, continuing with template fields only:", conversionError.message);
            // For template workflows, file is optional if fields are provided
          }
        }

        // Remove data URL prefix if present
        if (fileBase64 && typeof fileBase64 === 'string') {
          fileBase64 = fileBase64.replace(/^data:application\/pdf;base64,/, '');
          fileBase64 = fileBase64.replace(/^data:.*;base64,/, '');
        }

        if (fileBase64 && !fileBase64.trim().startsWith('<!DOCTYPE html>')) {
          fileObject.file = fileBase64;
        }
      }
    } else {
      // PDF Workflow: Use file (base64 PDF)
      if (!contractData.document) {
        throw new Error(
          "PDF workflow requires 'document' (PDF in base64 format). " +
          "Or use Template workflow by providing 'fields' object."
        );
      }

      let fileBase64 = contractData.document;
      
      // Check if document is HTML and needs conversion
      if (contractData.document && contractData.document.trim().startsWith('<!DOCTYPE html>')) {
        console.warn("Leegality Service: HTML document detected. PDF conversion required.");
        try {
          fileBase64 = await convertHtmlToPdfBase64(contractData.document);
        } catch (conversionError) {
          throw new Error(
            `Document conversion failed: ${conversionError.message}. ` +
            "Please provide a PDF file in base64 format or use a Template workflow by providing 'fields'."
          );
        }
      }

      // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
      if (fileBase64 && typeof fileBase64 === 'string') {
        fileBase64 = fileBase64.replace(/^data:application\/pdf;base64,/, '');
        fileBase64 = fileBase64.replace(/^data:.*;base64,/, '');
      }

      fileObject = {
        name: contractData.fileName || `Contract_${contractData.quoteId || Date.now()}.pdf`,
        file: fileBase64, // Base64 encoded PDF
      };
    }

    // Prepare the request payload according to Leegality API v3.0
    const payload = {
      profileId: profileId,
      file: fileObject,
      invitees: invitees,
    };

    // Add IRN (Internal Reference Number) if provided
    if (contractData.irn || contractData.quoteId) {
      payload.irn = contractData.irn || contractData.quoteId;
    }

    // Add CC recipients if provided
    if (contractData.cc && contractData.cc.length > 0) {
      payload.cc = contractData.cc.map(cc => ({
        name: cc.name || cc.email,
        email: cc.email,
        phone: cc.phone,
      }));
    }

    // Add stamp series if provided
    if (contractData.stampSeries) {
      payload.stampSeries = contractData.stampSeries;
    }

    console.log("Leegality Service: Making API request to:", `${LEGALITY_API_BASE}/sign/request`);
    console.log("Leegality Service: Payload summary:", {
      profileId: payload.profileId,
      workflowType: isTemplateWorkflow ? "Template" : "PDF",
      inviteesCount: payload.invitees.length,
      hasFile: !!payload.file.file,
      hasFields: !!payload.file.fields,
      fieldsCount: payload.file.fields ? Object.keys(payload.file.fields).length : 0,
      irn: payload.irn,
    });

    // Make API request to Leegality API v3.0
    const response = await axios.post(
      `${LEGALITY_API_BASE}/sign/request`,
      payload,
      {
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("Leegality Service: API Response received:", {
      status: response.status,
      statusText: response.statusText,
      responseStatus: response.data?.status,
      documentId: response.data?.data?.documentId,
    });

    // Check Leegality API response status
    // Leegality API returns status: 0 for success, non-zero for errors
    if (response.data?.status !== 0) {
      const errorMessages = response.data?.messages || [];
      const errorMsg = errorMessages.map(m => m.message || m).join('; ') || 'Unknown error from Leegality API';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    return {
      documentId: response.data?.data?.documentId,
      irn: response.data?.data?.irn,
      invitees: response.data?.data?.invitees || [],
      success: true,
      rawResponse: response.data,
    };
  } catch (error) {
    console.error("Leegality Service: Full Error Details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });
    
    // Handle specific error types
    let errorMessage;
    
    // SSL/Certificate errors
    if (error.code === 'ERR_SSL_UNRECOGNIZED_NAME_ALERT' || 
        error.message.includes('SSL') || 
        error.message.includes('certificate') ||
        error.message.includes('ERR_SSL')) {
      errorMessage = `SSL Certificate Error: The Leegality API domain appears to be invalid. Please verify REACT_APP_LEEGALITY_API_BASE in your .env file.`;
    }
    // Network errors
    else if (error.code === 'ERR_NETWORK' || 
             error.message === 'Network Error' ||
             error.message.includes('Network')) {
      errorMessage = `Network Error: Cannot reach Leegality API. Please check your internet connection and verify the API endpoint is correct.`;
    }
    // Timeout errors
    else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = `Request Timeout: The Leegality API did not respond within 30 seconds. Please try again.`;
    }
    // HTTP errors
    else if (error.response) {
      const leegalityError = error.response.data;
      if (leegalityError?.messages && Array.isArray(leegalityError.messages)) {
        errorMessage = leegalityError.messages.map(m => m.message || m).join('; ');
      } else {
        errorMessage = leegalityError?.message || 
                      leegalityError?.error || 
                      `HTTP ${error.response.status}: ${error.response.statusText}`;
      }
    }
    // Other errors
    else {
      errorMessage = error.message || "Failed to send contract to Leegality API";
    }
    
    // Create enhanced error object
    const enhancedError = new Error(errorMessage);
    enhancedError.code = error.code;
    enhancedError.response = error.response;
    enhancedError.config = error.config;
    enhancedError.isNetworkError = error.code === 'ERR_NETWORK' || error.code === 'ERR_SSL_UNRECOGNIZED_NAME_ALERT';
    enhancedError.isSSLError = error.code === 'ERR_SSL_UNRECOGNIZED_NAME_ALERT' || error.message.includes('SSL');
    
    throw enhancedError;
  }
};

/**
 * Get document details and status from Leegality API
 * @param {string} documentId - Document ID received from create API
 * @returns {Promise} Document details including status, files, audit trail
 */
export const getDocumentDetails = async (documentId) => {
  try {
    if (!LEGALITY_AUTH_TOKEN) {
      throw new Error("Leegality Auth Token is required. Set REACT_APP_LEEGALITY_AUTH_TOKEN in your .env file.");
    }

    if (!documentId) {
      throw new Error("Document ID is required.");
    }

    const response = await axios.get(
      `${LEGALITY_API_BASE}/sign/request`,
      {
        params: { documentId },
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
        },
        timeout: 30000,
      }
    );

    if (response.data?.status !== 0) {
      const errorMessages = response.data?.messages || [];
      const errorMsg = errorMessages.map(m => m.message || m).join('; ') || 'Unknown error from Leegality API';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    return response.data?.data || {};
  } catch (error) {
    console.error("Leegality Service: Error fetching document details:", error);
    throw error;
  }
};

/**
 * Delete a document from Leegality
 * @param {string} documentId - Document ID to delete
 * @returns {Promise} Deletion response
 */
export const deleteDocument = async (documentId) => {
  try {
    if (!LEGALITY_AUTH_TOKEN) {
      throw new Error("Leegality Auth Token is required. Set REACT_APP_LEEGALITY_AUTH_TOKEN in your .env file.");
    }

    if (!documentId) {
      throw new Error("Document ID is required.");
    }

    const response = await axios.delete(
      `${LEGALITY_API_BASE}/sign/request`,
      {
        params: { documentId },
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
        },
        timeout: 30000,
      }
    );

    if (response.data?.status !== 0) {
      const errorMessages = response.data?.messages || [];
      const errorMsg = errorMessages.map(m => m.message || m).join('; ') || 'Unknown error from Leegality API';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    return response.data;
  } catch (error) {
    console.error("Leegality Service: Error deleting document:", error);
    throw error;
  }
};

/**
 * Search documents in Leegality
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.q - Search query (searches in document names, documentIDs, IRNs)
 * @param {string} searchParams.status - Filter by status (DRAFT, SENT, RECEIVED, SIGNED, COMPLETED, EXPIRED)
 * @param {number} searchParams.max - Maximum number of records (default: 20, max: 40)
 * @param {number} searchParams.offset - Offset for pagination
 * @returns {Promise} Search results
 */
export const searchDocuments = async (searchParams = {}) => {
  try {
    if (!LEGALITY_AUTH_TOKEN) {
      throw new Error("Leegality Auth Token is required. Set REACT_APP_LEEGALITY_AUTH_TOKEN in your .env file.");
    }

    const params = {};
    if (searchParams.q) params.q = searchParams.q;
    if (searchParams.status) params.status = searchParams.status;
    if (searchParams.max) params.max = searchParams.max;
    if (searchParams.offset) params.offset = searchParams.offset;

    const response = await axios.get(
      `${LEGALITY_API_BASE}/sign/request/list`,
      {
        params,
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
        },
        timeout: 30000,
      }
    );

    if (response.data?.status !== 0) {
      const errorMessages = response.data?.messages || [];
      const errorMsg = errorMessages.map(m => m.message || m).join('; ') || 'Unknown error from Leegality API';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    return response.data?.data || { total: 0, documents: [] };
  } catch (error) {
    console.error("Leegality Service: Error searching documents:", error);
    throw error;
  }
};

/**
 * Reactivate an expired document
 * @param {string} documentId - Document ID to reactivate
 * @param {Object} options - Reactivation options
 * @param {number} options.expiryDays - New expiry period in days (-1 for 45 minutes, 0 for same day, 1+ for days)
 * @param {number} options.expiryTime - New expiry time as long format date (max 365 days)
 * @returns {Promise} Reactivation response
 */
export const reactivateDocument = async (documentId, options = {}) => {
  try {
    if (!LEGALITY_AUTH_TOKEN) {
      throw new Error("Leegality Auth Token is required. Set REACT_APP_LEEGALITY_AUTH_TOKEN in your .env file.");
    }

    if (!documentId) {
      throw new Error("Document ID is required.");
    }

    const payload = {
      documentId,
      expiryDays: options.expiryDays !== undefined ? options.expiryDays : 10,
    };

    if (options.expiryTime) {
      payload.expiryTime = options.expiryTime;
    }

    const response = await axios.post(
      `${LEGALITY_API_BASE}/sign/request/reactivate`,
      payload,
      {
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (response.data?.status !== 0) {
      const errorMessages = response.data?.messages || [];
      const errorMsg = errorMessages.map(m => m.message || m).join('; ') || 'Unknown error from Leegality API';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    return response.data?.data || {};
  } catch (error) {
    console.error("Leegality Service: Error reactivating document:", error);
    throw error;
  }
};

/**
 * Prepare template fields for Leegality Template workflow
 * Maps contract data to template field names
 * 
 * @param {Object} contractData - Contract data
 * @param {Object} fieldMapping - Mapping of contract data keys to template field names
 *   Example: { "clientName": "ClientName", "totalAmount": "TotalAmount" }
 *   If not provided, uses default mapping
 * @returns {Object} Fields object ready for Leegality API
 * 
 * Note: Get the exact field names from your Leegality Dashboard:
 * 1. Go to your Workflow
 * 2. Click "Download Form Fields" 
 * 3. Use those field names in the fieldMapping
 */
export const prepareTemplateFields = (contractData, fieldMapping = {}) => {
  // Default field mapping (customize based on your template)
  const defaultMapping = {
    clientName: "ClientName",
    professionalName: "ProfessionalName",
    quoteId: "QuoteId",
    totalAmount: "TotalAmount",
    date: "Date",
    termsAndConditions: "TermsAndConditions",
    // Add more mappings as needed
  };

  const mapping = { ...defaultMapping, ...fieldMapping };
  const fields = {};

  // Map contract data to template fields
  Object.keys(mapping).forEach(key => {
    const templateFieldName = mapping[key];
    if (contractData[key] !== undefined && contractData[key] !== null) {
      // Format the value appropriately
      let value = contractData[key];
      
      // Format dates
      if (key === 'date' && value instanceof Date) {
        value = value.toLocaleDateString('en-IN');
      }
      
      // Format amounts
      if (key === 'totalAmount' && typeof value === 'number') {
        value = `₹${value.toLocaleString("en-IN")}`;
      }
      
      fields[templateFieldName] = String(value);
    }
  });

  return fields;
};

/**
 * Generate contract document HTML/text from contract data
 * Note: This is for PDF workflows. For Template workflows, use prepareTemplateFields() instead.
 */
export const generateContractDocument = (contractData) => {
  // This function generates the complete Master Service Agreement HTML document
  const {
    clientName,
    professionalName,
    quoteId,
    totalAmount,
    summary,
    deliverables,
    termsAndConditions,
  } = contractData;

  const formattedDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  // Generate complete HTML document with all sections
  const htmlDocument = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Master Service Agreement - ${quoteId}</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 40px; 
          line-height: 1.6;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
        }
        h1 { 
          color: #dc2626; 
          font-size: 28px;
          margin-bottom: 20px;
          border-bottom: 3px solid #dc2626;
          padding-bottom: 10px;
        }
        h2 { 
          color: #1f2937; 
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 5px;
        }
        h3 { 
          color: #374151; 
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        h4 { 
          color: #4b5563; 
          font-size: 14px;
          font-weight: 600;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        .section { 
          margin-bottom: 30px; 
          border-left: 4px solid #dc2626;
          padding-left: 20px;
        }
        .header-info {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .header-info p {
          margin: 5px 0;
        }
        ul { 
          margin-left: 20px; 
          margin-top: 10px;
        }
        li { 
          margin-bottom: 8px; 
        }
        strong {
          color: #1f2937;
        }
        .signature-section {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left; 
        }
        th { 
          background-color: #dc2626; 
          color: white; 
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>MASTER SERVICE AGREEMENT (MSA)</h1>
      
      <div class="header-info">
        <p><strong>Between:</strong> ${clientName} & ${professionalName}</p>
        <p><strong>Platform:</strong> Huelip (as Neutral Technology & Escrow Workflow Provider)</p>
        <p><strong>Jurisdiction:</strong> Delhi Only</p>
        <p><strong>Quote Reference:</strong> ${quoteId}</p>
        <p><strong>Total Contract Value:</strong> ₹${Number(totalAmount).toLocaleString("en-IN")}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
      </div>

      <h2>MASTER SERVICE AGREEMENT TERMS & CONDITIONS</h2>

      <div class="section">
        <h3>SECTION 1 — DEFINITIONS</h3>
        <div>
          <h4>1.1 Project</h4>
          <p>The term "Project" refers to the complete scope of interior/architectural work defined in the approved quotation/BOQ. This includes all tasks, materials, services, and measurable units that together create the total value of the project. Every task listed in the BOQ carries a monetary value and a corresponding percentage weightage contributing to the total project cost.</p>
        </div>
        <div>
          <h4>1.2 Escrow Account</h4>
          <p>An account exclusively used to hold the Client's funds safely until approval conditions are met. The Platform automates all deposits, calculations, percentage-based milestones, payouts, deductions, penalties, buffers, and refunds. The Professional never receives funds directly unless released by the system after approvals.</p>
        </div>
        <div>
          <h4>1.3 BOQ / Quotation</h4>
          <p>A line-item schedule listing every task, material, and service with its unit rate, quantity, total value, and its equivalent percentage of the total project cost. The BOQ determines work completion percentage and therefore the release of payments.</p>
        </div>
        <div>
          <h4>1.4 Percentage-Based Work Completion</h4>
          <p>Each task in the BOQ holds a fixed percentage value. When a task is completed and approved, that percentage is marked as completed. Payment releases and remaining balances are computed based strictly on these percentages rather than subjective milestones.</p>
        </div>
        <div>
          <h4>1.5 Binary Task Approval System</h4>
          <p>Once a Professional marks a task as completed, it moves to Client Approval. The Client may either Approve, Request Rework, or Dispute. No partial approvals exist. Approved tasks become "Completed %" for payment calculation.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 2 — ROLE OF PLATFORM (Huelip)</h3>
        <div>
          <h4>2.1 Non-Party Role</h4>
          <p>The Platform acts solely as a neutral facilitator providing escrow, workflow automation, dispute moderation, backup professional provisioning, and system calculations. The Platform is not and shall not become a party to the legal contract. Liability for execution remains exclusively between Client and Professional, except where the Platform intervenes for dispute moderation or replacement procedures.</p>
        </div>
        <div>
          <h4>2.2 Escrow Management</h4>
          <p>The Platform manages the escrow account logic wherein funds are received, held, calculated, and released strictly based on percentage rules. The Platform ensures that at no time can funds be released earlier or later than the approved progress calculation. All workflows, conditions, penalties, replacements, buffers, and exit rules are software-enforced.</p>
        </div>
        <div>
          <h4>2.3 No Guarantee of Work</h4>
          <p>The Platform does not guarantee quality of design, execution, timelines, materials, labour, or compliance. Its responsibility is limited to maintaining an accurate, unbiased, algorithmic financial flow and dispute moderation.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 3 — PROJECT INITIATION</h3>
        <div>
          <h4>3.1 Quotation Approval</h4>
          <p>The Client shall review and approve the BOQ prepared by the Professional. Once approved, this BOQ becomes the official basis for work percentage, completion tracking, deposit value, and payment release.</p>
        </div>
        <div>
          <h4>3.2 Initial Escrow Deposit</h4>
          <p>The Client must deposit funds according to the buffer rules defined below before work can begin. The system will not allow project activation until the required deposit level is achieved.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 4 — ESCROW FUNDS, BUFFERS & HIGH-VALUE ITEM RULE</h3>
        <div>
          <h4>4.1 Standard 20% Buffer Rule</h4>
          <p>The Client must maintain a deposit equal to the Completed % + 20% buffer. This ensures the Professional always has financial security for upcoming work. This buffer exists to create cash availability in case a large number of tasks are completed rapidly, ensuring the Professional is never underfunded during project flow.</p>
        </div>
        <div>
          <h4>4.2 Maximum Deposit Limit</h4>
          <p>The Client cannot deposit more than 100% of the project value, even with buffer rules. If buffer calculations exceed 100%, the value is capped at the total project cost, ensuring financial rationality and preventing over-depositing beyond the contract amount.</p>
        </div>
        <div>
          <h4>4.3 High-Value Item Rule</h4>
          <p>If any single task holds a value exceeding 20% of the total project cost, the system requires a special buffer. In such cases, the Client must maintain a deposit equal to (value of the highest task + 20%), ensuring adequate coverage even if the largest task begins first. <strong>Example:</strong> If a project is ₹100,000 and one task equals ₹40,000, the escrow must hold ₹60,000 before work begins.</p>
        </div>
        <div>
          <h4>4.4 Automated Deposit Alerts</h4>
          <p>The Platform notifies the Client whenever the balance falls below required levels. Work cannot progress until the deposit again meets required buffer parameters.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 5 — WORK COMPLETION & APPROVAL SYSTEM</h3>
        <div>
          <h4>5.1 Task Completion Submission</h4>
          <p>The Professional completes a listed BOQ task and submits photographic/graphic evidence or documentation through the Platform. The system records the submission time and moves the task to Client Approval.</p>
        </div>
        <div>
          <h4>5.2 Client Approval (Binary)</h4>
          <p>The Client receives a task marked as "Completed" and must choose one of the following within 48 hours:</p>
          <ul>
            <li><strong>Approve</strong> — Task is marked "100% Complete"</li>
            <li><strong>Rework Required</strong> — Professional must redo/adjust work</li>
            <li><strong>Dispute</strong> — Task is escalated for Platform moderation</li>
          </ul>
        </div>
        <div>
          <h4>5.3 Rework Rule</h4>
          <p>If Rework is selected, the Professional must address concerns and resubmit for approval. Rework does not change BOQ percentage unless the work is approved.</p>
        </div>
        <div>
          <h4>5.4 Dispute Resolution (48 Hours)</h4>
          <p>If a task moves to Dispute:</p>
          <ul>
            <li>The Platform examines evidence from both parties</li>
            <li>The Platform performs site inspection (if required)</li>
            <li>A final decision is issued within 48 hours</li>
            <li>Decision is binding on both parties</li>
          </ul>
        </div>
        <div>
          <h4>5.5 Professional Payout Calculation</h4>
          <p>The Professional receives Completed % – 15% withheld adjustment. This ensures:</p>
          <ul>
            <li>Client safety</li>
            <li>Performance accountability</li>
            <li>Incentive for Professional to complete entire project</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 6 — PAYMENT FLOW & WITHDRAWALS</h3>
        <div>
          <h4>6.1 When Client Approves</h4>
          <p>The system releases payment instantly:</p>
          <ul>
            <li>Professional receives: Completed% minus 15% hold</li>
            <li>Escrow retains: 15% until project end</li>
            <li>Client balance reduces accordingly</li>
          </ul>
        </div>
        <div>
          <h4>6.2 Client Deposit Requirements</h4>
          <p>If approval increases "Completed %", the Client must immediately top up the escrow to maintain the required buffer (20% above completed) or as per high-value item rule.</p>
        </div>
        <div>
          <h4>6.3 When Project Reaches 100%</h4>
          <p>Once all tasks are completed and approved:</p>
          <ul>
            <li>Professional receives remaining 15% withheld amount</li>
            <li>Client buffer is returned entirely</li>
            <li>Project is marked as completed officially</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 7 — DELAYS & PENALTIES</h3>
        <div>
          <h4>7.1 Client Payment Delay Penalty</h4>
          <p>If the Client does not deposit required funds within 7 days:</p>
          <ul>
            <li>Project is automatically paused</li>
            <li>A delay penalty of 1% per week is applicable on unpaid buffer</li>
            <li>The Professional may escalate to dispute after 14 days</li>
          </ul>
        </div>
        <div>
          <h4>7.2 Professional Work Delay Penalty</h4>
          <p>If the Professional delays a task beyond 7 days (without valid reason):</p>
          <ul>
            <li>A delay penalty between 1%–2% of the task value may be deducted</li>
            <li>Repeated delays may trigger replacement under the Professional Exit rules</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 8 — CLIENT EXIT POLICY</h3>
        <div>
          <h4>8.1 Client-Initiated Exit</h4>
          <p>If the Client wishes to exit the project for reasons including lack of funds, relocation, illness, dissatisfaction unrelated to proven quality issues, or personal decision:</p>
          <ul>
            <li>Platform deducts 5% of remaining escrow balance for the Professional</li>
            <li>Platform deducts 5% of remaining escrow balance for operational management, arbitration, replacements, and system load</li>
            <li>Client receives 90% of the remaining escrow funds</li>
          </ul>
          <p>This ensures fairness because the Professional loses projected future income, and the Platform manages termination and administrative processes.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 9 — PROFESSIONAL EXIT POLICY</h3>
        <div>
          <h4>9.1 If Professional Abandons Project</h4>
          <p>If the Professional exits due to financial issues, labour shortage, business shutdown, negligence, or any avoidable reason:</p>
          <ul>
            <li>Professional forfeits 15% of total project value held as withheld adjustment</li>
            <li>Platform uses 10% of this amount to pay a new Professional who takes over</li>
            <li>Platform retains 5% for administrative effort, verification, onboarding, and project stability</li>
          </ul>
        </div>
        <div>
          <h4>9.2 Platform Replacement Guarantee</h4>
          <p>The Platform will:</p>
          <ul>
            <li>Provide a replacement Professional from its network</li>
            <li>Ensure the new Professional continues the project at the same BOQ values</li>
            <li>Ensure no additional cost burden is placed on the Client</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 10 — QUALITY ISSUES</h3>
        <div>
          <h4>10.1 Quality Assessment</h4>
          <p>If the Client alleges quality issues:</p>
          <ul>
            <li>Platform inspects evidence or site</li>
            <li>Professionals must comply with Industry Standard Quality</li>
            <li>Platform decides whether rework is required</li>
            <li>Professional must complete rework without additional cost unless Client requests a scope change</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 11 — DISPUTE RESOLUTION & ARBITRATION</h3>
        <div>
          <h4>11.1 Internal Platform Dispute System</h4>
          <p>All disputes (task approval, delays, quality) must first undergo platform moderation.</p>
        </div>
        <div>
          <h4>11.2 Arbitration Fee</h4>
          <p>If escalated to legal arbitration:</p>
          <ul>
            <li>Total fee: 1% of total project cost</li>
            <li>0.5% paid by Client</li>
            <li>0.5% paid by Professional</li>
          </ul>
        </div>
        <div>
          <h4>11.3 Jurisdiction</h4>
          <p>All disputes shall exclusively fall under Delhi jurisdiction.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 12 — TERMINATION</h3>
        <div>
          <h4>12.1 Platform-Triggered Termination</h4>
          <p>The Platform may terminate the project in case of fraud, unethical behaviour, or breach of platform rules.</p>
        </div>
        <div>
          <h4>12.2 Effect of Termination</h4>
          <p>All funds are handled under the exit rules outlined above.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 13 — TAXES, GOVERNMENT CHARGES, AND BILLING</h3>
        <div>
          <h4>13.1 Applicability of Taxes and Government Charges</h4>
          <p>All applicable taxes, including but not limited to Goods & Services Tax (GST), cess, duties, and other statutory levies, arising out of the project shall be borne by the respective party as outlined below. Both Client and Professional acknowledge that compliance with tax regulations is mandatory, and all payments routed through the Platform are subject to applicable statutory charges.</p>
        </div>
        <div>
          <h4>13.2 Responsibility for Taxes</h4>
          <p><strong>Professional:</strong> The Professional is responsible for charging applicable GST on all service charges, including material handling if applicable, and for remitting it to the Government as per law.</p>
          <p><strong>Client:</strong> The Client shall bear applicable taxes, duties, or government charges on the project cost, including those levied on materials, construction services, or digital transaction fees, as required by law.</p>
        </div>
        <div>
          <h4>13.3 Billing Procedure</h4>
          <p>The Professional shall generate all invoices for completed work, task-wise or cumulative, including the calculated GST and any other government charges. Invoices must comply with statutory regulations, be itemized according to the BOQ/task percentage, and include tax details for clarity. All invoices must be uploaded and shared through the Platform. The Platform acts only as a record-keeping and visibility tool for both parties; it is not responsible for tax remittance.</p>
        </div>
        <div>
          <h4>13.4 Payment Against Invoices</h4>
          <p>The Client shall release payment only against Platform-shared invoices. Payments made outside this workflow will not be recognized for project completion or escrow reconciliation. Escrow releases and deductions (including Platform commission) will be calculated based on invoice values uploaded on the Platform.</p>
        </div>
        <div>
          <h4>13.5 Tax Compliance Declaration</h4>
          <p>Both parties declare that they will comply with all tax-related obligations under Indian law. The Professional will issue GST-compliant invoices and provide proof of transaction if requested by the Client. Any penalty, fine, or interest due to statutory non-compliance will be borne by the party responsible for filing and payment of that tax.</p>
        </div>
        <div>
          <h4>13.6 Transparency and Record-Keeping</h4>
          <p>The Platform will maintain all invoice records and payment history for audit and dispute purposes. Both Client and Professional agree to rely on these records for validation of payments, deductions, and tax compliance. No manual or off-platform agreements shall override this system.</p>
        </div>
      </div>

      <div class="section">
        <h3>SECTION 14 — PLATFORM COMMISSION FROM PROFESSIONAL</h3>
        <div>
          <h4>14.1 Commission Applicability</h4>
          <p>The Professional agrees that every time a payment is released from the Escrow Account into the Professional's registered bank account, the Platform shall automatically deduct a pre-defined commission percentage. This commission applies strictly on the amount that is being released and not on the total project value. The commission is deducted instantly through the automated system and the Professional receives the net amount after deduction. This ensures that charges are transaction-linked and transparent, with no hidden fees beyond the agreed percentage.</p>
        </div>
        <div>
          <h4>14.2 Commission Rate</h4>
          <p>The commission percentage shall be clearly visible to the Professional before project activation. The standard range is 1%–5%, depending on the project category, location, service type, professional tier, and operational load. The exact commission rate applicable to the specific project is auto-generated within the Platform dashboard and accepted by the Professional at the time of BOQ approval. Once accepted, the commission rate becomes binding for the entire project duration.</p>
        </div>
        <div>
          <h4>14.3 Timing of Deduction</h4>
          <p>The commission is deducted at the moment the payout is triggered, meaning when a completed percentage of work is approved by the Client and the corresponding amount becomes releasable. This ensures that:</p>
          <ul>
            <li>The Platform earns only when the Professional earns</li>
            <li>There is no upfront fee or onboarding fee</li>
            <li>Commission is proportionate to actual work completed and approved</li>
          </ul>
        </div>
        <div>
          <h4>14.4 No Commission on Held Amount</h4>
          <p>The 15% withheld amount (held until full project completion) is not subject to commission at the time of withholding. Commission applies only at the final release when the retained amount is disbursed after successful project completion. This protects the interests of both parties and ensures fairness throughout the process.</p>
        </div>
        <div>
          <h4>14.5 GST & Taxes</h4>
          <p>Any applicable taxes, including GST on the Platform's commission, will be charged additionally and reflected transparently in the payment invoice generated for the Professional. The Professional agrees to bear these taxes as per statutory requirements. The Platform will provide downloadable tax invoices for the Professional's accounting and filing requirements.</p>
        </div>
        <div>
          <h4>14.6 Non-Refundable Commission</h4>
          <p>Once a payment is released and the commission is deducted, such commission shall be non-refundable under all circumstances, including Client exit, Professional exit, project suspension, or reductions in scope. This ensures financial stability and fairness, as the Platform's services (escrow handling, workflow automation, dispute moderation, documentation) are already rendered at the time of release.</p>
        </div>
        <div>
          <h4>14.7 System Automation and Transparency</h4>
          <p>The commission deduction is handled entirely by the automated system without manual interference. The Professional will have real-time access to commission calculations, deduction amounts, and net payout values through the Platform dashboard. All commission-related transactions are recorded and available for audit purposes.</p>
        </div>
      </div>

      ${summary && summary.length > 0 ? `
      <div class="section">
        <h2>Quotation Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${summary.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.description || item.name || item.item || 'N/A'}</td>
                <td>${item.quantity || item.qty || '-'}</td>
                <td>₹${Number(item.unitRate || item.rate || 0).toLocaleString("en-IN")}</td>
                <td>₹${Number(item.total || item.amount || 0).toLocaleString("en-IN")}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${deliverables && deliverables.length > 0 ? `
      <div class="section">
        <h2>Deliverables</h2>
        <ul>
          ${deliverables.map(deliverable => `<li>${deliverable}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="signature-section">
        <h2>Signatures</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Client Signature:</strong> ${contractData.clientSignature || "Pending"}</p>
        <p style="margin-top: 30px;">This agreement is executed electronically through the Huelip Platform and is legally binding upon both parties.</p>
      </div>
    </body>
    </html>
  `;

  return htmlDocument;
};

