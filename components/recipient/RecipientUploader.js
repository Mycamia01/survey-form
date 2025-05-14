"use client";
import Papa from "papaparse";
import { db } from "../../firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default function RecipientUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          setPreviewData(results.data);
          setIsPreviewVisible(true);
          setStatus("");
        },
        error: () => {
          setStatus("Error parsing CSV");
          setIsPreviewVisible(false);
        },
      });
    } else {
      setPreviewData([]);
      setIsPreviewVisible(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      for (const user of previewData) {
        const id = uuidv4();
        const docRef = doc(db, "recipients", id);

        await setDoc(docRef, {
          id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: new Date().toISOString(),
          hasResponded: false,
        });
      }
      setStatus("Upload successful!");
      setIsPreviewVisible(false);
      setPreviewData([]);
      setFile(null);
    } catch (error) {
      setStatus("Error uploading CSV");
    }
  };

  return (
    <div className="p-4 border rounded space-y-4 max-w-md">
      <h2 className="font-bold text-lg">Upload Recipients CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!file}>
        Upload
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}

      {isPreviewVisible && previewData.length > 0 && (
        <div className="mt-4 max-h-64 overflow-auto border rounded p-2 bg-gray-50">
          <h3 className="font-semibold mb-2">Preview Data</h3>
          <table className="min-w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-2 py-1 bg-gray-200 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
