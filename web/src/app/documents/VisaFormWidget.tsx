"use client";

// web/src/app/documents/VisaFormWidget.tsx
import { useState, useEffect, useRef } from "react";
import type { DocumentItem } from "./types";
import { getFormFillFields } from "../../lib/data/repository";
import type { FormFillField } from "../../lib/data/repository";

// ─────────────────────────────────────────────────────────────
// Theme — matches DocumentsContent dark navy palette
// ─────────────────────────────────────────────────────────────
const T = {
  bg:          "#0d0d1f",
  surface:     "#13132a",
  surface2:    "#1a1a35",
  surface3:    "#20203e",
  border:      "rgba(255,255,255,0.08)",
  border2:     "rgba(255,255,255,0.14)",
  indigo:      "#6366f1",
  indigoLight: "#818cf8",
  indigoGlow:  "rgba(99,102,241,0.18)",
  text:        "#f1f5f9",
  muted:       "rgba(255,255,255,0.38)",
  muted2:      "rgba(255,255,255,0.55)",
  green:       "#4ade80",
  greenBg:     "rgba(74,222,128,0.1)",
  greenBorder: "rgba(74,222,128,0.25)",
  amber:       "#fbbf24",
  amberBg:     "rgba(251,191,36,0.1)",
  amberBorder: "rgba(251,191,36,0.3)",
  font:        "'DM Sans', sans-serif",
};

// Types are imported from repository above — no local re-declaration needed.

// ─────────────────────────────────────────────────────────────
// Section icon map
// ─────────────────────────────────────────────────────────────
function SectionIcon({ section }: { section: string }) {
  const s = section.toLowerCase();
  if (s.includes("personal"))
    return (
      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    );
  if (s.includes("passport"))
    return (
      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    );
  if (s.includes("work") || s.includes("address"))
    return (
      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    );
  if (s.includes("travel"))
    return (
      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    );
  if (s.includes("guarantor") || s.includes("inviter"))
    return (
      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    );
  // additional / default
  return (
    <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// VisaFormWidget
// ─────────────────────────────────────────────────────────────
export default function VisaFormWidget({
  doc,
  color,
}: {
  doc: DocumentItem;
  color: string;
}) {
  const formInfo      = doc.form;
  const isDownloadable = !formInfo || formInfo.type === "DOWNLOADABLE";

  // ── Load fields from JSON ──────────────────────────────────
  const [allFields, setAllFields] = useState<FormFillField[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);

  useEffect(() => {
    setFieldsLoading(true);
    getFormFillFields(formInfo?.formFillDataKey).then((fields) => {
      setAllFields(fields);
      setFieldsLoading(false);
    });
  }, [formInfo?.formFillDataKey]);

  // ── UI state ───────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeFieldId,  setActiveFieldId]  = useState<string | null>(null);
  const [doneFields,     setDoneFields]     = useState<Set<string>>(new Set());
  const [copiedId,       setCopiedId]       = useState<string | null>(null);
  const [helperOpen,     setHelperOpen]     = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [sectionsInitialized, setSectionsInitialized] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleSection = (sectionName: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionName) ? next.delete(sectionName) : next.add(sectionName);
      return next;
    });
  };

  // Auto-select first field once loaded
  useEffect(() => {
    if (allFields.length > 0 && !activeFieldId) {
      setActiveFieldId(allFields[0].id);
    }
    // Collapse all sections except the first on initial load
    if (allFields.length > 0 && !sectionsInitialized) {
      const uniqueSections = [...new Set(allFields.map((f) => f.section))];
      const toCollapse = new Set(uniqueSections.slice(1)); // all except first
      setCollapsedSections(toCollapse);
      setSectionsInitialized(true);
    }
  }, [allFields]);

  // ── Derived ────────────────────────────────────────────────
  const filteredFields = allFields.filter(
    (f) =>
      !searchQuery ||
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.hint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = filteredFields.reduce<Record<string, FormFillField[]>>((acc, f) => {
    (acc[f.section] ??= []).push(f);
    return acc;
  }, {});

  const activeField  = allFields.find((f) => f.id === activeFieldId) ?? null;
  const totalFields  = allFields.length;
  const doneCount    = doneFields.size;
  const donePct      = totalFields > 0 ? Math.round((doneCount / totalFields) * 100) : 0;
  const allDone      = doneCount === totalFields && totalFields > 0;

  const toggleDone = (id: string) => {
    setDoneFields((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyExample = (example: string, id: string) => {
    navigator.clipboard.writeText(example).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
  };

  const accentColor = color || T.indigo;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        fontFamily: T.font,
      }}
    >
      <style>{`
        .vfw-left-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-left-scroll::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
        .vfw-left-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        .vfw-left-scroll::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }

        .vfw-right-scroll::-webkit-scrollbar { width: 4px; }
        .vfw-right-scroll::-webkit-scrollbar-track { background: rgba(99,102,241,0.05); border-radius: 2px; }
        .vfw-right-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        .vfw-right-scroll::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.65); }
      `}</style>
      {/* ══════════════════════════════════════════════════════
          STEP 1 — Download or Online
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${T.border}`,
          background: isDownloadable
            ? "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)"
            : "linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(74,222,128,0.03) 100%)",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            flexShrink: 0,
            background: isDownloadable ? T.indigoGlow : T.greenBg,
            border: `1px solid ${isDownloadable ? "rgba(99,102,241,0.3)" : T.greenBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isDownloadable ? (
            <svg width="18" height="18" fill="none" stroke={T.indigoLight} strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke={T.green} strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: isDownloadable ? T.indigoLight : T.green,
              margin: "0 0 3px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Step 1 — {isDownloadable ? "Download the form" : "Fill the form online"}
          </p>
          <p style={{ fontSize: 12, color: T.muted2, margin: "0 0 12px", lineHeight: 1.5 }}>
            {isDownloadable
              ? "Download the official PDF, print it, and fill by hand using the helper below."
              : "Click below to open the official online application portal."}
          </p>

          {/* Downloadable CTA */}
          {isDownloadable && formInfo?.downloadUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <a
                href={formInfo.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: accentColor,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  boxShadow: `0 2px 12px ${accentColor}40`,
                  transition: "opacity 150ms",
                  fontFamily: T.font,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download official form (PDF)
              </a>

              {formInfo.requiresPrint && (
                <span
                  style={{
                    fontSize: 11,
                    color: T.amber,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: T.amberBg,
                    border: `1px solid ${T.amberBorder}`,
                    padding: "5px 10px",
                    borderRadius: 7,
                    fontWeight: 500,
                  }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Print & fill by hand
                </span>
              )}
            </div>
          )}

          {/* Online CTA */}
          {!isDownloadable && formInfo?.onlineUrl && (
            <a
              href={formInfo.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#16a34a",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: "0 2px 12px rgba(22,163,74,0.35)",
                fontFamily: T.font,
              }}
            >
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open application portal
            </a>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          STEP 2 — Form Fill Helper
      ══════════════════════════════════════════════════════ */}
      {formInfo?.formFillDataKey && (
        <div>
          {/* ── Header bar ── */}
          <div
            style={{
              padding: "12px 18px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              background: T.surface2,
            }}
          >
            {/* Left: title + progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: T.indigoGlow,
                    border: `1px solid rgba(99,102,241,0.25)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" fill="none" stroke={T.indigoLight} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: T.text, margin: 0 }}>
                    {isDownloadable ? "Step 2 — " : ""}Form Fill Helper
                  </p>
                  {!fieldsLoading && (
                    <p style={{ fontSize: 10, color: T.muted, margin: 0 }}>
                      {totalFields} fields across {Object.keys(sections).length || "—"} sections
                    </p>
                  )}
                </div>
              </div>

              {/* Progress pill */}
              {!fieldsLoading && totalFields > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 100,
                      height: 5,
                      background: T.border2,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        transition: "width 400ms ease",
                        width: `${donePct}%`,
                        background: allDone
                          ? `linear-gradient(90deg, #4ade80, #22c55e)`
                          : `linear-gradient(90deg, ${accentColor}, ${T.indigoLight})`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: allDone ? T.greenBg : T.indigoGlow,
                      border: `1px solid ${allDone ? T.greenBorder : "rgba(99,102,241,0.25)"}`,
                      color: allDone ? T.green : T.indigoLight,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doneCount}/{totalFields}
                  </span>
                </div>
              )}
            </div>

            {/* Right: search + collapse */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!fieldsLoading && totalFields > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: T.surface,
                    border: `1.5px solid ${T.border2}`,
                    borderRadius: 8,
                    padding: "5px 10px",
                    minWidth: 160,
                  }}
                >
                  <svg width="11" height="11" fill="none" stroke={T.muted} strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={searchRef}
                    placeholder="Search fields…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: 11,
                      color: T.text,
                      flex: 1,
                      fontFamily: T.font,
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

              {/* Collapse all sections toggle */}
              {!fieldsLoading && helperOpen && Object.keys(sections).length > 1 && (
                <button
                  onClick={() => {
                    const sectionNames = Object.keys(sections);
                    const allCollapsed = sectionNames.every((s) => collapsedSections.has(s));
                    if (allCollapsed) {
                      setCollapsedSections(new Set());
                    } else {
                      setCollapsedSections(new Set(sectionNames));
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: `1px solid ${T.border2}`,
                    background: "transparent",
                    color: T.muted2,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: T.font,
                    transition: "all 150ms",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = T.surface3;
                    (e.currentTarget as HTMLButtonElement).style.color = T.text;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
                  }}
                >
                  {Object.keys(sections).every((s) => collapsedSections.has(s)) ? "↕ Expand all" : "↕ Collapse all"}
                </button>
              )}

              {/* Collapse toggle */}
              <button
                onClick={() => setHelperOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: `1px solid ${T.border2}`,
                  background: "transparent",
                  color: T.muted2,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: T.font,
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = T.surface3;
                  (e.currentTarget as HTMLButtonElement).style.color = T.text;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = T.muted2;
                }}
              >
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{
                    transform: helperOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms",
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                {helperOpen ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>

          {/* ── Loading state ── */}
          {fieldsLoading && (
            <div
              style={{
                padding: "28px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: T.muted,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={T.indigoLight}
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span style={{ fontSize: 12, fontFamily: T.font }}>Loading form fields…</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* ── Main helper body ── */}
          {!fieldsLoading && helperOpen && totalFields > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                minHeight: 360,
                maxHeight: 500,
              }}
            >
              {/* ──────────── LEFT: Field list ──────────── */}
              <div
                className="vfw-left-scroll"
                style={{
                  borderRight: `1px solid ${T.border}`,
                  overflowY: "auto",
                  background: T.surface,
                  scrollbarWidth: "thin",
                  scrollbarColor: `rgba(99,102,241,0.35) transparent`,
                }}
              >
                {Object.keys(sections).length === 0 ? (
                  <div
                    style={{
                      padding: "28px 14px",
                      textAlign: "center",
                      color: T.muted,
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <p style={{ fontSize: 11, margin: 0, fontFamily: T.font }}>
                      No fields match<br />
                      <strong style={{ color: T.muted2 }}>"{searchQuery}"</strong>
                    </p>
                  </div>
                ) : (
                  Object.entries(sections).map(([sectionName, fields]) => {
                    const isCollapsed = collapsedSections.has(sectionName);
                    const sectionDone = fields.filter((f) => doneFields.has(f.id)).length;
                    const allSectionDone = sectionDone === fields.length;
                    return (
                    <div key={sectionName}>
                      {/* Section header — clickable to collapse */}
                      <div
                        onClick={() => toggleSection(sectionName)}
                        style={{
                          padding: "6px 12px",
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: allSectionDone ? T.green : T.muted,
                          background: T.surface2,
                          borderBottom: `1px solid ${T.border}`,
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "background 120ms",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface3; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface2; }}
                      >
                        <span style={{ color: allSectionDone ? T.green : T.indigoLight, opacity: 0.7 }}>
                          <SectionIcon section={sectionName} />
                        </span>
                        {sectionName}
                        <span
                          style={{
                            fontSize: 9,
                            color: allSectionDone ? T.green : T.muted,
                            background: allSectionDone ? T.greenBg : T.border,
                            padding: "1px 5px",
                            borderRadius: 10,
                          }}
                        >
                          {sectionDone}/{fields.length}
                        </span>
                        {/* Chevron */}
                        <svg
                          width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                          style={{
                            marginLeft: "auto",
                            flexShrink: 0,
                            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                            transition: "transform 200ms ease",
                            color: T.muted,
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>

                      {/* Fields — hidden when collapsed */}
                      {!isCollapsed && fields.map((field) => {
                        const isActive = activeFieldId === field.id;
                        const isDone   = doneFields.has(field.id);
                        return (
                          <div
                            key={field.id}
                            onClick={() => setActiveFieldId(field.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: `1px solid ${T.border}`,
                              background: isActive ? `${accentColor}18` : "transparent",
                              borderLeft: isActive
                                ? `2.5px solid ${accentColor}`
                                : "2.5px solid transparent",
                              transition: "all 120ms ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                (e.currentTarget as HTMLElement).style.background =
                                  T.surface3;
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                (e.currentTarget as HTMLElement).style.background =
                                  "transparent";
                            }}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDone(field.id);
                              }}
                              aria-label={isDone ? "Unmark" : "Mark as filled"}
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 4,
                                flexShrink: 0,
                                border: isDone
                                  ? `1.5px solid ${accentColor}`
                                  : `1.5px solid ${T.border2}`,
                                background: isDone ? accentColor : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 150ms",
                                padding: 0,
                              }}
                            >
                              {isDone && (
                                <svg
                                  width="8"
                                  height="8"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth={3}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              )}
                            </button>

                            {/* Label */}
                            <span
                              style={{
                                fontSize: 11,
                                flex: 1,
                                lineHeight: 1.4,
                                color: isDone
                                  ? T.muted
                                  : isActive
                                  ? T.text
                                  : T.muted2,
                                textDecoration: isDone ? "line-through" : "none",
                                fontWeight: isActive ? 600 : 400,
                                fontFamily: T.font,
                              }}
                            >
                              {field.label}
                            </span>

                            {/* Warning dot */}
                            {field.warning && !isDone && (
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: T.amber,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                  })
                )}
              </div>

              {/* ──────────── RIGHT: Detail panel ──────────── */}
              <div
                className="vfw-right-scroll"
                style={{
                  overflowY: "auto",
                  background: T.surface,
                  scrollbarWidth: "thin",
                  scrollbarColor: `rgba(99,102,241,0.35) transparent`,
                }}
              >
                {!activeField ? (
                  /* Empty state */
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "40px 20px",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      stroke={T.border2}
                      strokeWidth={1.2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"
                      />
                    </svg>
                    <p
                      style={{
                        fontSize: 12,
                        textAlign: "center",
                        color: T.muted,
                        margin: 0,
                        lineHeight: 1.6,
                        fontFamily: T.font,
                      }}
                    >
                      Select a field on the left
                      <br />
                      <span style={{ color: T.muted, fontSize: 11 }}>
                        to see how to fill it
                      </span>
                    </p>
                  </div>
                ) : (
                  /* Field detail */
                  <div style={{ padding: "18px 18px 14px" }}>
                    {/* Section breadcrumb */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: T.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontFamily: T.font,
                        }}
                      >
                        <SectionIcon section={activeField.section} />
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: T.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontFamily: T.font,
                        }}
                      >
                        {activeField.section}
                      </span>
                    </div>

                    {/* Field title */}
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.text,
                        margin: "0 0 12px",
                        lineHeight: 1.3,
                        fontFamily: T.font,
                      }}
                    >
                      {activeField.label}
                    </h3>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background: T.border,
                        marginBottom: 14,
                      }}
                    />

                    {/* Form reference */}
                    {activeField.formRef && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          marginBottom: 12,
                          padding: "8px 12px",
                          background: T.surface2,
                          border: `1px solid ${T.border}`,
                          borderRadius: 8,
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          fill="none"
                          stroke={T.muted}
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        <span
                          style={{
                            fontSize: 10,
                            color: T.muted,
                            lineHeight: 1.5,
                            fontFamily: T.font,
                          }}
                        >
                          <span style={{ fontWeight: 600, color: T.muted2 }}>On the form: </span>
                          {activeField.formRef}
                        </span>
                      </div>
                    )}

                    {/* What to write */}
                    <div
                      style={{
                        background: `${accentColor}0d`,
                        borderLeft: `3px solid ${accentColor}`,
                        borderRadius: "0 8px 8px 0",
                        padding: "12px 14px",
                        marginBottom: 12,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: accentColor,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          margin: "0 0 5px",
                          fontFamily: T.font,
                        }}
                      >
                        What to write
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: T.muted2,
                          margin: 0,
                          lineHeight: 1.65,
                          fontFamily: T.font,
                        }}
                      >
                        {activeField.hint}
                      </p>
                    </div>

                    {/* Example + copy */}
                    <div
                      style={{
                        background: T.surface2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: 8,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: T.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            margin: "0 0 3px",
                            fontFamily: T.font,
                          }}
                        >
                          Example
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            margin: 0,
                            fontFamily: "monospace",
                          }}
                        >
                          {activeField.example}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyExample(activeField.example, activeField.id)
                        }
                        style={{
                          flexShrink: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 10px",
                          borderRadius: 7,
                          border:
                            copiedId === activeField.id
                              ? `1px solid ${T.green}`
                              : `1px solid ${T.border2}`,
                          background:
                            copiedId === activeField.id
                              ? T.greenBg
                              : "transparent",
                          fontSize: 11,
                          fontWeight: 600,
                          color:
                            copiedId === activeField.id ? T.green : T.muted2,
                          cursor: "pointer",
                          transition: "all 150ms",
                          fontFamily: T.font,
                        }}
                      >
                        {copiedId === activeField.id ? "✓ Copied" : "Copy"}
                      </button>
                    </div>

                    {/* Warning */}
                    {activeField.warning && (
                      <div
                        style={{
                          background: T.amberBg,
                          border: `1px solid ${T.amberBorder}`,
                          borderRadius: 8,
                          padding: "10px 12px",
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          stroke={T.amber}
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          />
                        </svg>
                        <p
                          style={{
                            fontSize: 11,
                            color: T.amber,
                            margin: 0,
                            lineHeight: 1.6,
                            fontFamily: T.font,
                          }}
                        >
                          {activeField.warning}
                        </p>
                      </div>
                    )}

                    {/* Mark as done */}
                    <button
                      onClick={() => toggleDone(activeField.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        padding: "9px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: doneFields.has(activeField.id)
                          ? `1.5px solid ${accentColor}`
                          : `1.5px solid ${T.border2}`,
                        background: doneFields.has(activeField.id)
                          ? `${accentColor}18`
                          : "transparent",
                        fontSize: 12,
                        fontWeight: 600,
                        color: doneFields.has(activeField.id)
                          ? accentColor
                          : T.muted2,
                        transition: "all 150ms",
                        fontFamily: T.font,
                      }}
                    >
                      {doneFields.has(activeField.id)
                        ? "✓ Marked as filled — click to undo"
                        : "Mark this field as filled"}
                    </button>

                    {/* Next unfilled */}
                    {(() => {
                      const nextUnfilled = allFields.find(
                        (f) => !doneFields.has(f.id) && f.id !== activeField.id
                      );
                      return nextUnfilled ? (
                        <button
                          onClick={() => setActiveFieldId(nextUnfilled.id)}
                          style={{
                            width: "100%",
                            marginTop: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: "7px 16px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "none",
                            background: "transparent",
                            fontSize: 11,
                            fontWeight: 500,
                            color: T.muted,
                            transition: "color 150ms",
                            fontFamily: T.font,
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color =
                              T.muted2)
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color =
                              T.muted)
                          }
                        >
                          Next unfilled field →
                        </button>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── All done banner ── */}
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
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.green,
                  margin: 0,
                  fontFamily: T.font,
                }}
              >
                All {totalFields} fields marked as filled! Your form is ready to submit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}