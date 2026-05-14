"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getLocationsForCountry, getVfsCenterInfo } from "@/lib/data/repository";
import type { LocationCatalogEntry } from "@/lib/data/repository";
import type { VfsCenterInfo } from "@/lib/data/types";
import { scrollbarCSS } from "@/components/shared/theme";
import { useApplicant } from "@/lib/context/ApplicantContext";

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
function HoursRow({ label, slot }: { label: string; slot: { days: string; time: string; note?: string } }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: 12, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{slot.days}</div>
        {slot.note && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 4, padding: "2px 6px" }}>
            <svg width="8" height="8" fill="#fbbf24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
            <span style={{ fontSize: 9, color: "#fbbf24", fontWeight: 600 }}>{slot.note}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#a89cef", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: 6, padding: "3px 8px" }}>{slot.time}</div>
    </div>
  );
}

// ─── Center detail modal ──────────────────────────────────────────────────────
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

  const panelContent = (
    <>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", borderRadius: 6, padding: "3px 9px", marginBottom: 10 }}>
            <svg width="9" height="9" fill="none" stroke="#a89cef" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#a89cef", letterSpacing: "0.1em", textTransform: "uppercase" }}>Application Center</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 5 }}>{center.name}</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <svg width="11" height="11" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{center.address}</div>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{ marginLeft: 16, flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", transition: "all 150ms" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 0 20px" }} />

      {/* ── Contact buttons ── */}
      {(center.phone || center.website) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {center.phone && (
            <a href={`tel:${center.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", fontSize: 12, fontWeight: 600, color: "#a89cef", textDecoration: "none", transition: "all 150ms" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(108,92,231,0.22)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(108,92,231,0.12)"; }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.375.187-.724.5-.924l3.75-2.25a1.125 1.125 0 011.5.5l1.5 3a1.125 1.125 0 01-.326 1.5l-1.5 1.125c-.086.065-.137.165-.137.27 0 3.314 2.686 6 6 6a.375.375 0 00.27-.137l1.125-1.5a1.125 1.125 0 011.5-.326l3 1.5a1.125 1.125 0 01.5 1.5l-2.25 3.75a1.125 1.125 0 01-.924.5c-8.284 0-15-6.716-15-15z" />
              </svg>
              Call Center
            </a>
          )}
          {center.website && (
            <a href={center.website} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "all 150ms" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)"; }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              VFS Website
            </a>
          )}
        </div>
      )}

      {/* ── Operating Hours ── */}
      {center.operatingHours && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" fill="none" stroke="#a89cef" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.09em" }}>Operating Hours</span>
          </div>
          <div style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", padding: "2px 14px", background: "rgba(255,255,255,0.02)" }}>
            {center.operatingHours.submissionIndividual && <HoursRow label="Individual Submission" slot={center.operatingHours.submissionIndividual} />}
            {center.operatingHours.submissionAgent && <HoursRow label="Agent Submission" slot={center.operatingHours.submissionAgent} />}
            {center.operatingHours.passportCollection && (
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "11px 0" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Passport Collection</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{center.operatingHours.passportCollection.days}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#a89cef", whiteSpace: "nowrap", background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: 6, padding: "3px 8px" }}>{center.operatingHours.passportCollection.time}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── On-site Rules ── */}
      {center.security && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" fill="none" stroke="#a89cef" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.09em" }}>On-site Rules</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {center.security.mobilePhone && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>📱 Mobile phones</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 5, padding: "2px 8px" }}>{center.security.mobilePhone}</span>
              </div>
            )}
            {center.security.photography && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>📷 Photography</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, padding: "2px 8px" }}>{center.security.photography}</span>
              </div>
            )}
            {center.security.cloakingFacility && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>🧳 Bag storage</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 5, padding: "2px 8px" }}>{center.security.cloakingFacility}</span>
              </div>
            )}
          </div>
          {center.security.itemsNotAllowed && center.security.itemsNotAllowed.length > 0 && (
            <div style={{ borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <svg width="10" height="10" fill="#f87171" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.09em" }}>Do not bring</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {center.security.itemsNotAllowed.map((item) => (
                  <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "#f87171", fontWeight: 500 }}>
                    <svg width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Footer note ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}>
        <svg width="13" height="13" fill="none" stroke="#a89cef" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p style={{ fontSize: 11, color: "rgba(168,156,239,0.8)", lineHeight: 1.6, margin: 0 }}>
          We'll include all center rules in your personalised document checklist before your appointment.
        </p>
      </div>
    </>
  );

  const modalStyle: React.CSSProperties = isMobile
    ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", background: "#13112a", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none", boxShadow: "0 -16px 64px rgba(0,0,0,0.6)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 240ms ease, transform 240ms ease", padding: "16px 20px 40px" }
    : { position: "fixed", top: "50%", left: "50%", transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.96)", zIndex: 9999, width: "100%", maxWidth: 460, maxHeight: "88vh", overflowY: "auto", borderRadius: 16, background: "#13112a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,92,231,0.1)", opacity: visible ? 1 : 0, transition: "opacity 240ms ease, transform 240ms ease", padding: "24px 24px 28px" };

  const drawer = (
    <>
      <style>{scrollbarCSS}</style>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", opacity: visible ? 1 : 0, transition: "opacity 240ms ease" }} />
      <div className="vfs-drawer-scroll vm-scroll-indigo" style={modalStyle}>
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
          </div>
        )}
        {panelContent}
      </div>
    </>
  );

  return createPortal(drawer, document.body);
}

// ─── Location Row (matches StepCountry's CountryRow design language) ──────────
function LocationRow({
  loc,
  centerName,
  centerAddress,
  centerInfo,
  isSelected,
  onSelect,
  onInfoClick,
}: {
  loc: LocationCatalogEntry;
  centerName: string;
  centerAddress: string;
  centerInfo: VfsCenterInfo | null;
  isSelected: boolean;
  onSelect: () => void;
  onInfoClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
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
          : hovered
            ? "1px solid rgba(108,92,231,0.35)"
            : "1px solid rgba(255,255,255,0.07)",
        background: isSelected
          ? "rgba(108,92,231,0.12)"
          : hovered
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        textAlign: "left",
        boxSizing: "border-box",
        flexShrink: 0,
        boxShadow: isSelected ? "0 0 0 3px rgba(108,92,231,0.12)" : "none",
      }}
    >
      {/* City photo thumbnail */}
      <div style={{
        width: 38, height: 38,
        borderRadius: 7, overflow: "hidden",
        flexShrink: 0,
        background: "rgba(255,255,255,0.08)",
        position: "relative",
      }}>
        {loc.photo ? (
          <img
            src={loc.photo}
            alt={loc.city}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.05em",
          }}>
            {loc.city.slice(0, 2).toUpperCase()}
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
          {loc.city}
        </div>
        <div style={{
          fontSize: 10,
          color: isSelected ? "#a89cef" : "rgba(255,255,255,0.3)",
          marginTop: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: isSelected ? 600 : 400,
        }}>
          {centerName}
        </div>
      </div>

      {/* Right: info button or checkmark */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
        {centerInfo && (
          <div
            role="button"
            onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
            style={{
              width: 20, height: 20, borderRadius: "50%",
              background: isSelected ? "rgba(108,92,231,0.2)" : "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isSelected ? "#a89cef" : "rgba(255,255,255,0.35)",
              transition: "all 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(108,92,231,0.25)";
              e.currentTarget.style.color = "#a89cef";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isSelected ? "rgba(108,92,231,0.2)" : "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = isSelected ? "#a89cef" : "rgba(255,255,255,0.35)";
            }}
          >
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        )}

        <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          ) : (
            <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StepLocation({ countryCode, selectedLocation, onSelect, compact }: Props) {
  const { update } = useApplicant();
  const [locations, setLocations] = useState<LocationWithCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerInfo, setDrawerInfo] = useState<VfsCenterInfo | null>(null);

  useEffect(() => {
    if (!countryCode) {
      setLocations([]);
      update({ vfsCenter: "" });
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
      .catch((err) => console.error("[StepLocation] Failed to load locations for", countryCode, ":", err))
      .finally(() => setLoading(false));
  }, [countryCode]);

  const emptyStyle: React.CSSProperties = {
    padding: "28px 0", textAlign: "center",
    color: "rgba(255,255,255,0.3)", fontSize: 12,
  };

  if (!countryCode) return <div style={emptyStyle}>Please select a country first.</div>;
  if (loading) return <div style={emptyStyle}>Loading locations...</div>;
  if (locations.length === 0) return <div style={emptyStyle}>No application centers available for the selected country.</div>;

  // In compact mode, defer scrolling to the parent WizardCard — same pattern as StepCountry.
  const listScrollStyle: React.CSSProperties = compact
    ? { display: "flex", flexDirection: "column", gap: 6, paddingRight: 1 }
    : {
        display: "flex", flexDirection: "column", gap: 6,
        maxHeight: 300, overflowY: "auto",
        WebkitOverflowScrolling: "touch" as any,
        scrollBehavior: "smooth",
        paddingRight: 1,
      };

  return (
    <>
      <div>
        {!compact && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Step 3</div>
            <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Where will you apply from?</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 3, marginBottom: 0 }}>Select the city where you'll submit your application</p>
          </div>
        )}

        {/* Location count hint — mirrors StepCountry's hint row */}
        {locations.length > 0 && (
          <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, marginBottom: 8, letterSpacing: "0.04em" }}>
            {locations.length === 1
              ? "1 application center available"
              : `${locations.length} application centers available`}
          </div>
        )}

        {/* Location list */}
        <style>{scrollbarCSS}</style>
        <div className="vm-scroll-hidden" style={listScrollStyle}>
          {locations.map(({ loc, centerName, centerAddress, centerInfo }) => {
            const isSelected = selectedLocation === loc.code;
            return (
              <LocationRow
                key={loc.code}
                loc={loc}
                centerName={centerName}
                centerAddress={centerAddress}
                centerInfo={centerInfo}
                isSelected={isSelected}
                onSelect={() => {
                  const vfsCenter = isSelected ? null : loc.code;
                  onSelect(vfsCenter);
                  update({ vfsCenter: isSelected ? "" : loc.code });
                }}
                onInfoClick={() => centerInfo && setDrawerInfo(centerInfo)}
              />
            );
          })}
        </div>

        {/* Scroll-hint fade — only in non-compact (standalone) mode */}
        {!compact && locations.length > 5 && (
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

      {drawerInfo && <CenterDrawer info={drawerInfo} onClose={() => setDrawerInfo(null)} />}
    </>
  );
}