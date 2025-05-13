"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to CAMIA Survey Form</h1>
        <p className="mb-8 text-gray-700">
          Please login or sign up to create and manage surveys easily.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button onClick={() => router.push("/signup")} className="bg-green-600 hover:bg-green-700">
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
}
