
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const SubscribeVendor = () => {
  const [subscribed, setSubscribed] = useState(false);
  const location = useLocation();

  // ✅ Only show on /vendor/checkorders or similar route
  const shouldRender = location.pathname === '/checkorders';

  const registerPush = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`);
      console.log('✅ Service Worker Registered');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('🔒 Notification permission denied');
        return;
      }

      const { data } = await axios.get('/api/config/vapid');
      const publicKey = data.publicKey;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const token = localStorage.getItem('crm_token');
      

      await axios.post('/api/subscribe', { subscription }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📩 Push subscription sent to backend');
      setSubscribed(true);
    } catch (err) {
      console.error('⚠️ Subscription error:', err);
    }
  };

  if (!shouldRender) return null; 

  return (
    <div>
      {/* {!subscribed && (
        <button onClick={registerPush} className="px-4 py-2 bg-blue-600 text-white rounded">
          🔔 Enable Notifications
        </button>
      )} */}
      {subscribed && <p className="text-green-500">✅ Subscribed for notifications {registerPush}</p>}
    </div>
  );
};

export default SubscribeVendor;
