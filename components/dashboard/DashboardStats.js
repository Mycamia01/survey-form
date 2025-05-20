"use client";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/analyticsService";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="bg-blue-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold">{stats.total}</h2>
        <p>Total Recipients</p>
      </div>
      <div className="bg-green-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold">{stats.sent}</h2>
        <p>Survey Sent</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold">{stats.responded}</h2>
        <p>Responded</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold">{stats.percentage}%</h2>
        <p>Response Rate</p>
      </div>
    </div>
  );
}
