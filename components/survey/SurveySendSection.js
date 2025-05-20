// components/SurveySendSection.js
"use client";

import { useState } from "react";

export default function SurveySendSection({ surveyId }) {
  const [medium, setMedium] = useState("email");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const surveyLink = `${window.location.origin}/survey/${surveyId}`;

  const handleSend = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SEND_API, { // Uses your endpoint: /api/sendSurvey
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Participant Name", // Dynamic in real usage
          email: "participant@example.com", // Dynamic in real usage
          medium,
          surveyLink,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send');
      }

      setResult({ success: true, message: data.message });
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Send Survey Invitation</h3>
      
      <div className="mb-4">
        <label className="block mb-1 text-sm">Send Via:</label>
        <select
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="email">Email</option>
          <option disabled value="sms">SMS (Coming Soon)</option>
        </select>
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Sending...' : 'Send Invitation'}
      </button>

      {result && (
        <p className={`mt-3 text-sm ${
          result.success ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.message}
        </p>
      )}
    </div>
  );
}