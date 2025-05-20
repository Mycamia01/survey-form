"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import RecipientListByUser from "../../../components/settings/RecipientListByUser";
import { useAuth } from "../../../components/AuthProvider";

export default function AdminSettings() {
  const { user, role, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    const loadUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(data.filter((u) => u.id !== user?.uid)); // Exclude current admin
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [role, user]);

  const deleteUser = async (uid) => {
    if (!confirm("Delete this user? This is permanent.")) return;
    
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((prev) => prev.filter((u) => u.id !== uid));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    }
  };

  if (role !== "admin") {
    return <div className="p-6 text-center">Unauthorized access</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold">Manage System Users</h2>
      {users.map((u) => (
        <div key={u.id} className="border p-4 rounded space-y-2">
          <p className="font-semibold">{u.name} ({u.email})</p>
          <div className="flex items-center space-x-4">
            <select
              value={u.role || "system_user"}
              onChange={(e) => handleRoleChange(u.id, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="system_user">System User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteUser(u.id)}
            >
              Delete User
            </button>
          </div>
          <RecipientListByUser userId={u.id} />
        </div>
      ))}
    </div>
  );
}