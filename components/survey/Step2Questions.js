import { useState } from "react";

export default function Step2Questions({ formData, setFormData }) {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setOptionInput("");
    }
  };

  const removeOption = (opt) => {
    setOptions(options.filter((o) => o !== opt));
  };

  const addQuestion = () => {
    if (!question.trim()) return;
    const newQ = { question: question.trim(), type };
    if (type === "option") {
      newQ.options = options;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQ],
    });
    setQuestion("");
    setOptions([]);
    setOptionInput("");
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Question"
        className="w-full p-2 border rounded"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="option">Option Selection</option>
        <option value="file">File Upload</option>
      </select>

      {type === "option" && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add option"
              className="flex-grow p-2 border rounded"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOption();
                }
              }}
            />
            <button
              type="button"
              onClick={addOption}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div>
            {options.length === 0 && <p className="text-gray-500">No options added yet.</p>}
            <ul className="list-disc list-inside">
              {options.map((opt, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{opt}</span>
                  <button
                    type="button"
                    onClick={() => removeOption(opt)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={addQuestion}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Question
      </button>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Questions Added:</h3>
        {formData.questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-2">
            {formData.questions.map((q, i) => (
              <li key={i}>
                <p className="font-semibold">{q.question}</p>
                <p className="italic text-sm text-gray-600">
                  Type: {q.type === "option" ? "Option Selection" : q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                </p>
                {q.type === "option" && q.options && (
                  <ul className="list-disc list-inside ml-4">
                    {q.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
