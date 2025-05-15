import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function fetchAllRecipients() {
  const recipientsCol = collection(db, "recipients");
  const recipientSnapshot = await getDocs(recipientsCol);
  const recipientList = recipientSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return recipientList;
}
