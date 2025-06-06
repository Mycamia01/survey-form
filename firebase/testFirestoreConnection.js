import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config - replace with your actual config or environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestore() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const recipientsCol = collection(db, "recipients");
    const snapshot = await getDocs(recipientsCol);
    const recipients = snapshot.docs.map(doc => doc.data());

    console.log("Firestore connection successful. Recipients data:", recipients);
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
}

testFirestore();
