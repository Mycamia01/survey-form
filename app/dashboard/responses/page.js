import ResponseTable from "../../../components/responses/ResponseTable";

export default function ResponsePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Survey Responses</h1>
      <ResponseTable />
    </div>
  );
}
