"use client";
import { useState, useEffect } from "react";
import RecipientUploader from "../../../components/recipient/RecipientUploader";
import RecipientList from "../../../components/recipient/RecipientList";
import FileList from "../../../components/recipient/FileList";
import { fetchAllRecipients } from "../../../services/recipientService";
import { useAuth } from "../../../components/AuthProvider";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
export default function RecipientPage() {
  const { user } = useAuth();
  const [recipients, setRecipients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchRecipients = () => {
    fetchAllRecipients(user).then(setRecipients);
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  // Group recipients by fileName
  const filesMap = recipients.reduce((acc, recipient) => {
    const file = recipient.fileName || "Unknown File";
    if (!acc[file]) {
      acc[file] = [];
    }
    acc[file].push(recipient);
    return acc;
  }, {});

  const fileNames = Object.keys(filesMap);

  const handleFileClick = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleBackToFiles = () => {
    setSelectedFile(null);
  };

  const handleFileDelete = async (fileName) => {
    if (!user || !user.role || (user.role !== "admin" && user.role !== "system_user")) {
      alert("You do not have permission to delete files.");
      return;
    }

    if (!confirm(`Are you sure you want to delete all recipients from file "${fileName}"?`)) {
      return;
    }

    try {
      // Query recipients with the given fileName
      const q = query(collection(db, "recipients"), where("fileName", "==", fileName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No recipients found for this file.");
        return;
      }

      // Batch delete all recipients in this file
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      alert(`Deleted all recipients from file "${fileName}".`);
      setSelectedFile(null);
      fetchRecipients();
    } catch (error) {
      console.error("Error deleting recipients:", error);
      alert("Failed to delete recipients. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Recipients</h1>
      <RecipientUploader onUploadComplete={fetchRecipients} user={user} />
      {selectedFile ? (
        <div>
          <button
            onClick={handleBackToFiles}
            className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            &larr; Back to Files
          </button>
          <h2 className="text-xl font-semibold mb-2">Recipients in {selectedFile}</h2>
          <RecipientList recipients={filesMap[selectedFile]} />
        </div>
      ) : (
        <FileList
          files={fileNames}
          onFileClick={handleFileClick}
          onFileDelete={handleFileDelete}
          canDelete={user && (user.role === "admin" || user.role === "system_user")}
        />
      )}
    </div>
  );
}
