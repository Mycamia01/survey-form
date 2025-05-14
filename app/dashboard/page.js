"use client";
import { useAuth } from "../../components/AuthProvider";
import DashboardCard from "../../components/dashboardCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SurveyService from "../../services/SurveyService";

export default function DashboardHome() {
  const { role } = useAuth();
  const router = useRouter();

  const [totalSurveys, setTotalSurveys] = useState(0);
  const [activeSurveys, setActiveSurveys] = useState(0);

  const handleAddSurvey = () => {
    router.push("/dashboard/survey/create");
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      const surveys = await SurveyService.getAllSurveys();
      setTotalSurveys(surveys.length);
      const activeCount = surveys.filter((survey) => survey.isActive).length;
      setActiveSurveys(activeCount);
    };
    fetchSurveys();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleAddSurvey}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center space-x-2"
          aria-label="Add Survey"
          title="Add Survey"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Survey</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <DashboardCard title="Total Surveys Sent" value={totalSurveys.toString()} />
        <DashboardCard title="Total Responses" value="0" />
        <DashboardCard title="Active Surveys" value={activeSurveys.toString()} />
      </div>
    </div>
  );
}
