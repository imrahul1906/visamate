// visa-overview/index.ts
//
// Public surface of the visa-overview module.
// Import from here rather than individual files.

export { default as VisaOverviewPanel } from "./VisaOverviewPanel";

// Re-export sub-components if needed by other features
export { OverviewEmptyState }                      from "./OverviewEmptyState";
export { OverviewRequirementBadge }                from "./OverviewRequirementBadge";
export { OverviewPaymentCard }                     from "./OverviewPaymentCard";
export { OverviewFeeBreakdown }                    from "./OverviewFeeBreakdown";
export { StatCard, Tag, SectionLabel }             from "./OverviewPrimitives";
export { CheckIcon, CrossIcon, InfoIcon, AlertIcon } from "./OverviewIcons";

// Utilities and data
export { useOverviewData }                         from "./useOverviewData";
export { fmtCurrency, parseRefundability, toTitleCase, toProperCase } from "./overviewUtils";
export { PALETTE }                                 from "./overviewPalette";
export type { PaletteKey }                         from "./overviewPalette";
export type { StatCardProps }                      from "./OverviewPrimitives";
export type { OverviewData }                       from "./useOverviewData";
