"use client";

import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar for desktop and mobile */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
