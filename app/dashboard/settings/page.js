"use client";
import dynamic from "next/dynamic";
import { useAuth } from "../../../components/AuthProvider";

const AdminSettings = dynamic(() => import("./AdminSettings"), { ssr: false });
const UserSettings = dynamic(() => import("./UserSettings"), { ssr: false });

export default function SettingsPage() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (!user) return <p>Please sign in to access settings</p>;

  if (role === "admin") return <AdminSettings />;
  if (role === "system_user") return <UserSettings />;

  return <p>Unauthorized - You don't have permission to view this page</p>;
}
