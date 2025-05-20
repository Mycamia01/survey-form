"use client";
import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white ${bgColor} max-w-xs`}
      role="alert"
    >
      {message}
    </div>
  );
}
