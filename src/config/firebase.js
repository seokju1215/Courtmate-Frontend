// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxbC32-dHog43fnjG7yHkAglruVaYDdUg",
  authDomain: "courtmate-8fc18.firebaseapp.com",
  projectId: "courtmate-8fc18",
  storageBucket: "courtmate-8fc18.firebasestorage.app",
  messagingSenderId: "595806894020",
  appId: "1:595806894020:web:62a006bcacb442f4a09691",
  measurementId: "G-TGB46XSES6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };