"use client";
import { useState, useEffect } from "react";
import RecipientUploader from "../../../components/recipient/RecipientUploader";
import RecipientList from "../../../components/recipient/RecipientList";
import { fetchAllRecipients } from "../../../services/recipientService";

export default function RecipientPage() {
  const [recipients, setRecipients] = useState([]);

  const fetchRecipients = () => {
    fetchAllRecipients().then(setRecipients);
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Recipients</h1>
      <RecipientUploader onUploadComplete={fetchRecipients} />
      <RecipientList recipients={recipients} />
    </div>
  );
}
