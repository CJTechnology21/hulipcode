/**
 * SMS Adapter (Mock Provider)
 * Simulates SMS sending for development/testing
 * In production, replace with actual SMS service (Twilio, AWS SNS, etc.)
 */

/**
 * Send SMS notification
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number (E.164 format)
 * @param {string} params.message - SMS message text
 * @param {Object} params.data - Additional data
 * @returns {Promise<Object>} Send result
 */
const send = async ({ to, message, data = {} }) => {
  try {
    // Validate input
    if (!to || !message) {
      throw new Error('Missing required SMS fields: to, message');
    }

    // Validate phone number format (basic check)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/[\s-]/g, ''))) {
      throw new Error(`Invalid phone number format: ${to}`);
    }

    // Mock SMS sending - log to console
    console.log('📱 [SMS ADAPTER] Sending SMS:');
    console.log('   To:', to);
    console.log('   Message:', message);
    console.log('   Data:', JSON.stringify(data, null, 2));

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 150));

    // Mock success response
    return {
      success: true,
      provider: 'mock-sms',
      messageId: `mock-sms-${Date.now()}`,
      to,
      message,
      sentAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [SMS ADAPTER] Error:', error.message);
    throw error;
  }
};

/**
 * Send bulk SMS
 * @param {Array<Object>} messages - Array of SMS objects
 * @returns {Promise<Array>} Results array
 */
const sendBulk = async (messages) => {
  const results = [];
  for (const sms of messages) {
    try {
      const result = await send(sms);
      results.push({ success: true, ...result });
    } catch (error) {
      results.push({ success: false, error: error.message, to: sms.to });
    }
  }
  return results;
};

module.exports = {
  send,
  sendBulk,
};

