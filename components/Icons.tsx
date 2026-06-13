// components/Icons.tsx
"use client";

import {
  FaFileContract,
  FaHelmetSafety,
  FaBuilding,
  FaCity,
  FaRoad,
  FaGavel,
} from "react-icons/fa6";

export default function Icons() {
  return (
    <div className="flex gap-6 text-5xl text-teal-600 mb-4">
      <FaFileContract />
      <FaHelmetSafety />
      <FaBuilding />
      <FaCity />
      <FaRoad />
      <FaGavel />
    </div>
  );
}
