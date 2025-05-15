"use client";

import { useState } from "react";
import { sendSurveyNotification } from "../../services/sendSurveyService";

export default function SurveySendSection({ surveyId, surveyTitle }) {
  const [medium, setMedium] = useState("email");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const surveyLink = `${window.location.origin}/dashboard/survey/${surveyId}/take`;

  const handleSend = async () => {
    setSending(true);
    setStatus("");
    try {
      // For demo, sending to a dummy recipient or you can extend to select recipients
      const recipient = {
        name: "Recipient",
        email: "recipient@example.com",
        phone: "+1234567890",
      };

      const result = await sendSurveyNotification({ recipient, medium, surveyLink });
      setStatus("Survey link sent successfully!");
    } catch (error) {
      setStatus("Failed to send survey link.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-8 p-4 border rounded max-w-md bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Send Survey</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Choose sending medium:</label>
        <select
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="w-full border rounded p-2"
          disabled={sending}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <button
        onClick={handleSend}
        disabled={sending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Survey Link"}
      </button>

      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
