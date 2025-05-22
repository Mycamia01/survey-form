"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useAuth } from "../AuthProvider";

export default function ResponseTable() {
  const [responses, setResponses] = useState([]);
  const [surveyTitles, setSurveyTitles] = useState({});
  const { user, role } = useAuth();

  useEffect(() => {
    const loadSurveys = async () => {
      const surveysSnap = await getDocs(collection(db, "surveys"));
      const titlesMap = {};
      surveysSnap.forEach(doc => {
        const data = doc.data();
        titlesMap[doc.id] = data.title || "Untitled Survey";
      });
      setSurveyTitles(titlesMap);
    };

    loadSurveys();
  }, []);

  useEffect(() => {
    const loadResponses = async () => {
      let q = collection(db, "responses");

      if (role === "system_user") {
        q = query(q, where("createdBy", "==", user.uid));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResponses(data);
    };

    if (user && role) {
      loadResponses();
    }
  }, [user, role]);

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Survey Title</th>
            <th className="p-2">Submitted At</th>
            <th className="p-2">Answers</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((res) => (
            <tr key={res.id} className="border-t">
              <td className="p-2">{surveyTitles[res.surveyId] || res.surveyId}</td>
              <td className="p-2">{new Date(res.submittedAt).toLocaleString()}</td>
              <td className="p-2 whitespace-pre-wrap">
                <pre>{JSON.stringify(res.answers, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
