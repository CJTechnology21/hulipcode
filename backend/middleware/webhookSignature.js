/**
 * Webhook Signature Validation Middleware
 * Validates webhook payload signatures from external providers
 * 
 * Currently implements mock validation for development/testing
 * Replace with actual signature verification for production
 */

const crypto = require('crypto');

/**
 * Mock signature validation for development/testing
 * In production, implement actual signature verification based on provider
 * 
 * @param {Object} payload - Webhook payload
 * @param {Object} headers - Request headers
 * @param {String} provider - Provider name ('castler', 'razorpay', 'leegality', etc.)
 * @returns {Boolean} - True if signature is valid
 */
const verifyWebhookSignature = (payload, headers, provider = 'mock') => {
  // In development/test mode, allow bypassing signature validation
  if (process.env.NODE_ENV === 'development' && headers['x-bypass-signature'] === 'true') {
    console.warn('⚠️  Signature validation bypassed (development mode)');
    return true;
  }

  // Mock validation - always returns true for testing
  // TODO: Implement actual signature verification based on provider
  switch (provider) {
    case 'castler':
      // Castler webhook signature verification
      // Example: HMAC SHA256 with secret key
      const castlerSecret = process.env.CASTLER_WEBHOOK_SECRET || 'mock-secret';
      const castlerSignature = headers['x-castler-signature'] || headers['signature'];
      
      if (!castlerSignature) {
        console.warn('⚠️  No Castler signature found in headers');
        return false;
      }

      // Mock validation - in production, verify HMAC signature
      const expectedSignature = crypto
        .createHmac('sha256', castlerSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return castlerSignature === expectedSignature || castlerSignature === 'mock-signature';

    case 'razorpay':
      // Razorpay webhook signature verification
      const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-secret';
      const razorpaySignature = headers['x-razorpay-signature'] || headers['signature'];

      if (!razorpaySignature) {
        console.warn('⚠️  No Razorpay signature found in headers');
        return false;
      }

      // Mock validation - in production, verify HMAC SHA256 signature
      const razorpayBody = JSON.stringify(payload);
      const expectedRazorpaySig = crypto
        .createHmac('sha256', razorpaySecret)
        .update(razorpayBody)
        .digest('hex');

      return razorpaySignature === expectedRazorpaySig || razorpaySignature === 'mock-signature';

    case 'leegality':
      // Leegality webhook signature verification
      const leegalitySecret = process.env.LEEGALITY_WEBHOOK_SECRET || process.env.LEEGALITY_PRIVATE_SALT || 'mock-secret';
      const leegalitySignature = headers['x-leegality-signature'] || headers['signature'] || headers['x-signature'];

      if (!leegalitySignature) {
        console.warn('⚠️  No Leegality signature found in headers');
        // Leegality may not always send signatures, allow if configured
        if (process.env.LEEGALITY_SKIP_SIGNATURE === 'true') {
          return true;
        }
        return false;
      }

      // Mock validation - in production, verify signature based on Leegality's method
      // Leegality typically uses HMAC SHA256 or similar
      const leegalityBody = JSON.stringify(payload);
      const expectedLeegalitySig = crypto
        .createHmac('sha256', leegalitySecret)
        .update(leegalityBody)
        .digest('hex');

      return leegalitySignature === expectedLeegalitySig || leegalitySignature === 'mock-signature';

    case 'mock':
    default:
      // Mock validation for testing - always returns true
      console.log('🔐 Using mock signature validation');
      return true;
  }
};

/**
 * Middleware to validate webhook signatures
 * @param {String} provider - Provider name ('castler', 'razorpay', 'leegality', 'mock')
 */
const validateWebhookSignature = (provider = 'mock') => {
  return (req, res, next) => {
    try {
      const payload = req.body;
      const headers = req.headers;

      // Log webhook attempt
      console.log(`📥 Webhook received from ${provider}:`, {
        timestamp: new Date().toISOString(),
        hasSignature: !!(headers['x-signature'] || headers[`x-${provider}-signature`] || headers['signature']),
      });

      // Validate signature
      const isValid = verifyWebhookSignature(payload, headers, provider);

      if (!isValid) {
        console.error('❌ Invalid webhook signature:', {
          provider,
          headers: Object.keys(headers),
        });
        return res.status(401).json({
          success: false,
          error: 'Invalid webhook signature',
          message: 'Webhook signature verification failed',
        });
      }

      // Attach provider info to request
      req.webhookProvider = provider;
      req.webhookValidated = true;

      console.log('✅ Webhook signature validated');
      next();
    } catch (error) {
      console.error('❌ Error validating webhook signature:', error);
      return res.status(500).json({
        success: false,
        error: 'Error validating webhook signature',
        message: error.message,
      });
    }
  };
};

/**
 * Generate mock signature for testing
 * @param {Object} payload - Payload to sign
 * @param {String} provider - Provider name
 * @returns {String} Mock signature
 */
const generateMockSignature = (payload, provider = 'mock') => {
  const secret = process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`] || 'mock-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
};

module.exports = {
  validateWebhookSignature,
  verifyWebhookSignature,
  generateMockSignature,
};

