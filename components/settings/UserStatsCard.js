import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useEffect, useState } from "react";

export default function UserStatsCard({ userId }) {
  const [stats, setStats] = useState({ sent: 0, responded: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const q = query(collection(db, "recipients"), where("uploadedBy", "==", userId));
      const snap = await getDocs(q);
      const all = snap.docs.map((doc) => doc.data());

      const sent = all.filter((r) => r.surveySent).length;
      const responded = all.filter((r) => r.hasResponded).length;

      setStats({ sent, responded });
    };
    loadStats();
  }, [userId]);

  return (
    <div className="p-4 border rounded shadow bg-gray-50">
      <h3 className="font-bold">My Survey Stats</h3>
      <p>Surveys Sent: {stats.sent}</p>
      <p>Responses Received: {stats.responded}</p>
    </div>
  );
}
