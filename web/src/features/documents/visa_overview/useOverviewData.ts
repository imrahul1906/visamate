// visa-overview/useOverviewData.ts
//
// Custom hook that derives all display-ready data from the raw VisaType JSON.
// Responsibility: data transformation only — no JSX, no side-effects.
//
// selectedLocationCode: the VFS centre the user has selected (e.g. "GURUGRAM").
// Payment instructions are filtered to only those whose vfsCenterCode
// matches the selected centre. If no centre is selected, none are shown —
// they are centre-specific rules and showing them unconditionally is misleading.

import { APPLICATION_MODE, APPOINTMENT_POLICY } from "@/lib/data/types";
import type { VisaType, PaymentInstruction, RequirementsData } from "@/lib/data/types";
import { parseRefundability, toTitleCase } from "./overviewUtils";
import type { StatCardProps } from "./OverviewPrimitives";

interface ProcessFlag {
  label: string;
  required: boolean;
  status?: "required" | "optional" | "not_required" | "walk_in";
}

export interface OverviewData {
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
  // Only instructions whose vfsCenterCode matches selectedLocationCode.
  // Empty when no centre is selected or no instructions match.
  paymentInstructions: PaymentInstruction[];
}

export function useOverviewData(
  visaType: VisaType,
  /** Uppercase VFS centre code, e.g. "GURUGRAM". Pass null/undefined when no centre is selected. */
  selectedLocationCode?: string | null,
  /** Per-centre requirements data — processingDays is read from here when available. */
  requirementsData?: RequirementsData | null,
): OverviewData {
  let proc = visaType.process?.default;

  if (selectedLocationCode && visaType.process?.centerOverrides) {
    const override = visaType.process.centerOverrides.find(
      (cov) => cov.vfsCenterCode.trim().toUpperCase() === selectedLocationCode.trim().toUpperCase()
    );
    if (override) {
      proc = {
        ...proc,
        ...override,
      };
    }
  }

  const vfs  = visaType.vfsCharges;

  // ── Currency ─────────────────────────────────────────────────────────────
  const currency =
    visaType.currency ??
    vfs?.serviceCharge?.currency ??
    "—";

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
  // For the visa fee: check the note string (JSON has no explicit refundable field on root fee).
  const visaFeeRefundable = parseRefundability(visaType.note);

  // For the service charge: prefer the explicit `refundable` boolean if present,
  // otherwise fall back to parsing the note string.
  const serviceChargeRefundable =
    vfs?.serviceCharge?.refundable ??
    parseRefundability(vfs?.serviceCharge?.note);

  // ── Processing time — prefer per-centre requirementsData, fall back to visaType ──
  const processingTime: string | null =
    requirementsData?.processingDays != null
      ? String(requirementsData.processingDays)
      : visaType.processingTime ?? null;

  const expressTime: string | null =
    requirementsData?.processingDaysExpress != null
      ? String(requirementsData.processingDaysExpress)
      : null;

  // ── Stat cards (2×2 grid, cards omitted when JSON field is absent) ────────
  const stats: StatCardProps[] = [
    ...(visaType.maxStayDays != null
      ? [{ icon: "🗓️", label: "Max Stay",   value: `${visaType.maxStayDays} days`,     colorKey: "indigo"  as const }]
      : []),
    ...(visaType.category
      ? [{ icon: "🏷️", label: "Category",   value: toTitleCase(visaType.category),      colorKey: "violet"  as const }]
      : []),
    ...(proc?.applicationMode
      ? [{ icon: proc.applicationMode === APPLICATION_MODE.ONLINE ? "🌐" : "🏛️",
           label: "Mode",        value: toTitleCase(proc.applicationMode),   colorKey: "emerald" as const }]
      : []),
    ...(processingTime
      ? [{
          icon: "⏱️",
          label: "Processing",
          value: processingTime,
          colorKey: "amber" as const,
          ...(expressTime ? { subValue: expressTime, subLabel: "Express" } : {}),
        }]
      : []),
  ];

  // ── Process flags ─────────────────────────────────────────────────────────
  const processFlags: ProcessFlag[] = [
    {
      label: proc?.applicationMode === APPLICATION_MODE.ONLINE ? "Application Submission" : "VFS Submission",
      required: proc?.applicationMode === APPLICATION_MODE.OFFLINE,
      status: proc?.applicationMode === APPLICATION_MODE.OFFLINE ? ("required" as const) : ("not_required" as const),
    },
    {
      label: proc?.biometricNote ? `Biometrics (${proc.biometricNote})` : "Biometrics",
      required: !!proc?.biometricRequired,
      status: proc?.biometricRequired ? ("required" as const) : ("not_required" as const),
    },
    {
      label: "Interview",
      required: !!proc?.interviewRequired,
      status: proc?.interviewRequired ? ("required" as const) : ("not_required" as const),
    },
    {
      label: proc?.applicationMode === APPLICATION_MODE.ONLINE ? "Appointment" : "VFS Appointment",
      required: proc?.appointmentPolicy === APPOINTMENT_POLICY.REQUIRED || (proc?.appointmentPolicy == null && proc?.applicationMode === APPLICATION_MODE.OFFLINE),
      status:
        proc?.appointmentPolicy === APPOINTMENT_POLICY.REQUIRED
          ? ("required" as const)
          : proc?.appointmentPolicy === APPOINTMENT_POLICY.WALK_IN_ALLOWED || proc?.appointmentPolicy === APPOINTMENT_POLICY.WALK_IN_ONLY
          ? ("walk_in" as const)
          : proc?.appointmentPolicy === APPOINTMENT_POLICY.NO_APPOINTMENT || proc?.appointmentPolicy === APPOINTMENT_POLICY.NOT_REQUIRED || proc?.applicationMode === APPLICATION_MODE.ONLINE
          ? ("not_required" as const)
          : proc?.applicationMode === APPLICATION_MODE.OFFLINE
          ? ("required" as const)
          : ("not_required" as const),
    },
  ];

  // ── Payment instructions — centre-gated ───────────────────────────────────
  // Rules in paymentInstructions are NOT universal: they only apply at specific
  // VFS drop-off offices. We filter to the selected centre so the panel never
  // shows irrelevant payment rules to someone using a different office.
  //
  // Matching is case-insensitive and trims whitespace for safety.
  const normalise = (s: string) => s.trim().toUpperCase();

  const paymentInstructions: PaymentInstruction[] =
    selectedLocationCode
      ? (visaType.process?.paymentInstructions ?? []).filter(
          (instr) => normalise(instr.vfsCenterCode) === normalise(selectedLocationCode),
        )
      : [];

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