import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBSZVrwUfKpkbOQpmX41skWW7M-T-I1eaY",
  authDomain: "stargate-soft-tag.firebaseapp.com",
  databaseURL:
    "https://stargate-soft-tag-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stargate-soft-tag",
  storageBucket: "stargate-soft-tag.firebasestorage.app",
  messagingSenderId: "336027943098",
  appId: "1:336027943098:web:cfd303cd18436be5434283",
  measurementId: "G-ZMNB3DS8Z1",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const database = getDatabase(
  app,
  "https://stargate-soft-tag-default-rtdb.asia-southeast1.firebasedatabase.app"
);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log("permission:", permission);

  if (permission === "granted") {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const token = await getToken(messaging, {
        vapidKey:
          "BAHdebRJtMAfinc_bVORxeYDss1FCN3ysx4nJ7bSCqaOmikckurjis8Bad_FzgW2xDmtIMuSVJ0fZWiEfr8WW0M",
        serviceWorkerRegistration: registration,
      });

      console.log("token notify:", token);
      return token;
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  } else {
    console.log("Unable to get permission to notify.");
  }
};
