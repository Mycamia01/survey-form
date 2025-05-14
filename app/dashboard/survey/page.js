"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/AuthProvider";
import SurveyService from "../../../services/SurveyService";
import ConfirmationModal from "../../../components/ConfirmationModal";
// Removed import of SurveyPreviewModal as preview button will be removed

export default function SurveyPage() {
  const { role } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  // Removed preview modal state and handlers
  // const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // const [surveyToPreview, setSurveyToPreview] = useState(null);

  const fetchSurveys = async () => {
    setLoading(true);
    const surveysData = await SurveyService.getAllSurveys();
    setSurveys(surveysData);
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleDeleteClick = (survey) => {
    setSurveyToDelete(survey);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (surveyToDelete) {
      await SurveyService.deleteSurvey(surveyToDelete.id);
      setIsDeleteModalOpen(false);
      setSurveyToDelete(null);
      fetchSurveys();
      setSelectedSurveys((prev) => prev.filter((id) => id !== surveyToDelete.id));
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSurveyToDelete(null);
  };

  const handleToggle = async (id, newStatus) => {
    await SurveyService.updateSurvey(id, { isActive: newStatus });
    fetchSurveys();
  };

  const handleSelectSurvey = (id) => {
    setSelectedSurveys((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSurveys.length === filteredSurveys.length) {
      setSelectedSurveys([]);
    } else {
      setSelectedSurveys(filteredSurveys.map((survey) => survey.id));
    }
  };

  const handleBulkActivate = async () => {
    await SurveyService.bulkUpdateStatus(selectedSurveys, true);
    setSelectedSurveys([]);
    fetchSurveys();
  };

  const handleBulkDeactivate = async () => {
    await SurveyService.bulkUpdateStatus(selectedSurveys, false);
    setSelectedSurveys([]);
    fetchSurveys();
  };

  const handleBulkDeleteClick = () => {
    setSurveyToDelete(null);
    setIsDeleteModalOpen(true);
  };

  // Removed preview click handlers
  // const handlePreviewClick = (survey) => {
  //   setSurveyToPreview(survey);
  //   setIsPreviewModalOpen(true);
  // };

  // const handleClosePreview = () => {
  //   setIsPreviewModalOpen(false);
  //   setSurveyToPreview(null);
  // };

  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Survey Forms</h1>
        <Link href="/dashboard/survey/create" passHref>
          <button
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
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by title or category"
        className="mb-4 w-full p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {selectedSurveys.length > 0 && (
        <div className="mb-4 space-x-2">
          <button
            onClick={handleBulkActivate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Activate Selected
          </button>
          <button
            onClick={handleBulkDeactivate}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Deactivate Selected
          </button>
          <button
            onClick={handleBulkDeleteClick}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading surveys...</p>
      ) : filteredSurveys.length === 0 ? (
        <p>No surveys found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">
                  <input
                    type="checkbox"
                    checked={selectedSurveys.length === filteredSurveys.length}
                    onChange={handleSelectAll}
                    aria-label="Select all surveys"
                  />
                </th>
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedSurveys.includes(survey.id)}
                      onChange={() => handleSelectSurvey(survey.id)}
                      aria-label={`Select survey ${survey.title}`}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{survey.title}</td>
                  <td className="py-2 px-4 border-b">{survey.category}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleToggle(survey.id, !survey.isActive)}
                      className={`text-sm px-2 py-1 rounded ${
                        survey.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {survey.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <Link href={`/dashboard/survey/${survey.id}/edit`}>
                      <button className="text-green-600 hover:underline">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(survey)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {/* Preview button removed */}
                    <Link href={`/dashboard/survey/${survey.id}/take`}>
                      <button className="text-blue-600 hover:underline">Demo</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Delete"
        message={
          surveyToDelete
            ? `Are you sure you want to delete the survey "${surveyToDelete.title}"?`
            : "Are you sure you want to delete the selected surveys?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
