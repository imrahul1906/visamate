"use client";

// VisaOverviewStrip.tsx

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { VisaType } from "@/lib/data/types";
import { T } from "@/components/shared/theme";

import { PALETTE } from "../visa_overview/palette";
import { SectionLabel, StatCard } from "../visa_overview/primitives";
import { FeeBreakdownSection } from "../visa_overview/FeeBreakdown";
import { ProcessFlag } from "../visa_overview/ProcessFlag";
import { PaymentInstructionCard } from "../visa_overview/PaymentInstructionCard";
import { AlertIcon } from "../visa_overview/icons";
import { useVisaOverviewData } from "../visa_overview/useVisaOverviewData";

interface VisaOverviewStripProps {
  embedded: boolean;
  countryName: string;
  visaTypeName: string;
  locationName: string;
  totalDocs: number;
  requiredDone: number;
  requiredTotal: number;
  uploadCount: number;
  uploadableCount: number;
  downloadingZip: boolean;
  onDownloadAll: () => void;
  visaType: VisaType | null;
}

// ─── Drawer — portalled to document.body so it never affects page scroll ──

function DrawerPortal({
  visaType, countryName, visaTypeName, onClose,
}: {
  visaType: VisaType;
  countryName: string;
  visaTypeName: string;
  onClose: () => void;
}) {
  const {
    currency, lastUpdated, hasFees, courierFee,
    totalMin, totalMax, visaFeeRefundable, serviceChargeRefundable,
    stats, processFlags, paymentInstructions,
  } = useVisaOverviewData(visaType);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Drawer — top:0 bottom:0 means it is always full viewport height */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(480px, 92vw)", zIndex: 9999,
        background: "rgb(13,11,36)",
        borderLeft: "1px solid rgba(129,140,248,0.18)",
        display: "flex", flexDirection: "column",   // header fixed, body scrolls
        boxShadow: "-12px 0 48px rgba(0,0,0,0.5)",
        animation: "vos-slidein 220ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        <style>{`
          @keyframes vos-slidein {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* ── Fixed header ── */}
        <div style={{
          flexShrink: 0,
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(22,20,60,0.95)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15 }}>🗺️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", fontFamily: "'DM Sans', sans-serif" }}>
                Visa Overview
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                {visaTypeName} · {countryName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, width: 30, height: 30, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body — flex:1 + overflow-y:auto keeps scroll INSIDE drawer ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px 32px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(129,140,248,0.35) transparent",
          display: "flex", flexDirection: "column", gap: 22,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, fontWeight: 400, color: T.text,
              margin: "0 0 6px",
            }}>
              {visaTypeName} · {countryName}
            </h2>
            <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              Complete fee, process, and payment details.
              {lastUpdated && (
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.6 }}>· Updated {lastUpdated}</span>
              )}
            </p>
          </div>

          {stats.length > 0 && (
            <div>
              <SectionLabel>At a glance</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {stats.map(s => <StatCard key={s.label} {...s} />)}
              </div>
            </div>
          )}

          {processFlags.length > 0 && (
            <div>
              <SectionLabel>Requirements</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {processFlags.map(flag => (
                  <ProcessFlag key={flag.label} label={flag.label} required={flag.required} />
                ))}
              </div>
            </div>
          )}

          {(hasFees || visaType.vfsCharges?.serviceCharge || visaType.vfsCharges?.courierCharges) && (
            <div>
              <SectionLabel>Fee breakdown</SectionLabel>
              <FeeBreakdownSection
                visaType={visaType} currency={currency} hasFees={hasFees}
                visaFeeRefundable={visaFeeRefundable} serviceChargeRefundable={serviceChargeRefundable}
                totalMin={totalMin} totalMax={totalMax} courierFee={courierFee}
              />
            </div>
          )}

          {paymentInstructions.length > 0 && (
            <div>
              <SectionLabel>Centre-specific exceptions</SectionLabel>
              <div style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                background: PALETTE.yellow.bg, border: `1px solid ${PALETTE.yellow.border}`,
                borderLeft: `3px solid ${PALETTE.yellow.text}`,
                borderRadius: 10, padding: "10px 14px", marginBottom: 10,
              }}>
                <span style={{ color: PALETTE.yellow.text, flexShrink: 0, marginTop: 1 }}><AlertIcon /></span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: PALETTE.yellow.text, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>
                    Special payment rules at select centres
                  </p>
                  <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                    These are <strong style={{ color: T.text }}>NOT UNIVERSAL</strong> — only for the specific <strong style={{ color: T.text }}>DROP OFF OFFICES</strong> below.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {paymentInstructions.map((instr, i) => (
                  <PaymentInstructionCard key={i} instruction={instr} fallbackCurrency={currency} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body   // ← portal target: completely outside the page's scroll container
  );
}

// ─── Travel watermark ─────────────────────────────────────────────────────
// Full-width dot grid + faint warm-gold radial bloom — spans the entire strip,
// country-agnostic, purely decorative.

function TravelWatermark() {
  return (
    <svg
      viewBox="0 0 700 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute", left: 0, top: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* dot grid — fine, uniform, covers full width */}
        <pattern id="wm-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="0.75" fill="white" opacity="0.2" />
        </pattern>
        {/* warm-gold bloom on the right third — draws eye toward the CTA */}
        <radialGradient id="wm-gold" cx="88%" cy="50%" r="38%">
          <stop offset="0%"   stopColor="rgb(200,160,80)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="rgb(200,160,80)" stopOpacity="0" />
        </radialGradient>
        {/* very faint left bloom so it's not totally flat on the left */}
        <radialGradient id="wm-left" cx="12%" cy="50%" r="30%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.025" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* dot grid — full strip */}
      <rect width="700" height="100" fill="url(#wm-dots)" />
      {/* gold bloom */}
      <rect width="700" height="100" fill="url(#wm-gold)" />
      {/* left bloom */}
      <rect width="700" height="100" fill="url(#wm-left)" />
    </svg>
  );
}

// ─── Color-coded info tile ─────────────────────────────────────────────────

interface InfoTileProps {
  label: string;
  value: string;
  /** "money" | "time" | "ok" | "warn" | "neutral" */
  variant: "money" | "time" | "ok" | "warn" | "neutral";
  icon: React.ReactNode;
}

const TILE_COLORS = {
  // gold — fee tile, matches the gold CTA accent
  money:   { bg: "rgba(232,201,122,0.08)", border: "rgba(232,201,122,0.18)", label: "rgba(232,201,122,0.55)", value: "#e8c97a" },
  // amber-orange — processing time (warm, urgency-adjacent)
  time:    { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.18)",  label: "rgba(251,146,60,0.55)",  value: "#fdba74" },
  // green — good-news status (not required)
  ok:      { bg: "rgba(74,222,128,0.07)",  border: "rgba(74,222,128,0.16)",  label: "rgba(74,222,128,0.55)",  value: "#86efac" },
  // red — bad-news status (required)
  warn:    { bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.18)", label: "rgba(251,113,133,0.55)", value: "#fda4af" },
  neutral: { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.16)", label: "rgba(148,163,184,0.5)",  value: "#cbd5e1" },
};

function InfoTile({ label, value, variant, icon }: InfoTileProps) {
  const c = TILE_COLORS[variant];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 10, padding: "8px 13px", flexShrink: 0,
    }}>
      <span style={{ color: c.value, display: "flex", flexShrink: 0, opacity: 0.85 }}>
        {icon}
      </span>
      <div>
        <div style={{
          fontSize: 9, color: c.label, fontFamily: "'DM Sans', sans-serif",
          marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: c.value,
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

// ─── Strip ─────────────────────────────────────────────────────────────────

export function VisaOverviewStrip({
  embedded,
  countryName,
  visaTypeName,
  locationName,
  totalDocs,
  visaType,
}: VisaOverviewStripProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { currency, totalMin, totalMax, processFlags } =
    useVisaOverviewData(visaType ?? ({} as VisaType));

  const fees           = visaType?.fees;
  const processingDays = visaType?.processingTime;

  // Total fee string — prefer totalMin/Max (includes VFS), fall back to base fee
  const totalFeeStr = (() => {
    if (totalMin != null && totalMax != null && totalMin !== totalMax)
      return `${currency} ${totalMin.toLocaleString()}–${totalMax.toLocaleString()}`;
    if (totalMin != null) return `${currency} ${totalMin.toLocaleString()}`;
    if (fees != null)     return `${currency} ${fees.toLocaleString()}`;
    return null;
  })();

  // Pull specific flags
  const flagMap = Object.fromEntries(
    (processFlags ?? []).map(f => [f.label.toLowerCase(), f.required])
  );
  const biometricsRequired = flagMap["biometrics"] ?? flagMap["biometric"] ?? null;
  const interviewRequired  = flagMap["interview"] ?? null;
  const vfsRequired        = flagMap["vfs appointment"] ?? flagMap["vfs"] ?? flagMap["in-person"] ?? null;

  return (
    <>
      {/* ── Strip ──────────────────────────────────────────────── */}
      <div style={{
        background: "#0b0a13",
        borderRadius: embedded ? 14 : 16,
        padding: embedded ? "15px 18px" : "16px 22px",
        marginBottom: 16,
        position: "relative", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: "1px solid rgba(200,160,80,0.35)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.45)",
      }}>
        {/* Japan watermark */}
        <TravelWatermark />

        {/* gold shimmer line along the top edge */}
        <div style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(200,160,80,0.65), transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Row 1: breadcrumbs + button — same as before */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8, marginBottom: 13,
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              {[
                { icon: "🌏", label: countryName },
                { icon: "📋", label: visaTypeName },
                { icon: "📍", label: locationName },
              ].map(({ icon, label }) => (
                <span key={label} style={{
                  fontSize: 11, fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.11)",
                  padding: "3px 10px", borderRadius: 20,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {visaType && (
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(200,160,80,0.1)",
                  color: "#e8c97a",
                  border: "1px solid rgba(200,160,80,0.35)",
                  borderRadius: 20, padding: "5px 13px 5px 9px", cursor: "pointer",
                  fontSize: 11.5, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  flexShrink: 0,
                  boxShadow: "0 0 14px rgba(200,160,80,0.15)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(200,160,80,0.18)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(200,160,80,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(200,160,80,0.1)";
                  e.currentTarget.style.boxShadow = "0 0 14px rgba(200,160,80,0.15)";
                }}
              >
                {/* live dot */}
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#e8c97a",
                  boxShadow: "0 0 6px rgba(232,201,122,0.9)",
                  flexShrink: 0,
                }} />
                Full visa overview
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </div>

          {/* Row 2: 5 color-coded info tiles — single row, no wrap on desktop */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

            {/* 1. Total fee (purple) */}
            {totalFeeStr && (
              <InfoTile
                label="Total fee (incl. VFS)"
                value={totalFeeStr}
                variant="money"
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}

            {/* 2. Processing time (amber) */}
            {processingDays != null && (
              <InfoTile
                label="Processing time"
                value={String(processingDays)}
                variant="time"
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}

            {/* 3. Biometrics (green = not required, red = required) */}
            {biometricsRequired !== null && (
              <InfoTile
                label="Biometrics"
                value={biometricsRequired ? "Required" : "Not required"}
                variant={biometricsRequired ? "warn" : "ok"}
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                  </svg>
                }
              />
            )}

            {/* 4. Interview (green = not required, red = required) */}
            {interviewRequired !== null && (
              <InfoTile
                label="Interview"
                value={interviewRequired ? "Required" : "Not required"}
                variant={interviewRequired ? "warn" : "ok"}
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                }
              />
            )}

            {/* 5. VFS / In-person (neutral if needed, green if not) */}
            {vfsRequired !== null && (
              <InfoTile
                label="VFS appointment"
                value={vfsRequired ? "Required" : "Not needed"}
                variant={vfsRequired ? "neutral" : "ok"}
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                }
              />
            )}

          </div>
        </div>
      </div>

      {/* Portal drawer — only mounted after client hydration */}
      {mounted && drawerOpen && visaType && (
        <DrawerPortal
          visaType={visaType}
          countryName={countryName}
          visaTypeName={visaTypeName}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}