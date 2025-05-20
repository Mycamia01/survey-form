import { useState } from "react";

export default function ProfileForm({ name, onSave }) {
  const [newName, setNewName] = useState(name);

  return (
    <div className="space-y-2">
      <label>Full Name</label>
      <input
        type="text"
        className="w-full border p-2"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onSave(newName)}
      >
        Save
      </button>
    </div>
  );
}
