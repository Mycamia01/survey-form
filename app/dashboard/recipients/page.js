import RecipientUploader from "../../../components/recipient/RecipientUploader";

export default function RecipientPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Recipients</h1>
      <RecipientUploader />
    </div>
  );
}
