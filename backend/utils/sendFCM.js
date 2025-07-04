
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

/**
 * Send FCM notification
 * @param {string} token - Device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} orderId - Optional order ID
 */
const sendFCM = async (token, title, body, orderId = '') => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: {
      title,
      body,
      orderId: orderId.toString(),
    },
  };

  console.log('🚀 Sending FCM with payload:', JSON.stringify(message, null, 2));

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ FCM sent:', response);
  } catch (err) {
    console.error('❌ Error sending FCM:', err.message);
  }
};

module.exports = sendFCM;

// const admin = require('firebase-admin');
// admin.initializeApp({
//   credential: admin.credential.cert(require('./serviceAccountKey.json')),
// });

// /**
//  * Send FCM notification
//  * @param {string} token - Device token
//  * @param {string} title - Notification title
//  * @param {string} body - Notification body
//  * @param {string} orderId - Optional order ID
//  */
// const sendFCM = async (token, title, body, orderId = '') => {
//   const message = {
//     token,
//     notification: {
//       title,
//       body,
//     },
//     data: {
//       orderId: orderId.toString(),
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log('✅ FCM sent:', response);
//   } catch (err) {
//     console.error('❌ Error sending FCM:', err.message);
//   }
// };
