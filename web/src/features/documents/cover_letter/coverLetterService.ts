/**
 * coverLetterService.ts
 *
 * Pure business logic for the Japan Visa Cover Letter builder.
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: CoverLetterWidget, coverLetterInputs, coverLetterPreview
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface CoverLetterInputs {
  // Travel
  departureCity: string;
  countriesVisited: string;
  travellingWith: "alone" | "with";
  companion: string;

  // Employment / education
  applicantProfile: string; // "employed" | "self-employed" | "student" | ...
  designation: string;
  companyName: string;
  institutionName: string;

  // Sponsorship
  sponsorshipType: string; // "self" | "sponsored"
  sponsorName: string;
  sponsorRel: string;
  sponsorAccompanying: "accompanying" | "staying";

  // Family ties
  married: "yes" | "no";
  parentsInIndia: "yes" | "no";
  hasChildren: "yes" | "no";

  // Letter inline fields
  purpose: string;
  hotelName: string;
  bankBalance: string;

  // Emergency contacts
  contacts: Array<{ name: string; rel: string; phone: string; email: string }>;
}

export interface ApplicantContext {
  applicantName: string;
  passportNo: string;
  travelStartDate: string; // ISO date string e.g. "2025-03-01"
  travelDuration: number;
  cities: string[];
  applicantProfile: string;
  sponsorshipType: string;
  visaType: string;
  visaTypeName: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

/** Fields that must be non-empty before the letter can be downloaded */
export interface LetterPreviewState {
  lPurposeDetail: string;
  lFinance: string;
  lSigName: string;
  lSigPassport: string;
}

// ─────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────

/** Format an ISO date string as "1 March 2025" */
export function fmtDate(iso: string | undefined): string {
  if (!iso) return "[DATE]";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Add (days - 1) to an ISO date string and format the result */
export function fmtDateEnd(iso: string | undefined, days: number): string {
  if (!iso) return "[DATE]";
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days - 1);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Today's date formatted as "10 May 2026" */
export function today(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────
// Profile helpers
// ─────────────────────────────────────────────────────────────

export function isEmployed(profile: string): boolean {
  return profile === "employed" || profile === "self-employed";
}

export function isStudent(profile: string): boolean {
  return profile === "student";
}

export function isSponsored(sponsorshipType: string): boolean {
  return sponsorshipType === "sponsored";
}

// ─────────────────────────────────────────────────────────────
// Step 1 validation
// ─────────────────────────────────────────────────────────────

export function validateCoverLetterInputs(
  inputs: CoverLetterInputs
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!inputs.departureCity.trim()) {
    errors.departureCity = "Required";
  }
  if (inputs.travellingWith === "with" && !inputs.companion) {
    errors.companion = "Select relationship";
  }
  if (isEmployed(inputs.applicantProfile) && !inputs.designation.trim()) {
    errors.designation = "Required";
  }
  if (isEmployed(inputs.applicantProfile) && !inputs.companyName.trim()) {
    errors.companyName = "Required";
  }
  if (isStudent(inputs.applicantProfile) && !inputs.institutionName.trim()) {
    errors.institutionName = "Required";
  }
  if (isSponsored(inputs.sponsorshipType) && !inputs.sponsorName.trim()) {
    errors.sponsorName = "Required";
  }
  if (isSponsored(inputs.sponsorshipType) && !inputs.sponsorRel.trim()) {
    errors.sponsorRel = "Required";
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────
// Step 2 (preview) validation
// ─────────────────────────────────────────────────────────────

/**
 * Returns the human-readable labels of any fields that must be
 * filled before the letter can be downloaded.
 * Returns an empty array when everything is ready.
 */
export function validateLetterPreview(state: LetterPreviewState): string[] {
  const missing: string[] = [];

  if (!state.lPurposeDetail.trim()) missing.push("Purpose of visit detail");
  if (!state.lFinance.trim())       missing.push("Finance / accommodation detail");
  if (!state.lSigName.trim())       missing.push("Applicant name (signature block)");
  if (!state.lSigPassport.trim())   missing.push("Passport number (signature block)");

  return missing;
}