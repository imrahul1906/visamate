"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  selectedCountry: string | null;
  onSelect: (code: string) => void;
}

const COUNTRIES = [
  {
    code: "JP",
    name: "Japan",
    photo: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='%23cce5ff'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='24'>Japan</text></svg>",
  },
  {
    code: "IN",
    name: "India",
    photo: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='%23ffd9c2'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='24'>India</text></svg>",
  },
  {
    code: "US",
    name: "United States",
    photo: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='%23d9ffd9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='24'>USA</text></svg>",
  },
];

export default function StepCountry({ selectedCountry, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(term));
  }, [search]);

  const handleSelect = (code: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("country", code);
    router.replace(`?${params.toString()}`);
    onSelect(code);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">🔍</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const isSelected = selectedCountry === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(c.code)}
              className={`relative rounded-xl overflow-hidden border transition-colors flex flex-col h-48 ${
                isSelected ? "border-indigo-600" : "border-gray-200"
              }`}
            >
              {/* Image – 70% */}
              <div className="flex-7" style={{ flexBasis: "70%" }}>
                <img src={c.photo} alt={c.name} className="object-cover w-full h-full" />
              </div>
              {/* Check badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">✔</div>
              )}
              {/* Name – remaining 30% */}
              <div className="flex-3 flex items-center justify-center py-2 text-center">
                <span className="font-bold text-gray-800">{c.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
