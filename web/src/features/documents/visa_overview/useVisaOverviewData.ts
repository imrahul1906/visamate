// visa-overview/useVisaOverviewData.ts
//
// Custom hook that derives all display-ready data from the raw VisaType JSON.
// Responsibility: data transformation only — no JSX, no side-effects.
//
// This keeps VisaOverviewPanel a thin layout component and makes
// the derivation logic independently testable.

import type { VisaType } from "@/lib/data/types";
import { parseRefundability, toTitleCase } from "./utils";
import type { StatCardProps } from "./primitives";

interface ProcessFlag {
  label: string;
  required: boolean;
}

export interface VisaOverviewData {
  currency: string;
  lastUpdated: string | null;
  // fees
  hasFees: boolean;
  visaFee: number;
  serviceFee: number;
  courierFee: number;
  totalMin: number;
  totalMax: number;
  visaFeeRefundable: boolean | null;
  serviceChargeRefundable: boolean | null;
  // display cards
  stats: StatCardProps[];
  processFlags: ProcessFlag[];
  paymentInstructions: NonNullable<VisaType["process"]>["paymentInstructions"];
}

export function useVisaOverviewData(visaType: VisaType): VisaOverviewData {
  const proc = visaType.process?.default;
  const vfs  = visaType.vfsCharges;

  // ── Currency ─────────────────────────────────────────────────────────────
  const currency = visaType.currency ?? vfs?.serviceCharge?.currency ?? "—";

  // ── Last updated ──────────────────────────────────────────────────────────
  const lastUpdated = visaType.metadata?.lastUpdated
    ? new Date(visaType.metadata.lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // ── Fee totals ────────────────────────────────────────────────────────────
  const hasFees    = visaType.fees != null;
  const visaFee    = visaType.fees ?? 0;
  const serviceFee = vfs?.serviceCharge?.charge ?? 0;
  const courierFee = vfs?.courierCharges?.charge ?? 0;
  const totalMin   = visaFee + serviceFee;
  const totalMax   = totalMin + courierFee;

  // ── Refundability ─────────────────────────────────────────────────────────
  const visaFeeRefundable = parseRefundability(visaType.note);
  const serviceChargeRefundable =
    (vfs?.serviceCharge as { refundable?: boolean } | undefined)?.refundable ??
    parseRefundability(vfs?.serviceCharge?.note);

  // ── Stat cards (2×2 grid, cards omitted when JSON field is absent) ────────
  //   Max Stay · Category
  //   Mode     · Processing
  const stats: StatCardProps[] = [
    ...(visaType.maxStayDays != null
      ? [{ icon: "🗓️", label: "Max Stay",   value: `${visaType.maxStayDays} days`,       colorKey: "indigo"  as const }]
      : []),
    ...(visaType.category
      ? [{ icon: "🏷️", label: "Category",   value: toTitleCase(visaType.category),        colorKey: "violet"  as const }]
      : []),
    ...(proc?.applicationMode
      ? [{ icon: proc.applicationMode === "ONLINE" ? "🌐" : "🏛️",
           label: "Mode",        value: toTitleCase(proc.applicationMode),     colorKey: "emerald" as const }]
      : []),
    ...(visaType.processingTime
      ? [{ icon: "⏱️", label: "Processing", value: visaType.processingTime,               colorKey: "amber"   as const }]
      : []),
  ];

  // ── Process flags (render both true and false values) ─────────────────────
  const processFlags: ProcessFlag[] = [
    ...(proc?.biometricRequired != null
      ? [{ label: "Biometrics", required: proc.biometricRequired }]
      : []),
    ...(proc?.interviewRequired != null
      ? [{ label: "Interview",  required: proc.interviewRequired }]
      : []),
  ];

  // ── Payment instructions ──────────────────────────────────────────────────
  const paymentInstructions = visaType.process?.paymentInstructions ?? [];

  return {
    currency,
    lastUpdated,
    hasFees,
    visaFee,
    serviceFee,
    courierFee,
    totalMin,
    totalMax,
    visaFeeRefundable,
    serviceChargeRefundable,
    stats,
    processFlags,
    paymentInstructions,
  };
}
