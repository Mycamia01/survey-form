"use client";
import { useState } from "react";
import SendSurveyModal from "./SendSurveyModal";

export default function RecipientList({ recipients = [] }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClear = () => {
    setSearch("");
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  const filtered = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  return (
    <div className="space-y-4 p-4 border rounded-md max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
        <input
          className="border p-2 flex-grow rounded-md"
          placeholder="Search recipients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={handleDeselectAll}
          >
            Deselect All
          </button>
          {selected.length > 0 && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              Send Survey to {selected.length} Users
            </button>
          )}
        </div>
      </div>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Select</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Phone</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => handleSelect(r.id)}
                />
              </td>
              <td className="border p-2">{r.name}</td>
              <td className="border p-2">{r.email}</td>
              <td className="border p-2">{r.phone}</td>
              <td className="border p-2">
                {r.hasResponded ? "Responded" : "Not Responded"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <SendSurveyModal
          selectedIds={selected}
          allRecipients={recipients}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
