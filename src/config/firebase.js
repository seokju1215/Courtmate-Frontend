// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1uwkeamELWkD-R4_Z61ONx-wtK-1tgx0",
  authDomain: "courtmate6.firebaseapp.com",
  projectId: "courtmate6",
  storageBucket: "courtmate6.firebasestorage.app",
  messagingSenderId: "702098541016",
  appId: "1:702098541016:web:fe3584ec468aa44634caad",
  measurementId: "G-K7Y3JSMJ4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };