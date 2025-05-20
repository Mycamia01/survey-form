"use client";
import { useEffect, useState } from "react";
import { getAllResponses } from "../../services/analyticsService";

export default function ResponseTable() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    getAllResponses().then(setResponses);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">All Survey Responses</h2>
      <div className="overflow-auto max-h-[400px] border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Respondent</th>
              <th className="p-2">Survey</th>
              <th className="p-2">Submitted At</th>
              <th className="p-2">Response</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="p-2">{res.user?.name || "N/A"}</td>
                <td className="p-2">{res.surveyTitle}</td>
                <td className="p-2">{new Date(res.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(res.answers, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
