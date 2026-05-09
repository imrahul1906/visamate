"use client";

import React, { useState, useMemo } from "react";
import type { CountryCatalogEntry } from "@/lib/data/repository";

interface Props {
  allCountries: CountryCatalogEntry[] | undefined | null;
  selectedCountry: string | null;
  onSelect: (code: string | null, name: string | null) => void;
  compact?: boolean;
}

export default function StepCountry({ allCountries, selectedCountry, onSelect, compact }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!Array.isArray(allCountries)) return [];
    const q = search.trim().toLowerCase();

    // Only show countries that exist in our data.
    // Supported ones always sort first; within each group, alphabetical.
    return [...allCountries]
      .filter((c) => !q || c.name.toLowerCase().includes(q))
.sort(
  (a, b) =>
    (b.supported === true ? 1 : 0) -
      (a.supported === true ? 1 : 0) ||
    a.name.localeCompare(b.name)
)}, [search, allCountries]);

  const isSearching = search.trim().length > 0;

  return (
    <div>
      {!compact && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Step 1</div>
          <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Select destination</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 3, marginBottom: 0 }}>Where are you planning to go?</p>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            paddingLeft: 34, paddingRight: search ? 32 : 12, paddingTop: 9, paddingBottom: 9,
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(108,92,231,0.6)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
        />
        <svg
          style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
        </svg>
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
              width: 16, height: 16, cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="8" height="8" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hint row */}
      {!isSearching && Array.isArray(allCountries) && allCountries.length > 0 && (
        <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, marginBottom: 8, letterSpacing: "0.04em" }}>
          {(() => {
            const supported = allCountries.filter(c => c.supported).length;
            return supported === 1
              ? "1 destination available — more coming soon"
              : `${supported} destinations available`;
          })()}
        </div>
      )}

      {/* Country list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: 300,
          overflowY: "auto",
          // Hide scrollbar cross-browser while keeping scroll
          scrollbarWidth: "none",        // Firefox
          msOverflowStyle: "none",       // IE/Edge legacy
          paddingRight: 1,
        }}
        // WebKit scrollbar hidden via inline style workaround (injected below via <style>)
      >
        <style>{`
          .country-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Re-wrap with className for webkit */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, padding: "20px 0", margin: 0 }}>
            {Array.isArray(allCountries) ? "No countries found" : "Loading..."}
          </p>
        ) : (
          filtered.map((c) => {
            const isSelected = selectedCountry === c.code;
            return (
              <CountryRow
                key={c.code}
                country={c}
                isSelected={isSelected}
                onSelect={() => {
                  if (!c.supported) return;
                  onSelect(isSelected ? null : c.code, isSelected ? null : c.name);
                }}
              />
            );
          })
        )}
      </div>

      {/* Scroll hint fade — purely decorative */}
      {filtered.length > 5 && (
        <div style={{
          height: 20,
          background: "linear-gradient(to top, rgba(15,12,30,0.6) 0%, transparent 100%)",
          marginTop: -20,
          pointerEvents: "none",
          position: "relative",
          zIndex: 1,
          borderRadius: "0 0 8px 8px",
        }} />
      )}
    </div>
  );
}

// ─── Country Row Card ─────────────────────────────────────────────────────────

function CountryRow({
  country: c,
  isSelected,
  onSelect,
}: {
  country: CountryCatalogEntry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      disabled={!c.supported}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "7px 10px",
        borderRadius: 10,
        border: isSelected
          ? "1px solid rgba(108,92,231,0.7)"
          : hovered && c.supported
          ? "1px solid rgba(108,92,231,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        background: isSelected
          ? "rgba(108,92,231,0.12)"
          : hovered && c.supported
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.03)",
        cursor: c.supported ? "pointer" : "not-allowed",
        opacity: !c.supported ? 0.5 : 1,
        transition: "all 0.15s ease",
        textAlign: "left",
        boxSizing: "border-box",
        flexShrink: 0,
        boxShadow: isSelected ? "0 0 0 3px rgba(108,92,231,0.12)" : "none",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 7,
          overflow: "hidden",
          flexShrink: 0,
          background: "rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {c.photo && (
          <img
            src={c.photo}
            alt={c.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
        {!c.photo && (
          // Fallback: country code initials
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.05em",
          }}>
            {c.code}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: isSelected ? "#fff" : "rgba(255,255,255,0.85)",
          fontSize: 13,
          fontWeight: isSelected ? 600 : 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.3,
        }}>
          {c.name}
        </div>
        {!c.supported && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 1 }}>Coming soon</div>
        )}
      </div>

      {/* Right side: checkmark or arrow */}
      <div style={{ flexShrink: 0, width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSelected ? (
          <div style={{
            width: 18, height: 18,
            background: "#6c5ce7",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(108,92,231,0.5)",
          }}>
            <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        ) : c.supported ? (
          <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        ) : null}
      </div>
    </button>
  );
}