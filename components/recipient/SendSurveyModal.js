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

  useEffect(() => {
    SurveyService.getAllSurveys().then(setSurveys);
  }, []);

  const handleSend = async () => {
    setLoading(true);
    const targets = allRecipients.filter(r => selectedIds.includes(r.id));

    for (const r of targets) {
      await sendSurveyNotification({ recipient: r, medium, surveyLink: selectedSurvey || surveyLink });
      await updateDoc(doc(db, "recipients", r.id), {
        surveySent: true,
        sentAt: new Date().toISOString()
      });
    }

    setLoading(false);
    onClose();
    alert("Survey sent!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg space-y-4 w-full max-w-md">
        <h2 className="text-lg font-bold">Send Survey</h2>

        <label>Choose Survey</label>
        <select
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          className="border p-2 w-full"
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
        />

        <label>Choose Medium</label>
        <select
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <div className="flex justify-between pt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
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
