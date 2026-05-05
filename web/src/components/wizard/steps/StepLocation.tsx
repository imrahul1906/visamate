"use client";

import React, { useEffect, useState } from "react";
import { getLocationsForCountry, getVfsCenterInfo } from "@/lib/data/repository";
import type { LocationCatalogEntry } from "@/lib/data/repository";
import type { VfsCenterInfo } from "@/lib/data/types";

interface Props {
  countryCode: string | null;
  selectedLocation: string | null;
  onSelect: (locationCode: string | null) => void;
  compact?: boolean;
}

interface LocationWithCenter {
  loc: LocationCatalogEntry;
  centerName: string;
  centerAddress: string;
}

export default function StepLocation({ countryCode, selectedLocation, onSelect, compact }: Props) {
  const [locations, setLocations] = useState<LocationWithCenter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setLocations([]);
      return;
    }

    setLoading(true);

    getLocationsForCountry(countryCode)
      .then(async (locs) => {
        // Fetch VFS center details for each location in parallel
        const withCenters = await Promise.all(
          locs.map(async (loc) => {
            const center = await getVfsCenterInfo(loc.code);
            return {
              loc,
              centerName: center?.vfsCenter?.name ?? "VFS Global Center",
              centerAddress: center?.vfsCenter?.address ?? "",
            };
          })
        );
        setLocations(withCenters);
      })
      .finally(() => setLoading(false));
  }, [countryCode]);

  if (!countryCode) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        Please select a country first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">Loading locations...</div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        No application centers available for the selected country.
      </div>
    );
  }

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
        {locations.map(({ loc, centerName, centerAddress }) => {
          const isSelected = selectedLocation === loc.code;
          return (
            <button
              key={loc.code}
              type="button"
              onClick={() => onSelect(isSelected ? null : loc.code)}
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
              {/* VFS center info */}
              <div className="px-3 py-2.5 bg-white">
                <div className="text-[11px] font-medium text-indigo-600">{centerName}</div>
                {centerAddress && (
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{centerAddress}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}