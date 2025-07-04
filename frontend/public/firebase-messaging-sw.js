
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAdTUZqgmIHRBW8xosxyQK3xusMKx4ZezM",
  authDomain: "huelip.firebaseapp.com",
  projectId: "huelip",
  storageBucket: "huelip.firebasestorage.app",
  messagingSenderId: "253191258482",
  appId: "1:253191258482:web:200aff18519dd354acddeb",
  measurementId: "G-K2T6183W3Z"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;


  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyAdTUZqgmIHRBW8xosxyQK3xusMKx4ZezM",
//   authDomain: "huelip.firebaseapp.com",
//   projectId: "huelip",
//   messagingSenderId: "253191258482",
//   appId: "1:253191258482:web:200aff18519dd354acddeb",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("📦 Background Message Payload:", payload);

//   // Prefer payload.data if available (in case of FCM custom payloads)
//   const title = payload.notification?.title || payload.data?.title || "New Order";
//   const body = payload.notification?.body || payload.data?.body || "You have a new order";
//   const url = payload.data?.url || "/vendor/orders"; // fallback URL

//   const notificationOptions = {
//     body,
//     icon: "/logo.png",
//     data: { url },
//   };

//   self.registration.showNotification(title, notificationOptions);
// });

// // ✅ Optional: Handle notification click
// self.addEventListener("notificationclick", function (event) {
//   event.notification.close();

//   const targetUrl = event.notification?.data?.url || "/";
//   event.waitUntil(clients.openWindow(targetUrl));
// });