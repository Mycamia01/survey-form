"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase-config";
import { useAuth } from "../../../../../components/AuthProvider";

export default function ViewSurvey() {
  const { id } = useParams();
  const { user, role, loading } = useAuth();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    if (!loading && user && role === "creator") {
      const fetchSurvey = async () => {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSurvey({ id: docSnap.id, ...docSnap.data() });
        }
      };
      fetchSurvey();
    }
  }, [id, loading, user, role]);

  if (loading) return <p>Loading authentication...</p>;

  if (!user || role !== "creator") {
    return <p>Access denied. You must be an authenticated survey creator to view this page.</p>;
  }

  if (!survey) return <p>Loading survey...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{survey.title}</h1>
      <p className="text-gray-600">{survey.description}</p>
      <div className="space-y-4 mt-6">
        {survey.questions.map((q, index) => (
          <div key={index} className="border p-3 rounded shadow-sm">
            <p className="font-semibold">{q.question}</p>
            <p className="text-sm text-gray-500">Type: {q.type}</p>
            {q.type === "option" && q.options && (
              <ul className="list-disc list-inside ml-4">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
