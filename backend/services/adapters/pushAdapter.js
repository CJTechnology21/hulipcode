/**
 * Push Notification Adapter
 * Uses Firebase Cloud Messaging (FCM) for push notifications
 */

const sendFCM = require('../../utils/sendFCM');

/**
 * Send push notification
 * @param {Object} params - Push notification parameters
 * @param {string} params.token - FCM device token
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {Object} params.data - Additional data
 * @returns {Promise<Object>} Send result
 */
const send = async ({ token, title, body, data = {} }) => {
  try {
    // Validate input
    if (!token || !title || !body) {
      throw new Error('Missing required push notification fields: token, title, body');
    }

    // Extract orderId or other IDs from data
    const orderId = data.orderId || data.taskId || data.projectId || '';

    // Send via FCM (may return null if Firebase not configured)
    const result = await sendFCM(token, title, body, orderId);

    // If Firebase is not available, return a mock success response
    if (result === null) {
      console.warn('⚠️  [PUSH ADAPTER] Firebase not configured - notification not sent');
      return {
        success: false,
        provider: 'fcm',
        messageId: null,
        token,
        title,
        body,
        sentAt: new Date().toISOString(),
        error: 'Firebase not configured',
        skipped: true,
      };
    }

    return {
      success: true,
      provider: 'fcm',
      messageId: result || `fcm-${Date.now()}`,
      token,
      title,
      body,
      sentAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [PUSH ADAPTER] Error:', error.message);
    // Don't throw - allow other notification channels to continue
    return {
      success: false,
      provider: 'fcm',
      error: error.message,
      token,
      title,
      body,
    };
  }
};

/**
 * Send bulk push notifications
 * @param {Array<Object>} notifications - Array of notification objects
 * @returns {Promise<Array>} Results array
 */
const sendBulk = async (notifications) => {
  const results = [];
  for (const notification of notifications) {
    try {
      const result = await send(notification);
      results.push({ success: true, ...result });
    } catch (error) {
      results.push({ success: false, error: error.message, token: notification.token });
    }
  }
  return results;
};

module.exports = {
  send,
  sendBulk,
};

