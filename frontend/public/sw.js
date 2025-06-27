
// ✅ Service Worker installed
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
  self.skipWaiting(); // Activate immediately
});

// ✅ Service Worker activated
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated");
  return self.clients.claim(); // Take control of pages
});

// ✅ Push received
self.addEventListener("push", function (event) {
  console.log("📬 Push Received");
  if (!event.data) {
    console.warn("⚠️ Push event has no data");
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error("❌ Failed to parse push data", e);
    return;
  }

  const options = {
    body: data.body,
    // icon: data.icon || "/logo192.png",
    // badge: data.badge || "/logo192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "🛎 Notification", options)
  );
});

// ✅ Notification clicked
self.addEventListener("notificationclick", function (event) {
  console.log("🖱 Notification clicked");
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// // ✅ Handle incoming push
// self.addEventListener('push', function (event) {
//   console.log("🔔 Push received", event);

//   const data = event.data.json();
//   const options = {
//     body: data.body,
//     icon: data.icon || '/logo192.png',
//     badge: '/logo192.png',
//     data: {
//       url: data.url || '/',
//     },
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title, options)
//   );
// });

// // ✅ Handle notification click
// self.addEventListener('notificationclick', function (event) {
//   console.log("🖱️ Notification clicked", event.notification);
//   event.notification.close();

//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );
// });