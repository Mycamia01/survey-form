"use client";
import React from "react";

export default function FileList({ files = [], onFileClick, onFileDelete, canDelete }) {
  if (files.length === 0) {
    return <p>No files found.</p>;
  }

  return (
    <div className="p-4 border rounded max-w-full max-h-96 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      <ul className="list-disc list-inside space-y-2">
        {files.map((fileName) => (
          <li key={fileName} className="flex justify-between items-center">
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => onFileClick(fileName)}
            >
              {fileName}
            </span>
            {canDelete && (
              <button
                onClick={() => onFileDelete(fileName)}
                className="text-red-600 hover:text-red-800 ml-4"
                aria-label={`Delete file ${fileName}`}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
