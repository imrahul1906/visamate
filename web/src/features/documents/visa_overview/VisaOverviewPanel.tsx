"use client";

// visa-overview/VisaOverviewPanel.tsx
//
// Shown in the RIGHT panel whenever activeDocId === null.
//
// Props change from previous version:
//   + selectedLocationCode — the VFS centre the user has chosen (e.g. "GURUGRAM").
//     Payment instructions are centre-specific; passing this lets the hook filter
//     them correctly. Pass null / undefined when no centre is selected yet.

import type { VisaType, RequirementsData } from "@/lib/data/types";
import { T } from "@/lib/theme";

import { PALETTE } from "./overviewPalette";
import { SectionLabel, StatCard } from "./OverviewPrimitives";
import { OverviewFeeBreakdown } from "./OverviewFeeBreakdown";
import { OverviewRequirementBadge } from "./OverviewRequirementBadge";
import { OverviewPaymentCard } from "./OverviewPaymentCard";
import { OverviewEmptyState } from "./OverviewEmptyState";
import { AlertIcon } from "./OverviewIcons";
import { useOverviewData } from "./useOverviewData";

// ─── Props ────────────────────────────────────────────────────────────────────

interface VisaOverviewPanelProps {
  visaType: VisaType | null;
  countryName: string;
  visaTypeName: string;
  /**
   * Uppercase VFS centre code for the currently selected location,
   * e.g. "GURUGRAM", "DELHI", "MUMBAI".
   * Pass null / undefined when no centre is selected.
   * Controls which (if any) centre-specific payment instructions are shown.
   */
  selectedLocationCode?: string | null;
  /**
   * Per-centre requirements data. processingDays is read from here
   * when available, falling back to visaType.processingTime.
   */
  requirementsData?: RequirementsData | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisaOverviewPanel({
  visaType,
  countryName,
  visaTypeName,
  selectedLocationCode,
  requirementsData,
}: VisaOverviewPanelProps) {
  const {
    currency,
    lastUpdated,
    hasFees,
    courierFee,
    totalMin,
    totalMax,
    visaFeeRefundable,
    serviceChargeRefundable,
    stats,
    processFlags,
    paymentInstructions,
  } = useOverviewData(visaType ?? ({} as VisaType), selectedLocationCode, requirementsData);

  if (!visaType) return <OverviewEmptyState />;

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
          A complete overview of fees, charges, and payment requirements for your application.
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

      {/* ── Key stats ── */}
      {stats.length > 0 && (
        <div>
          <SectionLabel>At a glance</SectionLabel>
          <div
            style={{
              display: "grid",
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

      {/* ── Process flags ── */}
      {processFlags.length > 0 && (
        <div>
          <SectionLabel>Requirements</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {processFlags.map((flag) => (
              <OverviewRequirementBadge key={flag.label} label={flag.label} required={flag.required} />
            ))}
          </div>
        </div>
      )}

      {/* ── Fee Breakdown ── */}
      {(hasFees || visaType.vfsCharges?.serviceCharge || visaType.vfsCharges?.courierCharges) && (
        <div>
          <SectionLabel>Fee breakdown</SectionLabel>
          <OverviewFeeBreakdown
            visaType={visaType}
            currency={currency}
            hasFees={hasFees}
            visaFeeRefundable={visaFeeRefundable}
            serviceChargeRefundable={serviceChargeRefundable}
            totalMin={totalMin}
            totalMax={totalMax}
            courierFee={courierFee}
          />
        </div>
      )}

      {/* ── Payment Instructions ── */}
      {/* Only rendered when the selected centre has matching instructions */}
      {paymentInstructions.length > 0 && (() => {
        const allDropOffs = paymentInstructions.flatMap(i => i.dropOffOffices ?? []);
        return (
        <div>
          <SectionLabel>Centre-specific exceptions</SectionLabel>

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
            <span style={{ color: PALETTE.yellow.text, flexShrink: 0, marginTop: 1 }}>
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
                Special payment rules apply at your selected centre
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
                The following instructions apply to the{" "}
                <strong style={{ color: T.text }}>{selectedLocationCode?.toUpperCase()}</strong> VFS centre
                {allDropOffs.length > 0 && (
                  <>
                    {" "}and its drop-off offices:{" "}
                    <strong style={{ color: T.text }}>
                      {allDropOffs.map(o => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase()).join(" · ")}
                    </strong>
                  </>
                )}
                . If you change your office, these rules may not apply.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paymentInstructions.map((instr, i) => (
              <OverviewPaymentCard
                key={i}
                instruction={instr}
                fallbackCurrency={currency}
              />
            ))}
          </div>
        </div>
        );
      })()}

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
          Click the first item in the checklist to open the Visa Application Form — the
          built-in wizard will guide you through every field.
        </p>
      </div>
    </div>
  );
}