import { useState, useEffect } from "react";
import { sendSurveyNotification } from "../../services/sendSurveyService";
import { db } from "../../firebase/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import SurveyService from "../../services/SurveyService";

export default function SendSurveyModal({ selectedIds, allRecipients, onClose }) {
  const [medium, setMedium] = useState("email");
  const [surveyLink, setSurveyLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    SurveyService.getAllSurveys().then(setSurveys);
  }, []);

  const handleSend = async () => {
    setError("");
    setSuccess("");
    if (!process.env.NEXT_PUBLIC_SEND_API) {
      setError("Notification API URL is not configured. Please set NEXT_PUBLIC_SEND_API.");
      return;
    }
    if (!selectedSurvey && !surveyLink) {
      setError("Please select a survey or enter a survey link.");
      return;
    }
    setLoading(true);
    const targets = allRecipients.filter(r => selectedIds.includes(r.id));

    try {
      for (const r of targets) {
        await sendSurveyNotification({ recipient: r, medium, surveyLink: selectedSurvey || surveyLink });
        await updateDoc(doc(db, "recipients", r.id), {
          surveySent: true,
          sentAt: new Date().toISOString()
        });
      }
      setSuccess("Survey sent successfully!");
    } catch (err) {
      setError("Failed to send survey: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg space-y-4 w-full max-w-md">
        <h2 className="text-lg font-bold">Send Survey</h2>

        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {success && <p className="text-green-600 font-semibold">{success}</p>}

        <label>Choose Survey</label>
        <select
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          className="border p-2 w-full"
          disabled={loading}
        >
          <option value="">-- Select a survey --</option>
          {surveys.map((survey) => (
            <option key={survey.id} value={survey.link}>
              {survey.title}
            </option>
          ))}
        </select>

        <label>Or enter Survey Link</label>
        <input
          type="text"
          value={surveyLink}
          onChange={(e) => setSurveyLink(e.target.value)}
          className="border p-2 w-full"
          placeholder="https://yourdomain.com/survey/123"
          disabled={loading}
        />

        <label>Choose Medium</label>
        <select
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="border p-2 w-full"
          disabled={loading}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <div className="flex justify-between pt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
