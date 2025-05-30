"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useAuth } from "../AuthProvider";

export default function ResponseTable() {
  const [responses, setResponses] = useState([]);
  const [surveyTitles, setSurveyTitles] = useState({});
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(responses.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "responses", id));
    setResponses(responses.filter((r) => r.id !== id));
    setSelected(selected.filter((sid) => sid !== id));
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selected.map((id) => deleteDoc(doc(db, "responses", id))));
    setResponses(responses.filter((r) => !selected.includes(r.id)));
    setSelected([]);
    setSelectAll(false);
  };

  return (
    <div>
  <div className="flex items-center justify-between mb-4">
    <label className="flex items-center text-base font-medium">
      <input
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
        className="mr-2"
      />
      Select All
    </label>
    <button
      onClick={handleDeleteSelected}
      disabled={selected.length === 0}
      className="bg-red-600 text-white px-4 py-2 rounded text-base disabled:opacity-50"
    >
      Delete Selected
    </button>
  </div>

  <div className="overflow-auto border border-gray-300 rounded">
    <table className="min-w-full table-auto text-base border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-300 p-3 w-12"></th>
          <th className="border border-gray-300 p-3">Survey Title</th>
          <th className="border border-gray-300 p-3">Submitted At</th>
          <th className="border border-gray-300 p-3">Answers</th>
          <th className="border border-gray-300 p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((res) => (
          <tr key={res.id} className="odd:bg-white even:bg-gray-50">
            <td className="border border-gray-300 p-3 text-center">
              <input
                type="checkbox"
                checked={selected.includes(res.id)}
                onChange={() => toggleSelect(res.id)}
              />
            </td>
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
            <td className="border border-gray-300 p-3 text-center align-top">
              <button
                onClick={() => handleDelete(res.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {responses.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center p-4 text-gray-500 border border-gray-300">
              No responses found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
  );
}
