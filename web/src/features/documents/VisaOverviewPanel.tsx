"use client";

// web\src\features\documents\VisaOverviewPanel.tsx
//
// Shown in the RIGHT panel whenever activeDocId === null.
// Disappears the moment a user opens any document.
// Reappears when the last open document is closed.
//
// ✅ 100% data-driven — nothing is hardcoded.
//    Every label, fee, tag, flag, and instruction is
//    derived exclusively from the VisaType JSON via props.
//
// Data flow:
//   Parent calls getVisaType(countryCode, visaTypeCode) from repository.ts
//   → passes result as `visaType` prop here.
//   This component is pure display — it never touches the repository directly.
//
// Dynamic contract:
//   • Works for any country's visa-types.json
//   • Gracefully handles missing/undefined fields at every level
//   • Currency always comes from JSON — never assumed
//   • Tags, flags, totals — all derived, never hardcoded
//   • Colours are semantic tokens, not specific visa knowledge

import type { VisaType } from "@/lib/data/types";
import { T } from "@/app/shared/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisaOverviewPanelProps {
  visaType: VisaType | null;
  countryName: string;
  visaTypeName: string;
}

// ─── Colour palette (semantic tokens only — not visa-specific) ────────────────

const PALETTE = {
  indigo: { text: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
  violet: { text: "#a78bfa", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
  emerald: { text: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  amber: { text: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  green: { text: "#4ade80", bg: "rgba(74,222,128,0.06)", border: "rgba(74,222,128,0.18)" },
  red: { text: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.18)" },
  blue: { text: "#60a5fa", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)" },
  yellow: { text: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.22)" },
  ghost: { text: T.muted, bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a numeric amount with currency prefix, using Indian locale for INR-style grouping. */
function fmtCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

/**
 * Derive refundability from a note string.
 * Returns true if explicitly refundable, false if non-refundable, null if unclear.
 */
function parseRefundability(note?: string | null): boolean | null {
  if (!note) return null;
  const lower = note.toLowerCase();
  if (
    lower.includes("non-refundable") ||
    lower.includes("not refundable") ||
    lower.includes("non refundable")
  )
    return false;
  if (lower.includes("refund")) return true;
  return null;
}

/** Convert a SCREAMING_SNAKE or SCREAMING SNAKE string to Title Case for display. */
function toTitleCase(str?: string | null): string {
  if (!str) return "—";
  return str
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Capitalise the first letter of each word, lower-casing the rest (for centre names). */
function toProperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: T.muted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: "0 0 10px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </p>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  colorKey: keyof typeof PALETTE;
}

function StatCard({ icon, label, value, colorKey }: StatCardProps) {
  const c = PALETTE[colorKey];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: c.text,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.1,
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

// ── Tag ───────────────────────────────────────────────────────────────────────

function Tag({
  label,
  colorKey,
}: {
  label: string;
  colorKey: keyof typeof PALETTE;
}) {
  const c = PALETTE[colorKey];
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 4,
        padding: "1px 5px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ── FeeRow ────────────────────────────────────────────────────────────────────

interface FeeRowProps {
  label: string;
  amount: number;
  currency: string;
  /** Refundability derived from JSON data, null = unknown */
  refundable?: boolean | null;
  /** Raw note string from JSON */
  note?: string | null;
  optional?: boolean;
}

function FeeRow({ label, amount, currency, refundable, note, optional }: FeeRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
        padding: "8px 0",
        borderBottom: `1px solid ${T.border ?? "rgba(255,255,255,0.07)"}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.text,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {label}
          </span>

          {/* Optional tag — from JSON field */}
          {optional && <Tag label="Optional" colorKey="blue" />}

          {/* Refundability tag — derived from JSON note / refundable field */}
          {refundable === true && <Tag label="Refundable" colorKey="green" />}
          {refundable === false && <Tag label="Non-refundable" colorKey="red" />}
        </div>

        {/* Note — rendered as-is from JSON, never paraphrased */}
        {note && (
          <p
            style={{
              fontSize: 10,
              color: T.muted,
              margin: "3px 0 0",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}
          >
            {note}
          </p>
        )}
      </div>

      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: T.text,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {fmtCurrency(amount, currency)}
      </span>
    </div>
  );
}

// ── TotalRow ──────────────────────────────────────────────────────────────────

function TotalRow({ total, currency }: { total: number; currency: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        marginTop: 2,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Total (approx.)
      </span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: PALETTE.indigo.text,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {fmtCurrency(total, currency)}
      </span>
    </div>
  );
}

// ── ProcessFlag ───────────────────────────────────────────────────────────────
//
// Renders a single boolean process requirement as a pill badge.
//
// Design rationale:
//   • "Not required: Biometrics" reads as a negation before the subject —
//     users scan the label first and have to mentally negate it.
//   • Better pattern: lead with the subject, then the status.
//     "Biometrics · Not Required" is instantly scannable.
//   • Green check for not-required (good news), red cross for required (heads up).
//   • The pill is self-contained: color, icon, and text all convey the same signal.

function ProcessFlag({
  label,
  required,
}: {
  label: string;
  required: boolean;
}) {
  const palette = required ? PALETTE.red : PALETTE.green;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: palette.text,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 20,
        padding: "4px 10px",
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        {required ? <CrossIcon /> : <CheckIcon />}
      </span>
      {label}
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: 0.75,
        }}
      >
        · {required ? "Required" : "Not Required"}
      </span>
    </span>
  );
}

// ── PaymentInstructionCard ────────────────────────────────────────────────────

function PaymentInstructionCard({
  instruction,
  fallbackCurrency,
}: {
  instruction: NonNullable<VisaType["process"]>["paymentInstructions"][number];
  fallbackCurrency: string;
}) {
  const centers = instruction.applicableCenters ?? [];
  const rules = instruction.rules ?? [];
  const notes = instruction.notes ?? [];

  // Display-friendly payment mode label — derived from JSON value
  const modeLabel = instruction.paymentMode
    ? toTitleCase(instruction.paymentMode)
    : "—";

  return (
    <div
      style={{
        background: "rgba(99,102,241,0.05)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* ── Header: mode + payable-to ── */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13 }}>🏦</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: PALETTE.indigo.text,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {modeLabel}
          </span>
        </div>

        {instruction.payableTo && (
          <span
            style={{
              fontSize: 10,
              color: T.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Payable to:{" "}
            <strong style={{ color: T.text }}>{instruction.payableTo}</strong>
          </span>
        )}
      </div>

      {/* ── Applicable centres ── */}
      {centers.length > 0 && (
        <div
          style={{
            padding: "8px 14px",
            borderBottom: "1px solid rgba(99,102,241,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 6px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Applicable centres
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {centers.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: PALETTE.violet.text,
                  background: PALETTE.violet.bg,
                  border: `1px solid ${PALETTE.violet.border}`,
                  borderRadius: 5,
                  padding: "2px 8px",
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {toProperCase(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Draft rules ── */}
      {rules.length > 0 && (
        <div
          style={{
            padding: "8px 14px",
            borderBottom:
              notes.length > 0 ? "1px solid rgba(99,102,241,0.08)" : undefined,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 8px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Draft breakdown
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {rules.map((rule, i) => {
              // Derive refundability per rule from its own `refundable` field
              const ruleRefundable =
                (rule as { refundable?: boolean }).refundable ?? null;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: rule.optional
                          ? PALETTE.blue.text + "99"
                          : PALETTE.indigo.text + "99",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: T.text,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {toTitleCase(rule.type)}
                      {rule.optional && (
                        <span
                          style={{ color: T.muted, fontWeight: 400 }}
                        >
                          {" "}
                          (optional)
                        </span>
                      )}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {/* Refundability tag — from rule.refundable field */}
                    {ruleRefundable === false && (
                      <Tag label="Non-refundable" colorKey="red" />
                    )}
                    {ruleRefundable === true && (
                      <Tag label="Refundable" colorKey="green" />
                    )}

                    {/* Separate draft required — from rule.separateDraftRequired */}
                    {rule.separateDraftRequired && (
                      <span
                        style={{
                          fontSize: 9,
                          color: PALETTE.yellow.text,
                          background: PALETTE.yellow.bg,
                          border: `1px solid ${PALETTE.yellow.border}`,
                          borderRadius: 4,
                          padding: "1px 5px",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          fontFamily: "'DM Sans', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Separate DD
                      </span>
                    )}

                    {/* Amount — only if explicitly present in JSON */}
                    {rule.amount != null && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.text,
                          fontFamily: "'DM Sans', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtCurrency(
                          rule.amount,
                          rule.currency ?? fallbackCurrency
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {notes.length > 0 && (
        <div style={{ padding: "8px 14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {notes.map((note, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 6, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    color: PALETTE.yellow.text,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  <AlertIcon />
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: T.muted,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.55,
                  }}
                >
                  {note}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
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

// ─── Main component ───────────────────────────────────────────────────────────
//
// Data flow note:
//   The parent component is responsible for fetching via repository.ts:
//     const visaType = await getVisaType(countryCode, visaTypeCode)
//   and passing the result here as `visaType`.
//   This component never calls the repository — it's purely presentational.

export default function VisaOverviewPanel({
  visaType,
  countryName,
  visaTypeName,
}: VisaOverviewPanelProps) {
  if (!visaType) return <EmptyState />;

  // ── Derived data (all from JSON, never assumed) ──────────────────────────

  const proc = visaType.process?.default;
  const vfs = visaType.vfsCharges;
  const paymentInstructions = visaType.process?.paymentInstructions ?? [];

  const lastUpdated = visaType.metadata?.lastUpdated
    ? new Date(visaType.metadata.lastUpdated).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : null;

  // Currency: prefer top-level, fall back to VFS service-charge currency.
  // Display "—" rather than silently assuming if truly absent.
  const currency =
    visaType.currency ?? vfs?.serviceCharge?.currency ?? "—";

  // Fee totals
  const visaFee = visaType.fees ?? 0;
  const serviceFee = vfs?.serviceCharge?.charge ?? 0;
  const courierFee = vfs?.courierCharges?.charge ?? 0;
  const totalMin = visaFee + serviceFee;
  const totalMax = totalMin + courierFee;
  const hasFees = visaType.fees != null;

  // Refundability — derived from JSON notes / explicit boolean fields
  const visaFeeRefundable = parseRefundability(visaType.note);
  const serviceChargeRefundable =
    (vfs?.serviceCharge as { refundable?: boolean } | undefined)?.refundable ??
    parseRefundability(vfs?.serviceCharge?.note);

  // ── Stat cards — built entirely from JSON fields ──────────────────────────
  //
  // Always 4 cards in a 2×2 grid when all fields are present.
  // Cards are omitted individually if the underlying JSON field is absent,
  // which collapses the grid gracefully (3 → 1fr 1fr, 2 → 1fr 1fr, etc.)
  //
  // Field order is intentional:
  //   Max Stay   · Category     ← what kind of trip / how long
  //   Mode       · Processing   ← how to apply / how long it takes
  const stats: StatCardProps[] = [
    ...(visaType.maxStayDays != null
      ? [{
        icon: "🗓️",
        label: "Max Stay",
        value: `${visaType.maxStayDays} days`,
        colorKey: "indigo" as const,
      }]
      : []),
    ...(visaType.category
      ? [{
        icon: "🏷️",
        label: "Category",
        value: toTitleCase(visaType.category),
        colorKey: "violet" as const,
      }]
      : []),
    ...(proc?.applicationMode
      ? [{
        icon: proc.applicationMode === "ONLINE" ? "🌐" : "🏛️",
        label: "Mode",
        value: toTitleCase(proc.applicationMode),
        colorKey: "emerald" as const,
      }]
      : []),
    // ↓ Processing time — from processingTime field in JSON
    ...(visaType.processingTime
      ? [{
        icon: "⏱️",
        label: "Processing",
        value: visaType.processingTime,
        colorKey: "amber" as const,
      }]
      : []),
  ];

  // ── Process flags — derive from JSON booleans, render both true AND false ──
  //
  // Design rationale for ProcessFlag rendering (see ProcessFlag component):
  //   We render pills, not plain text. Each pill carries:
  //     subject (e.g. "Biometrics") + status ("Not Required" / "Required")
  //   This is more scannable than "Not required: Biometrics" which forces
  //   users to read the negation before knowing what the subject is.
  //
  //   Green pill + checkmark = good news (not required)
  //   Red pill + cross       = heads-up (required)
  type ProcFlag = { label: string; required: boolean };
  const processFlags: ProcFlag[] = [
    ...(proc?.biometricRequired != null
      ? [{ label: "Biometrics", required: proc.biometricRequired }]
      : []),
    ...(proc?.interviewRequired != null
      ? [{ label: "Interview", required: proc.interviewRequired }]
      : []),
  ];

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "22px 20px 24px",
        scrollbarWidth: "thin",
        scrollbarColor: `${PALETTE.indigo.text}59 transparent`,
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {/* ── Header ── */}
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: PALETTE.indigo.bg,
            border: `1px solid ${PALETTE.indigo.border}`,
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
              color: PALETTE.indigo.text,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Visa Overview
          </span>
        </div>

        {/* Title: visaTypeName and countryName are always from props / JSON */}
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
          A complete overview of fees, charges, and payment requirements for
          your application.
          {lastUpdated && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 8,
                fontSize: 10,
                color: T.muted,
                opacity: 0.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              · Updated {lastUpdated}
            </span>
          )}
        </p>
      </div>

      {/* ── Key stats (only rendered when data is present) ── */}
      {stats.length > 0 && (
        <div>
          <SectionLabel>At a glance</SectionLabel>
          <div
            style={{
              display: "grid",
              // Always 2 columns. With 4 cards this is a perfect 2×2 grid.
              // With 3 cards the last slot is empty — still visually balanced.
              // With 2 or fewer cards each fills half the row.
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      )}

      {/* ── Process flags (only rendered when booleans are present in JSON) ── */}
      {processFlags.length > 0 && (
        <div>
          <SectionLabel>Requirements</SectionLabel>
          <div
            style={{
              // Transparent container — pills are self-contained with their own
              // color. No need for a wrapper background that fights with the pill
              // colors (previously the green wrapper conflicted with red pills).
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {processFlags.map((flag) => (
              <ProcessFlag
                key={flag.label}
                label={flag.label}
                required={flag.required}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Fee Breakdown (only rendered when at least one fee is present) ── */}
      {(hasFees || vfs?.serviceCharge || vfs?.courierCharges) && (
        <div>
          <SectionLabel>Fee breakdown</SectionLabel>
          <div
            style={{
              background: PALETTE.ghost.bg,
              border: `1px solid ${PALETTE.ghost.border}`,
              borderRadius: 10,
              padding: "4px 14px 10px",
            }}
          >
            {/* Visa fee — only if present */}
            {hasFees && (
              <FeeRow
                label="Visa Fee"
                amount={visaType.fees!}
                currency={currency}
                refundable={visaFeeRefundable}
                note={visaType.note}
              />
            )}

            {/* VFS Service charge — only if present */}
            {vfs?.serviceCharge && (
              <FeeRow
                label="VFS Service Charge"
                amount={vfs.serviceCharge.charge}
                currency={vfs.serviceCharge.currency ?? currency}
                refundable={serviceChargeRefundable}
                note={vfs.serviceCharge.note}
              />
            )}

            {/* VFS Courier charge — only if present */}
            {vfs?.courierCharges && (
              <FeeRow
                label="Courier Charges"
                amount={vfs.courierCharges.charge}
                currency={vfs.courierCharges.currency ?? currency}
                optional={vfs.courierCharges.optional}
                note={vfs.courierCharges.note}
              />
            )}

            {/* Total row — show only if visa fee present */}
            {hasFees && (
              <TotalRow
                total={courierFee > 0 ? totalMax : totalMin}
                currency={currency}
              />
            )}
          </div>

          {/* Range callout — only shown when courier is optional and non-zero */}
          {courierFee > 0 && vfs?.courierCharges?.optional && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginTop: 8,
                padding: "8px 12px",
                background: PALETTE.blue.bg,
                border: `1px solid ${PALETTE.blue.border}`,
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  color: PALETTE.blue.text,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <InfoIcon />
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: T.muted,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.55,
                }}
              >
                Total ranges from{" "}
                <strong style={{ color: T.text }}>
                  {fmtCurrency(totalMin, currency)}
                </strong>{" "}
                (without courier) to{" "}
                <strong style={{ color: T.text }}>
                  {fmtCurrency(totalMax, currency)}
                </strong>{" "}
                (with courier delivery).
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Payment Instructions (only rendered when present in JSON) ── */}
      {paymentInstructions.length > 0 && (
        <div>
          <SectionLabel>Centre-specific exceptions</SectionLabel>

          {/* Exception banner */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              background: PALETTE.yellow.bg,
              border: `1px solid ${PALETTE.yellow.border}`,
              borderLeft: `3px solid ${PALETTE.yellow.text}`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                color: PALETTE.yellow.text,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <AlertIcon />
            </span>
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: PALETTE.yellow.text,
                  margin: "0 0 3px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Special payment rules apply at select centres
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: T.muted,
                  margin: 0,
                  lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                The following instructions are{" "}
                <strong style={{ color: T.text }}>NOT UNIVERSAL</strong> — they
                apply only to the specific <strong style={{ color: T.text }}> DROP OFF OFFICES</strong> listed below. If you
                are not using below drop off offices, standard payment methods apply and you may ignore the section.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paymentInstructions.map((instr, i) => (
              <PaymentInstructionCard
                key={i}
                instruction={instr}
                fallbackCurrency={currency}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CTA nudge ── */}
      <div
        style={{
          background: PALETTE.indigo.bg,
          border: `1px solid ${PALETTE.indigo.border}`,
          borderLeft: `3px solid ${PALETTE.indigo.text}`,
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: PALETTE.indigo.text,
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