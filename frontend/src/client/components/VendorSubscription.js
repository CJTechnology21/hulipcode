import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAdTUZqgmIHRBW8xosxyQK3xusMKx4ZezM",
    authDomain: "huelip.firebaseapp.com",
    projectId: "huelip",
    messagingSenderId: "253191258482",
    appId: "1:253191258482:web:200aff18519dd354acddeb",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const fetchAndSaveToken = async (vendorId) => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BFVsoZ3oBxCbAoLgrHCfoH6I6q9v3sY2n6dBZOUZQNtvXVTbWNqAdqAIIr06i_1QugoffuZ9h_bjcC6D6E6BElo",
        });

        if (currentToken) {
            console.log("FCM Token:", currentToken);
            // POST to your server
            const response = await fetch("http://localhost:5000/api/vendor/store-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorId, token: currentToken }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error("❌ Failed to save token:", result.message);
            } else {
                console.log("✅ Token saved:", result);
            }

            // await fetch("/api/vendor/store-token", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ vendorId, token: currentToken }),
            // });
        }
    } catch (err) {
        console.error("Token fetch error:", err);
    }
};
