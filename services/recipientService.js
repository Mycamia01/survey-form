import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function fetchAllRecipients(user) {
  // user: { uid, role }
  if (!user || !user.role) {
    return [];
  }
  let q;
  if (user.role === "admin") {
    q = query(collection(db, "recipients"));
  } else if (user.role === "system_user") {
    q = query(collection(db, "recipients"), where("uploadedBy", "==", user.uid));
  } else {
    return [];
  }
  const recipientSnapshot = await getDocs(q);
  const recipientList = recipientSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return recipientList;
}
