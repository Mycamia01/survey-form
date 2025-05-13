import React from "react";

export default function SurveyPreviewModal({ isOpen, survey, onClose }) {
  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{survey.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-xl font-bold"
            aria-label="Close preview"
          >
            &times;
          </button>
        </div>
        <p className="mb-4">{survey.description}</p>
        <div>
          <h3 className="text-xl font-semibold mb-2">Questions:</h3>
          {survey.questions && survey.questions.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2">
              {survey.questions.map((q, index) => (
                <li key={index}>
                  <p className="font-semibold">{q.questionText}</p>
                  {q.type === "mcq" && q.options && (
                    <ul className="list-disc list-inside ml-4">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {q.type === "text" && <p>Text input</p>}
                  {q.type === "file" && <p>File upload</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
