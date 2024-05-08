// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCX-Gh-sKE_z39tb5vkERsaYsigiM1bVDY",
  authDomain: "chat-app-jenil-9b47f.firebaseapp.com",
  projectId: "chat-app-jenil-9b47f",
  storageBucket: "chat-app-jenil-9b47f.appspot.com",
  messagingSenderId: "947254453474",
  appId: "1:947254453474:web:d290bc0dbcab5f1153eabb"
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
