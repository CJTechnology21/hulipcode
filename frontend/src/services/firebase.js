import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
   apiKey: "AIzaSyAdTUZqgmIHRBW8xosxyQK3xusMKx4ZezM",
  authDomain: "huelip.firebaseapp.com",
  projectId: "huelip",
  storageBucket: "huelip.firebasestorage.app",
  messagingSenderId: "253191258482",
  appId: "1:253191258482:web:200aff18519dd354acddeb",
  measurementId: "G-K2T6183W3Z"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 Notification permission not granted.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BFVsoZ3oBxCbAoLgrHCfoH6I6q9v3sY2n6dBZOUZQNtvXVTbWNqAdqAIIr06i_1QugoffuZ9h_bjcC6D6E6BElo",
    });

    if (token) {
      // console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving FCM token:", error);
    return null;
  }
};

// export const requestFirebaseNotificationPermission = async () => {
//   try {
//     const token = await getToken(messaging, {
//       vapidKey: "BFVsoZ3oBxCbAoLgrHCfoH6I6q9v3sY2n6dBZOUZQNtvXVTbWNqAdqAIIr06i_1QugoffuZ9h_bjcC6D6E6BElo",
//     });

//     if (token) {
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.warn("No registration token available. Request permission.");
//     }
//   } catch (error) {
//     console.error("An error occurred while retrieving token.", error);
//   }
// };

export { messaging, onMessage };
