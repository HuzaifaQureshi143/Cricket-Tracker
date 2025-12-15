/**
 * Firebase Configuration for Cricket Tracker
 * 
 * This file initializes Firebase with Firestore ONLY.
 * Analytics and other Firebase services are intentionally excluded.
 * 
 * @version 1.0.0
 * @date 2025-12-15
 */

// Import Firebase core and Firestore SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
// These values are safe to expose in client-side code
// Security is enforced through Firestore Security Rules
const firebaseConfig = {
  apiKey: "AIzaSyCdqsJsWP3qR-TrNSW8zJCUImTcsZhQJwc",
  authDomain: "cricket-tracker-8f91d.firebaseapp.com",
  projectId: "cricket-tracker-8f91d",
  storageBucket: "cricket-tracker-8f91d.firebasestorage.app",
  messagingSenderId: "198756427970",
  appId: "1:198756427970:web:d20421d112be60c1f6f35b",
  measurementId: "G-TKGVP2EM4K" // Not used (Analytics disabled)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Log successful initialization
console.log("✅ Firebase initialized successfully");
console.log("✅ Firestore connected to project:", firebaseConfig.projectId);

// Export Firestore instance for use in other modules
export { db };
