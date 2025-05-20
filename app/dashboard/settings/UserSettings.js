"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import ProfileForm from "../../../components/settings/ProfileForm";
import UserStatsCard from "../../../components/settings/UserStatsCard";

export default function UserSettings() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setUserData(snap.data());
    };
    loadUser();
  }, [user]);

  const updateName = async (newName) => {
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { name: newName });
      setUserData(prev => ({ ...prev, name: newName }));
      alert("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name");
    }
  };

  if (!userData) return <div>Loading user data...</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">My Profile</h2>
      <ProfileForm name={userData?.name} onSave={updateName} />
      <UserStatsCard userId={user.uid} />
    </div>
  );
}