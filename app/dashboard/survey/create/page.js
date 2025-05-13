"use client";
import { useState } from "react";
import Step1Details from "../../../../components/survey/Step1Details";
import Step2Questions from "../../../../components/survey/Step2Questions";
import Step3Category from "../../../../components/survey/Step3Category";
import { db } from "../../../../firebase/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/AuthProvider";

export default function CreateSurvey() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    category: "",
  });

  const handleSubmit = async () => {
    await addDoc(collection(db, "surveys"), {
      ...formData,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: user?.uid,
    });
    router.push("/dashboard/survey");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {step === 1 && <Step1Details formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2Questions formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3Category formData={formData} setFormData={setFormData} />}

      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
