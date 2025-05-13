"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase-config";
import Step1Details from "../../../../components/survey/Step1Details";
import Step2Questions from "../../../../components/survey/Step2Questions";
import Step3Category from "../../../../components/survey/Step3Category";

export default function EditSurvey() {
  const { id } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    category: "",
  });

  useEffect(() => {
    const loadSurvey = async () => {
      const ref = doc(db, "surveys", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFormData({ ...snap.data() });
      }
    };
    loadSurvey();
  }, [id]);

  const handleUpdate = async () => {
    await updateDoc(doc(db, "surveys", id), formData);
    router.push("/dashboard/survey");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {step === 1 && <Step1Details formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2Questions formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3Category formData={formData} setFormData={setFormData} />}

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="bg-gray-300 px-4 py-2 rounded">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Next
          </button>
        ) : (
          <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
            Update Survey
          </button>
        )}
      </div>
    </div>
  );
}
