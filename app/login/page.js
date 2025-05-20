"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase-config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Link from "next/link";
import { useToast } from "../../components/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // ✅ Check if user exists in /users and has a role
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        addToast("Access denied: user not found in database.", "error");
        return;
      }

      const userData = userSnap.data();

      if (!userData.role) {
        addToast("Access denied: no role assigned to this user.", "error");
        return;
      }

      // ✅ Redirect to dashboard
      addToast("Login successful", "success");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      addToast("Login failed: " + err.message, "error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
        />
        <Button onClick={login} className="w-full mb-4">
          Login
        </Button>
        <div className="flex justify-between text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
