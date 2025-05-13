export default function Step3Category({ formData, setFormData }) {
  return (
    <input
      type="text"
      placeholder="Survey Category"
      className="w-full p-2 border"
      value={formData.category}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    />
  );
}
