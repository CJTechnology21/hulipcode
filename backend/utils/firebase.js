
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});
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