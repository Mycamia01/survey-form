export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white shadow-lg p-8 rounded-2xl text-center hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-gray-700 text-base font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
