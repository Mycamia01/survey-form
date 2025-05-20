import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function RecipientListByUser({ userId }) {
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "recipients"), where("uploadedBy", "==", userId));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecipients(data);
    };
    load();
  }, [userId]);

  const deleteRecipient = async (id) => {
    if (confirm("Delete this recipient?")) {
      await deleteDoc(doc(db, "recipients", id));
      setRecipients((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="bg-gray-100 p-2 mt-2 rounded">
      <h4 className="text-sm font-semibold mb-2">Recipients Uploaded</h4>
      <ul className="text-xs space-y-1 max-h-40 overflow-auto">
        {recipients.map((r) => (
          <li key={r.id} className="flex justify-between">
            {r.name} ({r.email})
            <button
              className="text-red-600"
              onClick={() => deleteRecipient(r.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
