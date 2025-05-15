"use client";
import { useEffect, useState } from "react";
import { fetchAllRecipients } from "../../services/recipientService";
import SendSurveyModal from "./SendSurveyModal";

export default function RecipientList() {
  const [recipients, setRecipients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllRecipients().then(setRecipients);
  }, []);

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = recipients.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Search recipients..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-b">
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => handleSelect(r.id)}
                />
              </td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.hasResponded ? "Responded" : "Not Responded"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Send Survey to {selected.length} Users
        </button>
      )}

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
