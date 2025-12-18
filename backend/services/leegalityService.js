/* ===========================================
   FINAL LEEGALITY INTEGRATION FOR app1 INSTANCE
   Using the correct endpoint:
   POST https://app1.leegality.com/api/v3.0/sign/request
   With profileId: 8Y5uAxC
   =========================================== */

const axios = require("axios");

// Ensure dotenv is loaded
if (!process.env.LEEGALITY_AUTH_TOKEN) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv might not be needed if already loaded in server.js
  }
}

const LEGALITY_AUTH_TOKEN = process.env.LEEGALITY_AUTH_TOKEN || "";
const LEGALITY_PROFILE_ID = process.env.LEEGALITY_PROFILE_ID || "8Y5uAxC";

console.log("Leegality Service initialized:", {
  hasToken: !!LEGALITY_AUTH_TOKEN,
  tokenPreview: LEGALITY_AUTH_TOKEN ? LEGALITY_AUTH_TOKEN.substring(0, 10) + "..." : "MISSING",
  profileId: LEGALITY_PROFILE_ID
});

exports.sendToLeegality = async ({ pdfBase64, fileName, signers }) => {
  try {
    console.log("=== Preparing Leegality Payload ===");

    // Ensure base64 is clean (no data URI prefix)
    let cleanBase64 = pdfBase64;
    if (typeof cleanBase64 === 'string') {
      // Remove data URI prefix if present
      cleanBase64 = cleanBase64.replace(/^data:application\/pdf;base64,/, '');
      cleanBase64 = cleanBase64.replace(/^data:.*;base64,/, '');
      cleanBase64 = cleanBase64.trim();
      
      // Check if it's a comma-separated string (incorrect format)
      // If it starts with numbers and commas, it's likely a buffer converted incorrectly
      if (/^\d+,\d+/.test(cleanBase64)) {
        console.error("❌ ERROR: pdfBase64 appears to be a comma-separated number string, not base64!");
        console.error("First 50 chars:", cleanBase64.substring(0, 50));
        throw new Error("Invalid PDF base64 format: received comma-separated numbers instead of base64 string");
      }
    }

    // Validate base64 format (should contain only base64 characters)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleanBase64)) {
      console.error("❌ ERROR: cleanBase64 does not match base64 format!");
      console.error("First 50 chars:", cleanBase64.substring(0, 50));
      throw new Error("Invalid base64 format: contains invalid characters");
    }

    const payload = {
      profileId: "8Y5uAxC",

      invitees: signers.map(s => ({
        name: s.name,
        email: s.email
      })),

      file: {
        name: fileName,
        file: cleanBase64  // Use cleaned base64, not raw pdfBase64
      }
    };

    console.log("DEBUG PAYLOAD FILE name:", payload.file.name);
    console.log("DEBUG BASE64 LENGTH:", cleanBase64?.length);
    console.log("DEBUG BASE64 START (first 50 chars):", cleanBase64?.substring(0, 50));
    console.log("DEBUG BASE64 VALID:", base64Regex.test(cleanBase64));

    console.log("Payload Preview:", JSON.stringify({
      profileId: payload.profileId,
      inviteesCount: payload.invitees.length,
      fileName: payload.file.name,
      fileSize: cleanBase64.length
    }));

    if (!LEGALITY_AUTH_TOKEN) {
      throw new Error("LEEGALITY_AUTH_TOKEN is not configured in .env file");
    }

    const res = await axios.post(
      "https://app1.leegality.com/api/v3.0/sign/request",
      payload,
      {
        headers: {
          "X-Auth-Token": LEGALITY_AUTH_TOKEN,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    console.log("=== Leegality Response ===");
    console.log("Status:", res.status);
    console.log("Response Data:", JSON.stringify(res.data, null, 2));

    // Check response status - Leegality uses status: 1 for success, status: 0 for errors
    if (res.data?.status === 0) {
      // This is an error response
      const errorMsg = res.data.messages?.map(m => m.message || m.code || m).join('; ') || 'Unknown error';
      throw new Error(`Leegality API Error: ${errorMsg}`);
    }

    // Check for error messages (but not success messages)
    if (res.data?.messages && res.data.messages.length > 0) {
      const errorMessages = res.data.messages.filter(m => 
        m.code && !m.code.includes('success') && !m.code.includes('Success')
      );
      
      if (errorMessages.length > 0) {
        const errorMsg = errorMessages.map(m => m.message || m.code || m).join('; ');
        throw new Error(`Leegality API Error: ${errorMsg}`);
      }
      // If all messages are success messages, continue
    }

    // Success! Return the response data
    console.log("✅ Leegality API call successful!");
    return res.data;

  } catch (error) {
    console.error("❌ Leegality API Error:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);
    
    const msg = error.response?.data?.messages?.[0]?.message || 
                error.response?.data?.error ||
                error.message;
    throw new Error("Leegality Sign Request Failed → " + msg);
  }
};
