"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

export default function ResponseTable() {
  const [responses, setResponses] = useState([]);
  const [surveyTitles, setSurveyTitles] = useState({});

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
      const snap = await getDocs(collection(db, "responses"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResponses(data);
    };

    loadResponses();
  }, []);

  return (
    <div className="overflow-auto border border-gray-300 rounded mt-8">
      <table className="min-w-full table-auto text-base border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-3">Sr No</th>
            <th className="border border-gray-300 p-3">Survey Title</th>
            <th className="border border-gray-300 p-3">Submitted At</th>
            <th className="border border-gray-300 p-3">Answers</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((res, index) => (
            <tr key={res.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 p-3 align-top">{index + 1}</td>
              <td className="border border-gray-300 p-3 align-top">
                {surveyTitles[res.surveyId] || res.surveyId}
              </td>
              <td className="border border-gray-300 p-3 align-top">
                {new Date(res.submittedAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-3 whitespace-pre-wrap align-top">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(res.answers, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
          {responses.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500 border border-gray-300">
                No responses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
