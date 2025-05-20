"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      setLoading(true);
      if (firebaseUser) {
        try {
          // Force refresh token to get latest claims
          const tokenResult = await getIdTokenResult(firebaseUser, true);
          const roleFromToken = tokenResult.claims.role || null;
          
          // Get user document from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // Create new user document if doesn't exist
            await setDoc(userRef, {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: roleFromToken || "system_user",
              createdAt: new Date().toISOString()
            });
          }

          // Get updated user data
          const updatedSnap = await getDoc(userRef);
          const userData = updatedSnap.data();
          
          // Use role from token if available, otherwise from Firestore
          const finalRole = roleFromToken || userData?.role || "system_user";
          setRole(finalRole);
          setUser({
            ...firebaseUser,
            ...userData,
            role: finalRole
          });

          // Update token claims if they were missing
          if (!roleFromToken && userData?.role) {
            await getIdTokenResult(firebaseUser, true);
          }
        } catch (err) {
          console.error("Auth error:", err);
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      setMounted(false);
      unsub();
    };
  }, [mounted]);

  const updateUserRole = async (userId, newRole) => {
    if (role !== "admin") return false;
    
    try {
      // Update Firestore
      await setDoc(doc(db, "users", userId), { role: newRole }, { merge: true });
      
      // If updating current user, refresh state
      if (user?.uid === userId) {
        setRole(newRole);
        setUser(prev => ({ ...prev, role: newRole }));
      }
      
      // Force token refresh to update claims
      if (auth.currentUser?.uid === userId) {
        await getIdTokenResult(auth.currentUser, true);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);