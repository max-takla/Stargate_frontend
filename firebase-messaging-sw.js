importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSZVrwUfKpkbOQpmX41skWW7M-T-I1eaY",
  authDomain: "stargate-soft-tag.firebaseapp.com",
  projectId: "stargate-soft-tag",
  storageBucket: "stargate-soft-tag.firebasestorage.app",
  messagingSenderId: "336027943098",
  appId: "1:336027943098:web:cfd303cd18436be5434283",
});

const messaging = firebase.messaging();

console.log("🔥 Service Worker Loaded");

// Background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification?.title || "Background Message";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon.png", // ضع أي أيقونة بدك ياها
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
