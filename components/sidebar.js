"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Survey Forms", path: "/dashboard/survey" },
  { name: "Recipients", path: "/dashboard/recipients" },
  { name: "Responses", path: "/dashboard/responses" },
  { name: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 z-50 transform md:translate-x-0 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-extrabold mb-8">CAMIA Admin</h2>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <div key={item.path} className="flex items-center space-x-2">
              <Link
                href={item.path}
                className={`px-4 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors ${
                  pathname === item.path ? "bg-gray-700" : "bg-transparent"
                } flex-1`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.name}
              </Link>
              {item.name === "Survey Forms" && (role === "admin" || role === "system-user") && (
                <Link href="/dashboard/survey/create" passHref>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow flex items-center justify-center"
                    aria-label="Add Survey"
                    title="Add Survey"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
