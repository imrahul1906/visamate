"use client";

import React, { useState, useMemo } from "react";

interface Props {
  selectedCountry: string | null;
  onSelect: (code: string | null) => void;
}

const COUNTRIES = [
  { code: "JP", name: "Japan", photo: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200" },
  { code: "IN", name: "India", photo: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200" },
  { code: "US", name: "United States", photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200" },
  { code: "UK", name: "United Kingdom", photo: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200" },
  { code: "FR", name: "France", photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200" },
  { code: "CA", name: "Canada", photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200" },
];

export default function StepCountry({ selectedCountry, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelect = (code: string | null) => {
    const params = new URLSearchParams(window.location.search);

    if (!code) {
      params.delete("country");
    } else {
      params.set("country", code);
    }

    // ✅ FIX: update URL without navigation
    window.history.replaceState(null, "", `?${params.toString()}`);

    onSelect(code);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div className="text-[11px] text-gray-400 mb-1">Step 1</div>
        <h2 className="text-[18px] font-medium text-gray-800 leading-tight">
          Select Country
        </h2>
        <p className="text-[13px] text-gray-400 mt-1">
          Where are you planning to go? Select your destination country
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((c) => {
          const isSelected = selectedCountry === c.code;

          return (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(isSelected ? null : c.code)}
              className={`relative h-[210px] rounded-xl overflow-hidden transition-all duration-200
              ${isSelected
                  ? "border-2 border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.15)]"
                  : "border border-gray-200"
                }
              hover:shadow-md hover:scale-[1.02]`}
              style={{
                backgroundImage: `url(${c.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                  <span className="text-indigo-600 text-sm">✓</span>
                </div>
              )}

              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-white text-sm font-semibold">
                  {c.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}