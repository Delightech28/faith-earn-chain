// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc7McacT7_nrjVg-_Jue69wwhZrhL-NNA",
  authDomain: "faithchain-avax.firebaseapp.com",
  projectId: "faithchain-avax",
  storageBucket: "faithchain-avax.firebasestorage.app",
  messagingSenderId: "901973812137",
  appId: "1:901973812137:web:0d27984fd974c57c825ab8",
  measurementId: "G-7X2942M8LS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);