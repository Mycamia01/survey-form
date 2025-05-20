import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

// Function to process multiple users
async function setupMultipleUsers(users) {
  const results = [];
  
  for (const user of users) {
    try {
      // Set custom claim
      await admin.auth().setCustomUserClaims(user.uid, { role: user.role });
      
      // Update Firestore user document
      const userRef = admin.firestore().doc(`users/${user.uid}`);
      await userRef.set({ 
        role: user.role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      results.push({ uid: user.uid, success: true });
      console.log(`Set role "${user.role}" for UID ${user.uid}`);
    } catch (error) {
      results.push({ uid: user.uid, success: false, error: error.message });
      console.error(`Error processing UID ${user.uid}:`, error.message);
    }
  }
  
  return results;
}

// Sample data (replace with your actual users or import from file)
const usersToUpdate = [
  { uid: "USER_UID_1", role: "admin" },
  { uid: "USER_UID_2", role: "system_user" },
  // Add more users here
];

// Execute
setupMultipleUsers(usersToUpdate)
  .then(results => {
    console.log("\nProcessing complete. Results:");
    console.table(results);
    process.exit(0);
  })
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });