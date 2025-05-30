"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase-config";

export default function TakeSurvey() {
  const { id } = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSurvey({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("Survey not found.");
        }
      } catch (error) {
        console.error("Error fetching survey:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleInputChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (survey && survey.questions && currentStep < survey.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const responseCollection = collection(db, "responses");
      await addDoc(responseCollection, {
        surveyId: id,
        answers,
        submittedAt: serverTimestamp(),
      });
      alert("Survey submitted successfully!");
      router.push("/dashboard/survey");
    } catch (error) {
      console.error("Error submitting survey:", error.message);
      alert("Failed to submit survey. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading survey...</p>;

  if (!survey) return <p className="p-4 text-gray-500">Survey not found or unavailable.</p>;

  if (!survey.questions || survey.questions.length === 0) return <p className="p-4 text-gray-500">No questions available in this survey.</p>;

  const question = survey.questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
      <p className="text-gray-600 mb-6">{survey.description}</p>

      <div className="border p-4 rounded shadow-sm bg-white">
        <p className="font-semibold mb-2">
          Question {currentStep + 1} of {survey.questions.length}
        </p>
        <p className="mb-4">{question.question}</p>

        {question.type === "option" && question.options && (
          <ul className="list-none list-inside ml-4 mb-4">
            {question.options.map((opt, i) => (
              <li key={i}>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    value={opt}
                    checked={answers[currentStep] === opt}
                    onChange={() => handleInputChange(currentStep, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              </li>
            ))}
          </ul>
        )}

        {question.type === "text" && (
          <input
            type="text"
            value={answers[currentStep] || ""}
            onChange={(e) => handleInputChange(currentStep, e.target.value)}
            placeholder="Enter your answer"
            className="w-full border p-2 rounded"
          />
        )}

        {question.type === "file" && (
          <input
            type="file"
            onChange={(e) => handleInputChange(currentStep, e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        )}
      </div>

      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        )}
        {survey && currentStep < survey.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
