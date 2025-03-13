// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3v-D-OoLrUBVyh_JoEC1LZ7jOmSyWtoQ",
  authDomain: "courtmate-d4091.firebaseapp.com",
  projectId: "courtmate-d4091",
  storageBucket: "courtmate-d4091.firebasestorage.app",
  messagingSenderId: "484550600532",
  appId: "1:484550600532:web:65017db4bf16cd27d30ac1",
  measurementId: "G-73WRZGKRKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };