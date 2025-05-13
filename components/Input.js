"use client";

export default function Input({ type = "text", placeholder = "", value, onChange, className = "" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition ${className}`}
    />
  );
}
