"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  centerInfo: VfsCenterInfo | null;
}

// ─── Hours row ────────────────────────────────────────────────────────────────
function HoursRow({
  label,
  slot,
}: {
  label: string;
  slot: { days: string; time: string; note?: string };
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid #f3f4f6",
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{slot.days}</div>
        {slot.note && <div style={{ fontSize: 10, color: "#d97706", marginTop: 2 }}>{slot.note}</div>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{slot.time}</div>
    </div>
  );
}

// ─── Center detail modal ──────────────────────────────────────────────────────
// Desktop: centered floating card (max-width 480px)
// Mobile:  bottom sheet (via CSS media query logic via JS matchMedia)
function CenterDrawer({ info, onClose }: { info: VfsCenterInfo; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const center = info.vfsCenter;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 240);
  };

  if (!center) return null;

  // ── Shared panel content ──
  const panelContent = (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "#eef2ff", borderRadius: 6, padding: "3px 8px",
            marginBottom: 10,
          }}>
            <svg width="10" height="10" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Application Center
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 4 }}>{center.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{center.address}</div>
        </div>
        <button
          onClick={handleClose}
          style={{
            marginLeft: 16, flexShrink: 0,
            width: 30, height: 30, borderRadius: "50%",
            background: "#f3f4f6", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6b7280", transition: "background 150ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
          onMouseLeave={e => (e.currentTarget.style.background = "#f3f4f6")}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f3f4f6", margin: "0 0 20px" }} />

      {/* Contact pills */}
      {(center.phone || center.website) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {center.phone && (
            <a href={`tel:${center.phone}`} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "#f9fafb", border: "1px solid #e5e7eb",
              fontSize: 12, fontWeight: 500, color: "#374151",
              textDecoration: "none", transition: "all 150ms",
            }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.375.187-.724.5-.924l3.75-2.25a1.125 1.125 0 011.5.5l1.5 3a1.125 1.125 0 01-.326 1.5l-1.5 1.125c-.086.065-.137.165-.137.27 0 3.314 2.686 6 6 6a.375.375 0 00.27-.137l1.125-1.5a1.125 1.125 0 011.5-.326l3 1.5a1.125 1.125 0 01.5 1.5l-2.25 3.75a1.125 1.125 0 01-.924.5c-8.284 0-15-6.716-15-15z" />
              </svg>
              Call Center
            </a>
          )}
          {center.website && (
            <a href={center.website} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "#f9fafb", border: "1px solid #e5e7eb",
              fontSize: 12, fontWeight: 500, color: "#374151",
              textDecoration: "none", transition: "all 150ms",
            }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              VFS Website
            </a>
          )}
        </div>
      )}

      {/* Operating Hours */}
      {center.operatingHours && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Operating Hours
            </span>
          </div>
          <div style={{ borderRadius: 10, border: "1px solid #f3f4f6", padding: "0 14px", background: "#fafafa" }}>
            {center.operatingHours.submissionIndividual && (
              <HoursRow label="Individual Submission" slot={center.operatingHours.submissionIndividual} />
            )}
            {center.operatingHours.submissionAgent && (
              <HoursRow label="Agent Submission" slot={center.operatingHours.submissionAgent} />
            )}
            {center.operatingHours.passportCollection && (
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "10px 0" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Passport Collection</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{center.operatingHours.passportCollection.days}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>{center.operatingHours.passportCollection.time}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security & Rules */}
      {center.security && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              On-site Rules
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {center.security.mobilePhone && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>📱 Mobile phones</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>{center.security.mobilePhone}</span>
              </div>
            )}
            {center.security.photography && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca" }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>📷 Photography</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>{center.security.photography}</span>
              </div>
            )}
            {center.security.cloakingFacility && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a" }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>🧳 Bag storage</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>{center.security.cloakingFacility}</span>
              </div>
            )}
          </div>

          {center.security.itemsNotAllowed && center.security.itemsNotAllowed.length > 0 && (
            <div style={{ borderRadius: 10, border: "1px solid #fecaca", background: "#fef2f2", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <svg width="11" height="11" fill="#ef4444" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.08em" }}>Do not bring</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {center.security.itemsNotAllowed.map((item) => (
                  <span key={item} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 99,
                    background: "#fff", border: "1px solid #fca5a5",
                    fontSize: 11, color: "#dc2626", fontWeight: 500,
                  }}>
                    <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "11px 14px", borderRadius: 10,
        background: "#eef2ff", border: "1px solid #c7d2fe",
      }}>
        <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p style={{ fontSize: 11, color: "#4f46e5", lineHeight: 1.6, margin: 0 }}>
          We'll include all center rules in your personalised document checklist before your appointment.
        </p>
      </div>
    </>
  );

  // ── Desktop: centered modal card ──────────────────────────────────────────
  // ── Mobile:  bottom sheet ─────────────────────────────────────────────────
  const modalStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 9999,
        maxHeight: "85vh",
        overflowY: "auto",
        borderRadius: "20px 20px 0 0",
        background: "#fff",
        boxShadow: "0 -8px 48px rgba(0,0,0,0.18)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 240ms ease, transform 240ms ease",
        padding: "16px 20px 40px",
      }
    : {
        position: "fixed",
        top: "50%", left: "50%",
        transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.96)",
        zIndex: 9999,
        width: "100%",
        maxWidth: 480,
        maxHeight: "88vh",
        overflowY: "auto",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        opacity: visible ? 1 : 0,
        transition: "opacity 240ms ease, transform 240ms ease",
        padding: "24px 24px 28px",
      };

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 240ms ease",
        }}
      />

      {/* Panel */}
      <div style={modalStyle}>
        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
          </div>
        )}
        {panelContent}
      </div>
    </>
  );

  return createPortal(drawer, document.body);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StepLocation({ countryCode, selectedLocation, onSelect, compact }: Props) {
  const [locations, setLocations] = useState<LocationWithCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerInfo, setDrawerInfo] = useState<VfsCenterInfo | null>(null);

  // ── Original data-fetching logic, completely untouched ──
  useEffect(() => {
    if (!countryCode) {
      setLocations([]);
      return;
    }

    setLoading(true);

    getLocationsForCountry(countryCode)
      .then(async (locs) => {
        const withCenters = await Promise.all(
          locs.map(async (loc) => {
            const center = await getVfsCenterInfo(loc.code);
            return {
              loc,
              centerName: center?.vfsCenter?.name ?? "VFS Global Center",
              centerAddress: center?.vfsCenter?.address ?? "",
              centerInfo: center ?? null,
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
    <>
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

        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
          </svg>
          <span className="text-sm text-gray-500">India</span>
          <svg className="w-3.5 h-3.5 text-gray-400 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {locations.map(({ loc, centerName, centerAddress, centerInfo }) => {
            const isSelected = selectedLocation === loc.code;
            return (
              <div
                key={loc.code}
                className={`rounded-xl overflow-hidden border transition-all duration-200 group
                  ${isSelected
                    ? "border-indigo-400 ring-2 ring-indigo-200 shadow-sm"
                    : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(isSelected ? null : loc.code)}
                  className="w-full block"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={loc.photo}
                      alt={loc.city}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-3">
                      <span className="text-white text-[13px] font-semibold drop-shadow">{loc.city}</span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-between pl-3 pr-2 py-2.5 bg-white">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-indigo-600 truncate">{centerName}</div>
                    {centerAddress && (
                      <div className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
                        {centerAddress}
                      </div>
                    )}
                  </div>
                  {centerInfo && (
                    <button
                      type="button"
                      onClick={() => setDrawerInfo(centerInfo)}
                      title="View center details"
                      className={`ml-2 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150
                        ${isSelected
                          ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedLocation && (
          <p className="mt-3 text-[11px] text-gray-400 text-center">
            Tap <span className="font-medium text-gray-500">ⓘ</span> on any card to see center hours & rules
          </p>
        )}
      </div>

      {drawerInfo && (
        <CenterDrawer info={drawerInfo} onClose={() => setDrawerInfo(null)} />
      )}
    </>
  );
}