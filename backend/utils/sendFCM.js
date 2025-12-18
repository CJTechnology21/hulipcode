const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Lazy Firebase initialization - only initialize if serviceAccountKey.json exists
let firebaseInitialized = false;
let firebaseAvailable = false;

const initializeFirebase = () => {
  if (firebaseInitialized) {
    return firebaseAvailable;
  }

  firebaseInitialized = true;

  try {
    // Check both backend/utils/ and backend/ root for serviceAccountKey.json
    const serviceAccountPath1 = path.join(__dirname, 'serviceAccountKey.json');
    const serviceAccountPath2 = path.join(__dirname, '..', 'serviceAccountKey.json');
    const serviceAccountPath = fs.existsSync(serviceAccountPath1) 
      ? serviceAccountPath1 
      : (fs.existsSync(serviceAccountPath2) ? serviceAccountPath2 : null);
    
    // Check if service account file exists
    if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
      console.warn('⚠️  Firebase serviceAccountKey.json not found. Push notifications will be disabled.');
      console.warn('   To enable push notifications, add serviceAccountKey.json to backend/ or backend/utils/');
      firebaseAvailable = false;
      return false;
    }

    // Initialize Firebase Admin
    const serviceAccount = require(serviceAccountPath);
    
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    
    firebaseAvailable = true;
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    console.warn('⚠️  Push notifications will be disabled.');
    firebaseAvailable = false;
    return false;
  }
};

/**
 * Send FCM notification
 * @param {string} token - Device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} orderId - Optional order ID
 */
const sendFCM = async (token, title, body, orderId = '') => {
  // Initialize Firebase if not already done
  if (!initializeFirebase()) {
    console.warn('⚠️  FCM not available - serviceAccountKey.json missing or invalid');
    return null;
  }

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
    return response;
  } catch (err) {
    console.error('❌ Error sending FCM:', err.message);
    throw err;
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
