"use client";
import { auth } from "../firebase/firebase-config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Topbar({ setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">CAMIA Admin Dashboard</h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
      >
        Logout
      </button>
    </header>
  );
}
