"use client";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow rounded p-6 ${className}`}>
      {children}
    </div>
  );
}
