const puppeteer = require("puppeteer");

exports.htmlToPdfBase64 = async (html) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  console.log("PDF Header Bytes:", Array.from(pdfBuffer.slice(0, 8)));
  console.log("PDF Size:", pdfBuffer.length, "bytes");
  console.log("Buffer type:", pdfBuffer.constructor.name);
  console.log("Is Buffer?", Buffer.isBuffer(pdfBuffer));

  // Ensure we have a proper Buffer object
  let buffer = pdfBuffer;
  if (!Buffer.isBuffer(pdfBuffer)) {
    console.log("⚠️ pdfBuffer is not a Buffer, converting...");
    buffer = Buffer.from(pdfBuffer);
  }

  // Convert buffer to base64 string
  const pdfBase64 = buffer.toString('base64');
  
  console.log("Base64 conversion result type:", typeof pdfBase64);
  console.log("Base64 first 50 chars:", pdfBase64.substring(0, 50));
  
  // Validate the base64 string
  if (!pdfBase64 || typeof pdfBase64 !== 'string') {
    throw new Error("Failed to convert PDF buffer to base64 string");
  }
  
  // Check if it's actually base64 (should NOT start with comma-separated numbers)
  if (/^\d+[,]/.test(pdfBase64)) {
    console.error("❌ ERROR: Base64 string starts with comma-separated numbers!");
    console.error("First 100 chars:", pdfBase64.substring(0, 100));
    throw new Error("PDF conversion error: Buffer was not converted to base64 correctly. Got comma-separated numbers instead of base64 string.");
  }
  
  // Validate base64 format (should contain only base64 characters)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(pdfBase64)) {
    console.error("❌ ERROR: Base64 string contains invalid characters!");
    console.error("First 100 chars:", pdfBase64.substring(0, 100));
    throw new Error("PDF conversion error: Invalid base64 format");
  }
  
  console.log("✅ Base64 conversion successful!");
  console.log("Base64 length:", pdfBase64.length);
  console.log("Base64 starts with:", pdfBase64.substring(0, 20));
  
  return pdfBase64;
};
