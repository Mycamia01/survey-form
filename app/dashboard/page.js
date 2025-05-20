import DashboardStats from "../../components/dashboard/DashboardStats";
import ResponseTable from "../../components/dashboard/ResponseTable";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <DashboardStats />
      <ResponseTable />
    </div>
  );
}
