const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const PRIVATE_SALT = process.env.LEEGALITY_PRIVATE_SALT;

router.post("/leegality/webhook", async (req, res) => {
  try {
    console.log("📩 Leegality Webhook Received");
    console.log(JSON.stringify(req.body, null, 2));

    const { documentId, mac, status, files, auditTrail } = req.body?.data || {};

    if (!documentId || !mac) {
      return res.status(400).send("Invalid webhook payload");
    }

    // 🔐 MAC Verification
    const expectedMac = crypto
      .createHmac("sha1", PRIVATE_SALT)
      .update(documentId)
      .digest("hex");

    if (expectedMac !== mac) {
      console.error("❌ MAC verification failed");
      return res.status(401).send("Unauthorized webhook");
    }

    console.log("✅ MAC verification successful");

    // ✅ Signed successfully
    if (status === "COMPLETED") {
      console.log("✅ Document signed:", documentId);

      // ⬇ Download signed PDF (CDN valid for 15 sec)
      await downloadFromCDN(files?.[0]?.url, `${documentId}.pdf`);
      await downloadFromCDN(auditTrail?.url, `${documentId}-audit.pdf`);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("ERROR");
  }
});

// ⬇ CDN downloader
async function downloadFromCDN(url, filename) {
  if (!url) return;

  const response = await axios.get(url, { responseType: "arraybuffer" });

  const dir = path.join(__dirname, "../signed-contracts");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(path.join(dir, filename), response.data);

  console.log("📄 Saved:", filename);
}

module.exports = router;






