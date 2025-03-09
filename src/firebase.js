// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCo12mO1u6yQGTROuZ59nlP465VrZGMYic",
  authDomain: "sample-chatbot-675ad.firebaseapp.com",
  projectId: "sample-chatbot-675ad",
  storageBucket: "sample-chatbot-675ad.appspot.com",
  messagingSenderId: "768458030683",
  appId: "1:768458030683:web:f01f0659c15d89c1cd897e",
  measurementId: "G-RPPF2MED4Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export the services
export { auth, db, googleProvider, signInWithEmailAndPassword };