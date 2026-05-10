"use client";

// app/documents/VisaOverviewPanel.tsx
//
// Shown in the RIGHT panel whenever activeDocId === null.
// Disappears the moment a user opens any document.
// Reappears when the last open document is closed.
//
// Data comes from visa-types.json via the repository layer.
// No direct JSON imports here — props only.

import type { VisaType } from "@/lib/data/types";
import { T, font } from "@/app/shared/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisaOverviewPanelProps {
  visaType: VisaType | null;
  countryName: string;
  visaTypeName: string;
}

// ─── Timeline step definition ─────────────────────────────────────────────────

interface TimelineStep {
  icon: string;
  label: string;
  sublabel: string;
  accent: string;
  dimmed?: boolean;
}

function buildTimeline(vt: VisaType): TimelineStep[] {
  const proc = vt.process?.default;
  const variant = vt.variants?.[0];

  const steps: TimelineStep[] = [
    {
      icon: "📝",
      label: "Prepare Documents",
      sublabel: "Gather all required paperwork from the checklist on the left",
      accent: "#818cf8",
    },
    {
      icon: proc?.applicationMode === "ONLINE" ? "🌐" : "🏛️",
      label: proc?.applicationMode === "ONLINE" ? "Submit Online" : "Submit at VFS Centre",
      sublabel:
        proc?.applicationMode === "ONLINE"
          ? "Fill & submit your application on the official portal"
          : "Visit your nearest VFS Global centre with originals + copies",
      accent: "#a78bfa",
    },
  ];

  if (proc?.biometricRequired) {
    steps.push({
      icon: "🖐️",
      label: "Biometrics Appointment",
      sublabel: "Fingerprints & photo taken at the VFS centre",
      accent: "#f472b6",
    });
  }

  if (proc?.interviewRequired) {
    steps.push({
      icon: "🎙️",
      label: "Interview",
      sublabel: "Attend a scheduled interview at the consulate",
      accent: "#fb923c",
    });
  }

  steps.push({
    icon: "⏳",
    label: "Processing",
    sublabel: "Embassy reviews your application (typically 5–10 working days for Japan)",
    accent: "#fbbf24",
  });

  steps.push({
    icon: "✅",
    label: "Visa Decision",
    sublabel: variant
      ? `Collect your ${variant.type.replace("_", " ").toLowerCase()} visa — valid for ${variant.validityMonths} month${variant.validityMonths !== 1 ? "s" : ""}`
      : "Collect your visa sticker or e-visa confirmation",
    accent: "#4ade80",
  });

  return steps;
}

// ─── Key stat pill ────────────────────────────────────────────────────────────

function StatPill({
  icon,
  label,
  value,
  accent,
  bg,
  border,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "11px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: accent,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VisaOverviewPanel({
  visaType,
  countryName,
  visaTypeName,
}: VisaOverviewPanelProps) {
  // ── Graceful fallback when data isn't loaded yet ──
  if (!visaType) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.35,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: T.text,
            margin: "0 0 8px",
            fontFamily: "'DM Serif Display', serif",
          }}
        >
          Select a document
        </p>
        <p
          style={{
            fontSize: 12,
            color: T.muted,
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 260,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Click any item on the left to view details, upload files, or use
          built-in tools like the itinerary builder.
        </p>
      </div>
    );
  }

  const timeline = buildTimeline(visaType);
  const variant = visaType.variants?.[0];
  const proc = visaType.process?.default;

  // ── Key stats ──
  // maxStayDays and validityMonths are the same duration expressed differently
  // (90 days = 3 months for Japan tourist). Show only days — more precise.
  // Freed slot replaced with visa category.
  const stayValue = variant?.maxStayDays
    ? `${variant.maxStayDays} days`
    : variant?.validityMonths
    ? `${variant.validityMonths} months`
    : "—";

  const stats = [
    {
      icon: "🗓️",
      label: "Max Stay",
      value: stayValue,
      accent: "#818cf8",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.2)",
    },
    {
      icon: "🏷️",
      label: "Category",
      value: visaType.category
        ? visaType.category.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "—",
      accent: "#a78bfa",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
    },
    {
      icon: "🔁",
      label: "Entry",
      value: variant?.type
        ? variant.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "—",
      accent: "#60a5fa",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.2)",
    },
    {
      icon: proc?.applicationMode === "ONLINE" ? "🌐" : "🏛️",
      label: "Mode",
      value: proc?.applicationMode === "ONLINE" ? "Online" : "In-Person",
      accent: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "22px 20px 24px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(99,102,241,0.35) transparent",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* ── Header ── */}
      <div>
        {/* Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 20,
            padding: "4px 12px",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 11 }}>🗺️</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#818cf8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Visa Overview
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18,
            fontWeight: 400,
            color: T.text,
            margin: "0 0 6px",
            lineHeight: 1.25,
          }}
        >
          {visaTypeName} · {countryName}
        </h2>
        <p
          style={{
            fontSize: 12,
            color: T.muted,
            margin: 0,
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Here's what your application journey looks like. Select any document
          on the left to start working through your checklist.
        </p>
      </div>

      {/* ── Key stats grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {stats.map((s) => (
          <StatPill key={s.label} {...s} />
        ))}
      </div>

      {/* ── Process flags ── */}
      {(proc?.biometricRequired === false || proc?.interviewRequired === false) && (
        <div
          style={{
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.18)",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {proc?.biometricRequired === false && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#4ade80",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              No biometrics required
            </span>
          )}
          {proc?.interviewRequired === false && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#4ade80",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              No interview required
            </span>
          )}
        </div>
      )}

      {/* ── Timeline ── */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.muted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 14px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Application Journey
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timeline.map((step, i) => {
            const isLast = i === timeline.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                {/* Left: dot + connector line */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 28,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `${step.accent}18`,
                      border: `1.5px solid ${step.accent}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div
                      style={{
                        width: 1.5,
                        flex: 1,
                        minHeight: 16,
                        background: `linear-gradient(to bottom, ${step.accent}40, ${timeline[i + 1].accent}20)`,
                        margin: "3px 0",
                      }}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div
                  style={{
                    paddingBottom: isLast ? 0 : 16,
                    paddingTop: 3,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: step.accent,
                      margin: "0 0 3px",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      margin: 0,
                      lineHeight: 1.55,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {step.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA nudge ── */}
      <div
        style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.18)",
          borderLeft: "3px solid #6366f1",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#818cf8",
            margin: "0 0 4px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          👆 Ready to start?
        </p>
        <p
          style={{
            fontSize: 11,
            color: T.muted,
            margin: 0,
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Click the first item in the checklist to open the Visa Application
          Form — the built-in wizard will guide you through every field.
        </p>
      </div>
    </div>
  );
}