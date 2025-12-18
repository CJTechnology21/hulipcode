/**
 * Email Adapter
 * Supports both real email sending (via Nodemailer) and mock mode for development
 * Configure SMTP settings in .env file:
 * - SMTP_HOST (e.g., smtp.gmail.com)
 * - SMTP_PORT (e.g., 587)
 * - SMTP_USER (your email)
 * - SMTP_PASS (your email password or app password)
 * - SMTP_FROM (sender email address)
 * 
 * If SMTP settings are not configured, falls back to mock mode (console logging)
 */

const nodemailer = require('nodemailer');

// Check if SMTP is configured
const isSmtpConfigured = 
  process.env.SMTP_HOST && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASS;

// Create transporter if SMTP is configured
let transporter = null;

if (isSmtpConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('✅ [EMAIL ADAPTER] SMTP configured:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER,
    });
  } catch (error) {
    console.error('❌ [EMAIL ADAPTER] Failed to create transporter:', error.message);
    transporter = null;
  }
} else {
  console.warn('⚠️ [EMAIL ADAPTER] SMTP not configured. Running in MOCK mode (emails will be logged only).');
  console.warn('   To enable real emails, add SMTP settings to .env file:');
  console.warn('   SMTP_HOST=smtp.gmail.com');
  console.warn('   SMTP_PORT=587');
  console.warn('   SMTP_USER=your-email@gmail.com');
  console.warn('   SMTP_PASS=your-app-password');
  console.warn('   SMTP_FROM=your-email@gmail.com');
}

/**
 * Send email notification
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.body - Plain text body
 * @param {string} params.html - HTML body (optional)
 * @param {Object} params.data - Additional data
 * @returns {Promise<Object>} Send result
 */
const send = async ({ to, subject, body, html, data = {} }) => {
  try {
    // Validate input
    if (!to || !subject || !body) {
      throw new Error('Missing required email fields: to, subject, body');
    }

    // If SMTP is configured, send real email
    if (transporter && isSmtpConfigured) {
      console.log('📧 [EMAIL ADAPTER] Sending real email via SMTP...');
      console.log('   To:', to);
      console.log('   Subject:', subject);

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: to,
        subject: subject,
        text: body,
        html: html || body,
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('✅ [EMAIL ADAPTER] Email sent successfully!');
      console.log('   Message ID:', info.messageId);
      console.log('   Response:', info.response);

      return {
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
        to,
        subject,
        sentAt: new Date().toISOString(),
        response: info.response,
      };
    } else {
      // Mock email sending - log to console
      console.log('📧 [EMAIL ADAPTER] MOCK MODE - Email would be sent:');
      console.log('   To:', to);
      console.log('   Subject:', subject);
      console.log('   Body:', body.substring(0, 200) + (body.length > 200 ? '...' : ''));
      if (html) {
        console.log('   HTML:', html.substring(0, 100) + '...');
      }
      console.log('   Data:', JSON.stringify(data, null, 2));
      console.log('');
      console.log('⚠️  To send real emails, configure SMTP settings in .env file');

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock success response
      return {
        success: true,
        provider: 'mock-email',
        messageId: `mock-email-${Date.now()}`,
        to,
        subject,
        sentAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('❌ [EMAIL ADAPTER] Error:', error.message);
    console.error('   Error details:', error);
    throw error;
  }
};

/**
 * Send bulk emails
 * @param {Array<Object>} emails - Array of email objects
 * @returns {Promise<Array>} Results array
 */
const sendBulk = async (emails) => {
  const results = [];
  for (const email of emails) {
    try {
      const result = await send(email);
      results.push({ success: true, ...result });
    } catch (error) {
      results.push({ success: false, error: error.message, to: email.to });
    }
  }
  return results;
};

module.exports = {
  send,
  sendBulk,
};

