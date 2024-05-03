// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6t-3_V7L66a9w6g4SlAxqE3hiZGqq9yY",
  authDomain: "chat-app-jenil.firebaseapp.com",
  projectId: "chat-app-jenil",
  storageBucket: "chat-app-jenil.appspot.com",
  messagingSenderId: "19356569092",
  appId: "1:19356569092:web:ebd3ea3232451ba5fcaf51",
  measurementId: "G-B4W198LBNY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
