"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => {
    // Load role from localStorage for quicker render
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const roleFromDB = docSnap.data().role || null;
            setRole(roleFromDB);
            localStorage.setItem("userRole", roleFromDB);
          } else {
            setRole(null);
            localStorage.removeItem("userRole");
          }
        } catch (err) {
          console.error("Error getting role:", err.message);
          setRole(null);
        }
      } else {
        setRole(null);
        localStorage.removeItem("userRole");
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center text-lg font-medium">
          Checking credentials...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
