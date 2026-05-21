"use client";

/**
 * VisaFormWidget.tsx  (redesigned)
 *
 * Adopts the ItineraryWidget select → helper flow:
 *
 *   "select" mode  — two option cards:
 *                    • Card 1: download PDF / open online portal  (Step 1)
 *                    • Card 2: open Form Fill Helper              (Step 2)
 *
 *   "helper" mode  — full FieldList + FieldDetail panel with a ← Back button.
 *                    Fields are lazy-loaded the first time this mode is entered.
 *
 * No FormStepBanner, no collapsed teaser bar, no all-indigo palette.
 */

import { useState } from "react";
import type { DocumentItem } from "@/types/document";
import { T, font } from "@/components/shared/theme";
import { useFormState } from "./useFormState";
import FormFieldList from "./FormFieldList";
import FormFieldDetail from "./FormFieldDetail";

export default function VisaFormWidget({
  doc,
  color,
}: {
  doc: DocumentItem;
  color: string;
}) {
  const accentColor = color || T.indigo;
  const formInfo = doc.form;

  /* ── Top-level screen mode ── */
  const [mode, setMode] = useState<"select" | "helper">("select");
  /* ── All form state lives here ── */
  const {
    sections,
    activeField,
    fieldsLoading,
    searchQuery,
    setSearchQuery,
    searchRef,
    activeFieldId,
    setActiveFieldId,
    doneFields,
    toggleDone,
    totalFields,
    allDone,
    copiedId,
    copyExample,
    setHelperOpen,
    collapsedSections,
    setCollapsedSections,
    toggleSection,
    isDownloadable,
  } = useFormState(doc);

  /* ── When user clicks "Open helper", open it ── */
  const handleOpenHelper = () => {
    setHelperOpen(true); // triggers lazy field load in the hook
    setMode("helper");
  };

  const handleBack = () => {
    setMode("select");
  };

  const hasHelper = !!formInfo?.formFillDataKey;

  /* ══════════════════════════════════════════════════════════
     SELECT SCREEN — two option cards
     ══════════════════════════════════════════════════════════ */
  if (mode === "select") {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: font.sans,
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          padding: "28px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 220,
        }}
      >
        <div style={{ maxWidth: 520, width: "100%" }}>
          {/* Eyebrow */}
          <p
            style={{
              margin: "0 0 5px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accentColor,
              fontFamily: font.sans,
            }}
          >
            {doc.name ?? "Visa Form"}
          </p>

          {/* Title */}
          <h2
            style={{
              margin: "0 0 5px",
              fontSize: 19,
              fontWeight: 600,
              color: T.text,
              fontFamily: font.sans,
              lineHeight: 1.25,
            }}
          >
            How would you like to proceed?
          </h2>

          <p
            style={{
              margin: "0 0 20px",
              fontSize: 12,
              color: T.muted2,
              lineHeight: 1.55,
              fontFamily: font.sans,
            }}
          >
            {isDownloadable
              ? "Download the official form and use the helper to fill it field by field."
              : "Open the online portal or use the helper for step-by-step guidance."}
          </p>

          {/* Option cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* ── Card 1: Form action ── */}
            <a
              href={(isDownloadable ? formInfo?.downloadUrl : formInfo?.onlineUrl) ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "15px 18px",
                borderRadius: 10,
                border: `1px solid ${T.border2}`,
                background: "rgba(255,255,255,0.025)",
                cursor: "pointer",
                textDecoration: "none",
                transition: "border-color 150ms, background 150ms",
                color: T.muted2,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.border2;
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted2,
                  }}
                >
                  {isDownloadable ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  )}
                </div>

                {/* Text */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      fontFamily: font.sans,
                      lineHeight: 1,
                    }}
                  >
                    {isDownloadable ? "Download official form (PDF)" : "Open application portal"}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      fontFamily: font.sans,
                      lineHeight: 1.45,
                    }}
                  >
                    {isDownloadable
                      ? "Get the blank PDF from the official source, print and fill by hand."
                      : "Fill the form directly on the official government website."}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={T.muted}
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            {/* ── Card 2: Form Fill Helper ── (only if data key exists) */}
            {hasHelper && (
              <button
                onClick={handleOpenHelper}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "15px 18px",
                  borderRadius: 10,
                  border: `1px solid rgba(${hexToRgb(accentColor)},0.35)`,
                  background: `rgba(${hexToRgb(accentColor)},0.10)`,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  color: T.text,
                  transition: "background 150ms, border-color 150ms, box-shadow 150ms",
                  fontFamily: font.sans,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${hexToRgb(accentColor)},0.18)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${hexToRgb(accentColor)},0.55)`;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 24px rgba(${hexToRgb(accentColor)},0.15)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `rgba(${hexToRgb(accentColor)},0.10)`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${hexToRgb(accentColor)},0.35)`;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: `rgba(${hexToRgb(accentColor)},0.18)`,
                      border: `1px solid rgba(${hexToRgb(accentColor)},0.30)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: accentColor,
                    }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        lineHeight: 1,
                        fontFamily: font.sans,
                      }}
                    >
                      Form Fill Helper
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "2px 7px",
                          borderRadius: 99,
                          background: `rgba(${hexToRgb(accentColor)},0.18)`,
                          color: accentColor,
                          border: `1px solid rgba(${hexToRgb(accentColor)},0.35)`,
                        }}
                      >
                        Recommended
                      </span>
                    </span>
                    <span style={{ fontSize: 11, color: T.muted2, fontFamily: font.sans, lineHeight: 1.45 }}>
                      Field-by-field guidance — hints, examples, and warnings for every box.
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0 }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     HELPER SCREEN
     ══════════════════════════════════════════════════════════ */
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ fontFamily: font.sans, background: T.surface, borderTop: `1px solid ${T.border}` }}
    >
      {/* Scrollbar styles */}
      <style>{`
        .vfw-left-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-left-scroll::-webkit-scrollbar-track { background: transparent; }
        .vfw-left-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        .vfw-left-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
        .vfw-right-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-right-scroll::-webkit-scrollbar-track { background: transparent; }
        .vfw-right-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        .vfw-right-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
        @keyframes vfw-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Single merged topbar: back · search · collapse toggles ── */}
      {(() => {
        const sectionNames = Object.keys(sections);
        const allCollapsed =
          sectionNames.length > 0 &&
          sectionNames.every((s) => collapsedSections.has(s));

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              background: T.surface2,
              borderBottom: `1px solid ${T.border}`,
              flexWrap: "wrap",
            }}
          >
            {/* ← Back */}
            <button
              onClick={handleBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.muted2,
                borderRadius: 7,
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: font.sans,
                flexShrink: 0,
                transition: "background 120ms, color 120ms, border-color 120ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLButtonElement).style.color = T.text;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.border2;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 16, background: T.border, flexShrink: 0 }} />

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Search */}
            {!fieldsLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                }}
              >
                <svg width="11" height="11" fill="none" stroke={T.muted} strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fields…"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 11,
                    color: T.text,
                    width: 110,
                    fontFamily: font.sans,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: T.muted,
                      fontSize: 14,
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* Collapse toggle */}
            {!fieldsLoading && sectionNames.length > 1 && (
              <button
                onClick={() =>
                  setCollapsedSections(
                    allCollapsed ? new Set() : new Set(sectionNames)
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: "transparent",
                  color: T.muted2,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: font.sans,
                  transition: "all 150ms",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = T.text;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = T.border2;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                }}
              >
                {allCollapsed ? "↕ Expand all" : "↕ Collapse all"}
              </button>
            )}
          </div>
        );
      })()}

      {/* ── Loading spinner ── */}
      {fieldsLoading && (
        <div
          style={{
            padding: "36px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: T.muted,
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            viewBox="0 0 24 24"
            style={{ animation: "vfw-spin 0.9s linear infinite", opacity: 0.7 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span style={{ fontSize: 12, fontFamily: font.sans, color: T.muted }}>Loading form fields…</span>
        </div>
      )}

      {/* ── Two-column helper body ── */}
      {!fieldsLoading && totalFields > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            minHeight: 360,
            maxHeight: 480,
          }}
        >
          {/* Left: field list */}
          <div
            className="vfw-left-scroll"
            style={{
              borderRight: `1px solid ${T.border}`,
              overflowY: "auto",
              background: T.surface,
              scrollbarWidth: "thin",
              scrollbarColor: `rgba(99,102,241,0.30) transparent`,
            }}
          >
            <FormFieldList
              sections={sections}
              searchQuery={searchQuery}
              activeFieldId={activeFieldId}
              doneFields={doneFields}
              collapsedSections={collapsedSections}
              accentColor={accentColor}
              onSelectField={setActiveFieldId}
              onToggleDone={toggleDone}
              onToggleSection={toggleSection}
            />
          </div>

          {/* Right: field detail */}
          <div
            className="vfw-right-scroll"
            style={{
              overflowY: "auto",
              background: T.surface,
              scrollbarWidth: "thin",
              scrollbarColor: `rgba(99,102,241,0.30) transparent`,
            }}
          >
            <FormFieldDetail
              activeField={activeField}
              copiedId={copiedId}
              accentColor={accentColor}
              onCopyExample={copyExample}
            />
          </div>
        </div>
      )}

      {/* ── All-done banner ── */}
      {!fieldsLoading && allDone && (
        <div
          style={{
            margin: "0 16px 16px",
            background: T.greenBg,
            border: `1px solid ${T.greenBorder}`,
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 16 }}>🎉</span>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.green, margin: 0, fontFamily: font.sans }}>
            All {totalFields} fields marked as filled! Your form is ready to submit.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Utility: convert a hex color to "r,g,b" for rgba() ── */
function hexToRgb(hex: string): string {
  const fallback = "99,102,241"; // Indigo default fallback
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
    return fallback;
  }
  const clean = hex.replace("#", "");
  if (clean.length !== 3 && clean.length !== 6) {
    return fallback;
  }
  if (clean.length === 3) {
    const [r, g, b] = clean.split("").map((c) => parseInt(c + c, 16));
    if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
    return `${r},${g},${b}`;
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
  return `${r},${g},${b}`;
}