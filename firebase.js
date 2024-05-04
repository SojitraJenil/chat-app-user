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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

let messaging;
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
} else {
    messaging = null;
}

export { messaging };
