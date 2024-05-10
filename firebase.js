// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhzkW2zDPAqq638Fvrpcuybd0xicLasEM",
  authDomain: "chat-app-dd6cb.firebaseapp.com",
  projectId: "chat-app-dd6cb",
  storageBucket: "chat-app-dd6cb.appspot.com",
  messagingSenderId: "1058791764637",
  appId: "1:1058791764637:web:eba382b8e9e19c13111a74"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let messaging = null; // Initialize messaging variable to null by default

// Check if service worker is supported and available in navigator
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app); // If service worker is supported, initialize messaging
}

export { app, auth, db, provider, messaging };
