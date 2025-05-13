import Link from "next/link";

export default function SurveyCard({ survey, onDelete, onToggle }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{survey.title}</h3>
        <p className="text-sm text-gray-600">{survey.description}</p>
        <p className="text-xs text-gray-400">Category: {survey.category}</p>
      </div>

      <div className="space-x-2 flex items-center">
        <Link href={`/dashboard/survey/${survey.id}/view`}>
          <button className="text-blue-600 hover:underline">View</button>
        </Link>
        <Link href={`/dashboard/survey/${survey.id}/edit`}>
          <button className="text-green-600 hover:underline">Edit</button>
        </Link>
        <button
          onClick={() => onDelete(survey.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
        <button
          onClick={() => onToggle(survey.id, !survey.isActive)}
          className={`text-sm px-2 py-1 rounded ${
            survey.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
          }`}
        >
          {survey.isActive ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
}
