
const express = require("express");
const router = express.Router();
const webpush = require("web-push");

// Replace with your real keys in production
webpush.setVapidDetails(
  'mailto:your@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let storedSubscription = null; // In production, save per user/vendor in DB

router.post("/api/subscribe", (req, res) => {
  storedSubscription = req.body.subscription;
  console.log("📬 Subscription received:", storedSubscription);
  res.status(201).json({ message: "Subscription saved" });
});

router.post("/api/push/test", async (req, res) => {
  if (!storedSubscription) {
    return res.status(400).json({ error: "No subscription stored" });
  }

  const payload = JSON.stringify({
    title: "🛒 New Order Received",
    body: "A new order was just placed!",
    url: "http://localhost:3000/orders"
  });

  try {
    await webpush.sendNotification(storedSubscription, payload);
    res.status(200).json({ message: "Push sent" });
  } catch (error) {
    console.error("Push error:", error);
    res.status(500).json({ error: "Push failed" });
  }
});

module.exports = router;
// const webpush = require("web-push");
// const express = require('express');
// const router = express.Router();
// router.post("/api/push/test", async (req, res) => {
//   const subscription = req.body.subscription;

//   const payload = JSON.stringify({
//     title: "🛒 New Order Received",
//     body: "A new customer has placed an order!",
//     url: "http://localhost:3000/orders", // URL to open
//   });

//   try {
//     await webpush.sendNotification(subscription, payload);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Push error:", error);
//     res.status(500).json({ error: "Push failed" });
//   }
// });
