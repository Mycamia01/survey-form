import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function getDashboardStats(user) {
  // user: { uid, role }
  if (!user || !user.role) {
    return {
      total: 0,
      sent: 0,
      responded: 0,
      percentage: 0
    };
  }
  let q;
  if (user.role === "admin") {
    q = query(collection(db, "recipients"));
  } else if (user.role === "system_user") {
    q = query(collection(db, "recipients"), where("uploadedBy", "==", user.uid));
  } else {
    return {
      total: 0,
      sent: 0,
      responded: 0,
      percentage: 0
    };
  }
  const recipientsSnap = await getDocs(q);
  const recipients = recipientsSnap.docs.map(doc => doc.data());

  const total = recipients.length;
  const sent = recipients.filter(r => r.surveySent).length;
  const responded = recipients.filter(r => r.hasResponded).length;

  return {
    total,
    sent,
    responded,
    percentage: total ? ((responded / total) * 100).toFixed(2) : 0
  };
}

export async function getAllResponses() {
  const resSnap = await getDocs(collection(db, "responses"));
  return resSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
