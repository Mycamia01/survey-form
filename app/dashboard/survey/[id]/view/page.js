"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase-config";
import { useAuth } from "../../../../../components/AuthProvider";
import SurveySendSection from "../../../../../components/survey/SurveySendSection";

export default function ViewSurvey() {
  const { id } = useParams();
  const { user, role, loading } = useAuth();
  const [survey, setSurvey] = useState(null);
  const [fetchingSurvey, setFetchingSurvey] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSurvey({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("Survey not found.");
        }
      } catch (error) {
        console.error("Error fetching survey:", error.message);
      } finally {
        setFetchingSurvey(false);
      }
    };

    if (!loading && user && (role === "admin" || role === "system_user")) {
      fetchSurvey();
    }
  }, [id, loading, user, role]);

  // Still checking credentials
  if (loading) return <p className="p-4">Checking authentication...</p>;

  // User is not allowed
  if (!user || (role !== "admin" && role !== "system_user")) {
    return (
      <div className="p-4 text-red-600">
        <p>Access denied. You must be an authorized user to view this survey demo.</p>
        <p>Current user: {user ? user.email : "No user"}</p>
        <p>Current role: {role || "No role"}</p>
      </div>
    );
  }

  // Survey is loading
  if (fetchingSurvey) return <p className="p-4">Loading survey...</p>;

  // Survey not found
  if (!survey) return <p className="p-4 text-gray-500">Survey not found or unavailable.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{survey.title}</h1>
      <p className="text-gray-600">{survey.description}</p>

      <div className="space-y-4 mt-6">
        {survey.questions.map((q, index) => (
          <div key={index} className="border p-3 rounded shadow-sm bg-white">
            <p className="font-semibold">{q.question}</p>
            <p className="text-sm text-gray-500">Type: {q.type}</p>

            {q.type === "multiple" && q.options && (
              <ul className="list-disc list-inside ml-4 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}

            {q.type === "text" && (
              <input
                type="text"
                disabled
                placeholder="User would enter text here"
                className="mt-2 w-full border p-2 rounded bg-gray-100"
              />
            )}

            {q.type === "file" && (
              <input
                type="file"
                disabled
                className="mt-2 w-full bg-gray-100 cursor-not-allowed"
              />
            )}
          </div>
        ))}
      </div>

      <SurveySendSection surveyId={survey.id} surveyTitle={survey.title} />
    </div>
  );
}
