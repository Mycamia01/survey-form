"use client";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "../../firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useState, useCallback } from "react";

export default function RecipientUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setPreviewData(jsonData);
      setIsPreviewVisible(true);
      setStatus("");
    };
    reader.onerror = () => {
      setStatus("Error reading Excel file");
      setIsPreviewVisible(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith(".csv")) {
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
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        parseExcel(selectedFile);
      } else {
        setStatus("Unsupported file format. Please upload CSV or Excel files.");
        setIsPreviewVisible(false);
      }
    } else {
      setPreviewData([]);
      setIsPreviewVisible(false);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      for (const user of previewData) {
        const id = uuidv4();
        const docRef = doc(db, "recipients", id);

        // Map fields from uploaded data to expected fields
        const mappedUser = {
          id,
          name: user["Name"] || user["name"] || user["Product Ordered"] || "",
          email: user["Email"] || user["email"] || "",
          phone: user["Phone Number"] || user["phone"] || "",
          createdAt: new Date().toISOString(),
          hasResponded: false,
        };

        await setDoc(docRef, mappedUser);
      }
      setStatus("Upload successful!");
      setIsPreviewVisible(false);
      setPreviewData([]);
      setFile(null);
    } catch (error) {
      setStatus("Error uploading file");
    }
  };

  return (
    <div className="p-6 border rounded space-y-4 max-w-full mx-auto">
      <h2 className="font-bold text-lg">Upload Recipients CSV or Excel</h2>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer w-full max-w-full ${
          dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        style={{ maxWidth: "100%" }}
      >
        <input
          type="file"
          accept=".csv, .xls, .xlsx"
          id="input-file-upload"
          className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <label htmlFor="input-file-upload" className="flex flex-col items-center justify-center gap-2">
          <span className="text-gray-600 text-lg font-medium">
            Drag and drop your CSV or Excel file here or click to select
          </span>
          <span className="text-sm text-gray-400">(Only .csv, .xls, .xlsx files are accepted)</span>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            className="absolute w-full h-full top-0 left-0"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
        disabled={!file}
      >
        Upload
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}

      {isPreviewVisible && previewData.length > 0 && (
        <div className="mt-4 max-h-72 overflow-auto border rounded p-2 bg-gray-50">
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
