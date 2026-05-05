"use client";

import React from "react";

interface Props {
  selectedLocation: string | null;
  onSelect: (location: string | null) => void;
  compact?: boolean;
}

const LOCATIONS = [
  {
    city: "New Delhi",
    center: "VFS Global Center",
    address: "12A, Ring Road, Lajpat Nagar - III, New Delhi - 110034",
    photo: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
  },
  {
    city: "Mumbai",
    center: "VFS Global Center",
    address: "2nd Floor, A Wing, Marathon Futurex, N M Joshi Marg, Lower Parel, Mumbai - 400013",
    photo: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
  },
  {
    city: "Bengaluru",
    center: "VFS Global Center",
    address: "418, 1st Floor, 80 Feet Road, 4th Block, Koramangala, Bengaluru - 560034",
    photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800",
  },
  {
    city: "Chennai",
    center: "VFS Global Center",
    address: "159/1, Kodambakkam High Road, Nungambakkam, Chennai - 600034",
    photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800",
  },
  {
    city: "Kolkata",
    center: "VFS Global Center",
    address: "1A, Elgin Road, 5th Floor, Kolkata - 700020",
    photo: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800",
  },
  {
    city: "Hyderabad",
    center: "VFS Global Center",
    address: "Level 5, Cyber Towers, Hitech City, Hyderabad - 500081",
    photo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800",
  },
];

export default function StepLocation({ selectedLocation, onSelect, compact }: Props) {
  return (
    <div>
      {!compact && (
        <div className="mb-5">
          <div className="text-[11px] text-gray-400 mb-1">Step 3</div>
          <h2 className="text-[18px] font-medium text-gray-800">Where will you apply from?</h2>
          <p className="text-[13px] text-gray-400 mt-1">
            Select the city where you'll submit your application
          </p>
        </div>
      )}

      {/* Country label */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
        <span className="text-sm text-gray-500">India</span>
        <svg className="w-3.5 h-3.5 text-gray-400 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* City cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => {
          const isSelected = selectedLocation === loc.city;
          return (
            <button
              key={loc.city}
              type="button"
              onClick={() => onSelect(isSelected ? null : loc.city)}
              className={`text-left rounded-xl overflow-hidden border transition-all duration-200 group
                ${isSelected
                  ? "border-indigo-400 ring-2 ring-indigo-200 shadow-sm"
                  : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                }`}
            >
              {/* Photo */}
              <div className="relative h-24 overflow-hidden">
                <img
                  src={loc.photo}
                  alt={loc.city}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-xs font-semibold drop-shadow">{loc.city}</span>
                </div>
              </div>
              {/* Info */}
              <div className="px-3 py-2.5 bg-white">
                <div className="text-[11px] font-medium text-indigo-600">{loc.center}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{loc.address}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
