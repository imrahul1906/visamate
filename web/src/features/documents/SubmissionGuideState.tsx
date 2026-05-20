"use client";

// SubmissionGuideState.tsx
//
// Shown in the right panel (replacing DocChecklistEmptyState) once all
// required documents have been checked off.  Renders the importantNotes
// from the raw RequirementsData JSON as a polished submission guide.

import { useEffect, useState } from "react";

interface SubmissionGuideStateProps {
  countryName: string;
  visaTypeName: string;
  importantNotes: string[];
}

// ── Icon map — maps note keywords → relevant emoji ────────────────────────────
function getNoteIcon(note: string): string {
  const lower = note.toLowerCase();
  if (lower.includes("photocop") || lower.includes("a4")) return "📄";
  if (lower.includes("stapl")) return "📎";
  if (lower.includes("famil") || lower.includes("group")) return "👨‍👩‍👧";
  if (lower.includes("interview") || lower.includes("additional")) return "🗣️";
  if (lower.includes("passport")) return "🛂";
  if (lower.includes("processing") || lower.includes("time")) return "⏱️";
  if (lower.includes("vfs")) return "🏢";
  if (lower.includes("fee") || lower.includes("payment")) return "💳";
  if (lower.includes("travel") || lower.includes("itin")) return "✈️";
  return "📌";
}

export function SubmissionGuideState({
  countryName,
  visaTypeName,
  importantNotes,
}: SubmissionGuideStateProps) {
  // Stagger-in animation: each note fades up one by one
  const [visibleCount, setVisibleCount] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    // Header first
    const t0 = setTimeout(() => setHeaderVisible(true), 80);
    // Then notes staggered
    const timers: ReturnType<typeof setTimeout>[] = [t0];
    importantNotes.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 200 + i * 90));
    });
    return () => timers.forEach(clearTimeout);
  }, [importantNotes]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 28px 32px",
        textAlign: "center",
        overflowY: "auto",
      }}
    >
      {/* ── Celebration icon ──────────────────────────────────────── */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.08) 100%)",
          border: "1px solid rgba(52,211,153,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 18,
          boxShadow: "0 0 32px rgba(16,185,129,0.15)",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "scale(1)" : "scale(0.85)",
          transition: "opacity 350ms ease, transform 350ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        🎯
      </div>

      {/* ── Heading ───────────────────────────────────────────────── */}
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20,
          fontWeight: 400,
          color: "rgba(255,255,255,0.9)",
          margin: "0 0 6px",
          lineHeight: 1.3,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 300ms ease 60ms, transform 300ms ease 60ms",
        }}
      >
        Ready to Apply
      </h2>

      {/* ── Subheading ────────────────────────────────────────────── */}
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          margin: "0 0 28px",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
          maxWidth: 320,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 300ms ease 120ms, transform 300ms ease 120ms",
        }}
      >
        All required documents for your{" "}
        <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
          {countryName} {visaTypeName}
        </span>{" "}
        are checked. Keep these in mind before you submit.
      </p>

      {/* ── Notes list ────────────────────────────────────────────── */}
      {importantNotes.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            textAlign: "left",
          }}
        >
          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 300ms ease 160ms",
            }}
          >
            <div
              style={{
                height: 1,
                width: 24,
                background: "rgba(52,211,153,0.4)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#34d399",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Important Notes
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(52,211,153,0.15)",
              }}
            />
          </div>

          {importantNotes.map((note, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "3px solid rgba(52,211,153,0.35)",
                borderRadius: "0 10px 10px 0",
                padding: "11px 14px",
                opacity: visibleCount > i ? 1 : 0,
                transform:
                  visibleCount > i ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 280ms ease, transform 280ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {/* Icon */}
              <span
                style={{
                  fontSize: 15,
                  flexShrink: 0,
                  lineHeight: 1,
                  marginTop: 1,
                  filter: "saturate(0.85)",
                }}
              >
                {getNoteIcon(note)}
              </span>

              {/* Text */}
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.55,
                  fontWeight: 450,
                }}
              >
                {note}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer CTA hint ───────────────────────────────────────── */}
      {importantNotes.length > 0 && visibleCount >= importantNotes.length && (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 10,
            opacity: 1,
            animation: "fadeInUp 320ms ease forwards",
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <span style={{ fontSize: 15 }}>📦</span>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}
          >
            Use the{" "}
            <span style={{ color: "#818cf8", fontWeight: 600 }}>
              ZIP download
            </span>{" "}
            in the checklist to pack all uploaded files.
          </span>
        </div>
      )}
    </div>
  );
}