const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Lazy Firebase initialization - only initialize if serviceAccountKey.json exists
let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) {
    return;
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
      console.warn('⚠️  Firebase serviceAccountKey.json not found. Firebase features will be disabled.');
      console.warn('   To enable Firebase, add serviceAccountKey.json to backend/ or backend/utils/');
      return;
    }

    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    console.warn('⚠️  Firebase features will be disabled.');
  }
};

// Initialize Firebase
initializeFirebase();
const message = {
  token: 'fQlDUb0VFXl7i94TXUYgzz:APA91bGKKK6tJLlXffZ3GaKirMZNM4pruXDe1Nw_D_p1eBSxpz9IXVoEqcaPGhmsaRUIuQf30ursnkckeOxECoCYkJ1Q3BYMrOifCtUTVTuu7ewZ7lNgqIM',
  notification: {
    title: 'Test Notification',
    body: 'This is a test'
  },
  data: {
    title: 'Test Notification',
    body: 'This is a test',
    orderId: '12345' // optional extra field
  }
};


admin.messaging().send(message)
  .then(response => {
    console.log('Successfully sent message:', response);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });