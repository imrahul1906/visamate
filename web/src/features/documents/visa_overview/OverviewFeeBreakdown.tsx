// visa-overview/OverviewFeeBreakdown.tsx
//
// Fee display components: FeeRow, TotalRow, and the composed OverviewFeeBreakdown.
// Responsibility: render fee data from JSON — no derivation, no business logic.

import type { VisaType } from "@/lib/data/types";
import { T } from "@/components/shared/theme";
import { PALETTE } from "./overviewPalette";
import { Tag } from "./OverviewPrimitives";
import { InfoIcon } from "./OverviewIcons";
import { fmtCurrency } from "./overviewUtils";

// ── FeeRow ────────────────────────────────────────────────────────────────────

interface FeeRowProps {
  label: string;
  amount: number;
  currency: string;
  /** Refundability derived from JSON data; null = unknown */
  refundable?: boolean | null;
  /** Raw note string from JSON */
  note?: string | null;
  optional?: boolean;
}

export function FeeRow({ label, amount, currency, refundable, note, optional }: FeeRowProps) {
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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

          {optional && <Tag label="Optional" colorKey="blue" />}
          {refundable === true  && <Tag label="Refundable"     colorKey="green" />}
          {refundable === false && <Tag label="Non-refundable" colorKey="red"   />}
        </div>

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

export function TotalRow({ total, currency }: { total: number; currency: string }) {
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

// ── OverviewFeeBreakdown ───────────────────────────────────────────────────────

interface OverviewFeeBreakdownProps {
  visaType: VisaType;
  currency: string;
  hasFees: boolean;
  visaFeeRefundable: boolean | null;
  serviceChargeRefundable: boolean | null;
  totalMin: number;
  totalMax: number;
  courierFee: number;
}

export function OverviewFeeBreakdown({
  visaType,
  currency,
  hasFees,
  visaFeeRefundable,
  serviceChargeRefundable,
  totalMin,
  totalMax,
  courierFee,
}: OverviewFeeBreakdownProps) {
  const vfs = visaType.vfsCharges;

  return (
    <>
      <div
        style={{
          background: PALETTE.ghost.bg,
          border: `1px solid ${PALETTE.ghost.border}`,
          borderRadius: 10,
          padding: "4px 14px 10px",
        }}
      >
        {hasFees && (
          <FeeRow
            label="Visa Fee"
            amount={visaType.fees!}
            currency={currency}
            refundable={visaFeeRefundable}
            note={visaType.note}
          />
        )}

        {vfs?.serviceCharge && (
          <FeeRow
            label="VFS Service Charge"
            amount={vfs.serviceCharge.charge}
            currency={vfs.serviceCharge.currency ?? currency}
            refundable={serviceChargeRefundable}
            note={vfs.serviceCharge.note}
          />
        )}

        {vfs?.courierCharges && (
          <FeeRow
            label="Courier Charges"
            amount={vfs.courierCharges.charge}
            currency={vfs.courierCharges.currency ?? currency}
            optional={vfs.courierCharges.optional}
            note={vfs.courierCharges.note}
          />
        )}

        {hasFees && (
          <TotalRow
            total={courierFee > 0 ? totalMax : totalMin}
            currency={currency}
          />
        )}
      </div>

      {/* Range callout — only when courier is optional and non-zero */}
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
          <span style={{ color: PALETTE.blue.text, flexShrink: 0, marginTop: 1 }}>
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
            <strong style={{ color: T.text }}>{fmtCurrency(totalMin, currency)}</strong>{" "}
            (without courier) to{" "}
            <strong style={{ color: T.text }}>{fmtCurrency(totalMax, currency)}</strong>{" "}
            (with courier delivery).
          </span>
        </div>
      )}
    </>
  );
}
