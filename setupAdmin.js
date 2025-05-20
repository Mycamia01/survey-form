import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import { db } from "../firebase/firebase-config";

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

// Function to promote user to admin
async function setupAdminUser(uid) {
  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    
    // Update Firestore user document
    const userRef = admin.firestore().doc(`users/${uid}`);
    await userRef.set({ role: "admin" }, { merge: true });
    
    console.log(`Successfully set UID ${uid} as admin`);
    return true;
  } catch (error) {
    console.error("Error setting up admin:", error);
    return false;
  }
}

// Usage: node setupAdmin.js USER_FIREBASE_UID
const uid = process.argv[2];
if (!uid) {
  console.error("Please provide a user UID as argument");
  process.exit(1);
}

setupAdminUser(uid).then(success => {
  process.exit(success ? 0 : 1);
});