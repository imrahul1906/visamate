"use client";

import React, { useState, useMemo } from "react";

interface Props {
  selectedCountry: string | null;
  onSelect: (code: string | null, name: string | null) => void;
  compact?: boolean;
}

const COUNTRIES = [
  {
    code: "JP",
    name: "Japan",
    photo: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800",
  },
  {
    code: "KR",
    name: "South Korea",
    photo: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800",
  },
  {
    code: "CA",
    name: "Canada",
    photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
  },
  {
    code: "US",
    name: "United States",
    photo: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800",
  },
  {
    code: "AU",
    name: "Australia",
    photo: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800",
  },
  {
    code: "UK",
    name: "United Kingdom",
    photo: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800",
  },
  {
    code: "FR",
    name: "France",
    photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
  },
  {
    code: "DE",
    name: "Germany",
    photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800",
  },
  {
    code: "SG",
    name: "Singapore",
    photo: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800",
  },
];

export default function StepCountry({ selectedCountry, onSelect, compact }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div>
      {!compact && (
        <div className="mb-5">
          <div className="text-[11px] text-gray-400 mb-1">Step 1</div>
          <h2 className="text-[18px] font-medium text-gray-800">Select Country</h2>
          <p className="text-[13px] text-gray-400 mt-1">Where are you planning to go?</p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
        </svg>
      </div>

      {/* Country cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((c) => {
          const isSelected = selectedCountry === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelect(isSelected ? null : c.code, isSelected ? null : c.name)}
              className={`relative h-[130px] rounded-xl overflow-hidden transition-all duration-200
                ${isSelected
                  ? "ring-2 ring-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                  : "ring-1 ring-gray-200 hover:ring-indigo-300 hover:shadow-md hover:scale-[1.02]"
                }`}
              style={{
                backgroundImage: `url(${c.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-white text-xs font-semibold drop-shadow">{c.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
