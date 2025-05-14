import { useState } from "react";

export default function Step2Questions({ formData, setFormData }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] = useState("text");
  const [newOptions, setNewOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (trimmed && !newOptions.includes(trimmed)) {
      setNewOptions([...newOptions, trimmed]);
      setOptionInput("");
    }
  };

  const removeOption = (opt) => {
    setNewOptions(newOptions.filter((o) => o !== opt));
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    const newQ = { question: newQuestion.trim(), type: newType };
    if (newType === "option") {
      newQ.options = newOptions;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQ],
    });
    setNewQuestion("");
    setNewType("text");
    setNewOptions([]);
    setOptionInput("");
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = updatedQuestion;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestion = { ...formData.questions[index] };
    if (field === "type") {
      updatedQuestion.type = value;
      if (value === "option") {
        if (!updatedQuestion.options) {
          updatedQuestion.options = [];
        }
      } else {
        delete updatedQuestion.options;
      }
    } else if (field === "question") {
      updatedQuestion.question = value;
    }
    updateQuestion(index, updatedQuestion);
  };

  const addOptionToQuestion = (index, option) => {
    const updatedQuestion = { ...formData.questions[index] };
    if (!updatedQuestion.options) updatedQuestion.options = [];
    if (!updatedQuestion.options.includes(option)) {
      updatedQuestion.options.push(option);
      updateQuestion(index, updatedQuestion);
    }
  };

  const removeOptionFromQuestion = (index, option) => {
    const updatedQuestion = { ...formData.questions[index] };
    if (updatedQuestion.options) {
      updatedQuestion.options = updatedQuestion.options.filter((opt) => opt !== option);
      updateQuestion(index, updatedQuestion);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add New Question</h3>
        <input
          type="text"
          placeholder="Question"
          className="w-full p-2 border rounded mb-2"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded mb-2"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="option">Option Selection</option>
          <option value="file">File Upload</option>
        </select>

        {newType === "option" && (
          <div className="space-y-2 mb-2">
            <div className="flex flex-wrap space-x-2">
              <input
                type="text"
                placeholder="Add option"
                className="flex-grow min-w-[150px] p-2 border rounded"
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
            <ul className="list-disc list-inside flex flex-wrap space-x-4 mt-2">
              {newOptions.length === 0 && <p className="text-gray-500">No options added yet.</p>}
              {newOptions.map((opt, idx) => (
                <li key={idx} className="flex justify-between items-center border rounded px-2 py-1 mb-2">
                  <span>{opt}</span>
                  <button
                    type="button"
                    onClick={() => removeOption(opt)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={addQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Question
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Questions Added:</h3>
        {formData.questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-4">
            {formData.questions.map((q, i) => (
              <li key={i} className="border p-4 rounded bg-white shadow-sm">
                <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(i, "question", e.target.value)}
                    className="flex-grow min-w-[150px] p-2 border rounded"
                  />
                  <select
                    value={q.type}
                    onChange={(e) => handleQuestionChange(i, "type", e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="text">Text</option>
                    <option value="option">Option Selection</option>
                    <option value="file">File Upload</option>
                  </select>
                  <button
                    onClick={() => removeQuestion(i)}
                    className="text-red-600 hover:underline ml-4"
                    aria-label="Remove question"
                  >
                    Remove
                  </button>
                </div>

                {q.type === "option" && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add option"
                        className="flex-grow min-w-[150px] p-2 border rounded"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !q.options.includes(val)) {
                              addOptionToQuestion(i, val);
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                    <ul className="list-disc list-inside flex flex-wrap space-x-4 mt-2">
                      {q.options && q.options.length === 0 && (
                        <p className="text-gray-500">No options added yet.</p>
                      )}
                      {q.options &&
                        q.options.map((opt, idx) => (
                          <li key={idx} className="flex justify-between items-center border rounded px-2 py-1 mb-2">
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => removeOptionFromQuestion(i, opt)}
                              className="text-red-600 hover:underline ml-2"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
