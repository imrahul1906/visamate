// visa-overview/PaymentInstructionCard.tsx
//
// Renders a single centre-specific payment instruction block.
// Displays: payment mode, payable-to, drop-off offices, draft rules, and notes.
//
// Note: `instruction.vfsCenterCode` is used for filtering upstream (in
// useVisaOverviewData) — it is NOT displayed here since the card is already
// shown only when the centre matches. `dropOffOffices` is displayed so the
// user knows exactly which offices within their centre have this exception.

import type { PaymentInstruction } from "@/lib/data/types";
import { T } from "@/components/shared/theme";
import { PALETTE } from "./palette";
import { Tag } from "./primitives";
import { AlertIcon } from "./icons";
import { fmtCurrency, toTitleCase, toProperCase } from "./utils";

interface PaymentInstructionCardProps {
  instruction: PaymentInstruction;
  fallbackCurrency: string;
}

export function PaymentInstructionCard({
  instruction,
  fallbackCurrency,
}: PaymentInstructionCardProps) {
  const dropOffOffices = instruction.dropOffOffices ?? [];
  const rules          = instruction.rules ?? [];
  const notes          = instruction.notes ?? [];
  const modeLabel      = instruction.paymentMode ? toTitleCase(instruction.paymentMode) : "—";

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
          <span style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Payable to:{" "}
            <strong style={{ color: T.text }}>{instruction.payableTo}</strong>
          </span>
        )}
      </div>

      {/* ── Drop-off offices ── */}
      {dropOffOffices.length > 0 && (
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
            Applicable drop-off offices
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {dropOffOffices.map((office) => (
              <span
                key={office}
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
                {toProperCase(office)}
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
            borderBottom: notes.length > 0 ? "1px solid rgba(99,102,241,0.08)" : undefined,
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
            {rules.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                      <span style={{ color: T.muted, fontWeight: 400 }}> (optional)</span>
                    )}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {rule.refundable === false && <Tag label="Non-refundable" colorKey="red"   />}
                  {rule.refundable === true  && <Tag label="Refundable"     colorKey="green" />}

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
                      {fmtCurrency(rule.amount, rule.currency ?? fallbackCurrency)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {notes.length > 0 && (
        <div style={{ padding: "8px 14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {notes.map((note, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ color: PALETTE.yellow.text, marginTop: 1, flexShrink: 0 }}>
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
