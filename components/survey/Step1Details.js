export default function Step1Details({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Survey Title"
        className="w-full p-2 border rounded"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Survey Description"
        className="w-full p-2 border rounded"
        rows="4"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
    </div>
  );
}
