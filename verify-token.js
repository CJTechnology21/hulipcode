/**
 * Quick script to verify your Leegality token is from Sandbox
 * Run: node verify-token.js
 */

const axios = require("axios");
require("dotenv").config({ path: "./backend/.env" });

const TOKEN = process.env.LEEGALITY_AUTH_TOKEN || "bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA";

console.log("🔍 Verifying Leegality Token Environment...\n");
console.log("Token preview:", TOKEN.substring(0, 20) + "...\n");

// Test Sandbox endpoint
async function testSandbox() {
  try {
    console.log("Testing Sandbox endpoint: https://sandbox.leegality.com/api/v3.0/sign/request");
    const response = await axios.post(
      "https://sandbox.leegality.com/api/v3.0/sign/request",
      {
        profileId: "test",
        file: { name: "test.pdf" }
      },
      {
        headers: {
          "X-Auth-Token": TOKEN,
          "Content-Type": "application/json"
        },
        validateStatus: () => true // Don't throw on any status
      }
    );

    if (response.status === 401) {
      console.log("❌ Token is NOT from Sandbox (401 Unauthorized)");
      return false;
    } else if (response.status === 400) {
      console.log("✅ Token is from Sandbox! (400 = Bad Request, but auth passed)");
      console.log("   (The 400 is expected because we sent invalid data, but auth worked)");
      return true;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      return null;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Token is NOT from Sandbox (401 Unauthorized)");
      return false;
    }
    console.log("⚠️  Error:", error.message);
    return null;
  }
}

// Test Production endpoint
async function testProduction() {
  try {
    console.log("\nTesting Production endpoint: https://app1.leegality.com/api/v3.0/sign/request");
    const response = await axios.post(
      "https://app1.leegality.com/api/v3.0/sign/request",
      {
        profileId: "test",
        file: { name: "test.pdf" }
      },
      {
        headers: {
          "X-Auth-Token": TOKEN,
          "Content-Type": "application/json"
        },
        validateStatus: () => true
      }
    );

    if (response.status === 401) {
      console.log("❌ Token is NOT from Production (401 Unauthorized)");
      return false;
    } else if (response.status === 400) {
      console.log("✅ Token is from Production! (400 = Bad Request, but auth passed)");
      console.log("   (The 400 is expected because we sent invalid data, but auth worked)");
      return true;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      return null;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Token is NOT from Production (401 Unauthorized)");
      return false;
    }
    console.log("⚠️  Error:", error.message);
    return null;
  }
}

// Run tests
async function main() {
  const sandboxResult = await testSandbox();
  const productionResult = await testProduction();

  console.log("\n" + "=".repeat(50));
  console.log("📊 RESULT:");
  console.log("=".repeat(50));

  if (sandboxResult === true) {
    console.log("✅ Your token is from SANDBOX");
    console.log("✅ Use this in your .env:");
    console.log("   LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0");
  } else if (productionResult === true) {
    console.log("✅ Your token is from PRODUCTION");
    console.log("✅ Use this in your .env:");
    console.log("   LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0");
  } else {
    console.log("❌ Could not determine token environment");
    console.log("   Please check manually in your Leegality dashboard");
  }
}

main().catch(console.error);



