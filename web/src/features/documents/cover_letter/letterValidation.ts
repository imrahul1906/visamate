/**
 * letterValidation.ts
 *
 * Pure business logic for the Japan Visa Cover Letter builder.
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: CoverLetterBuilder, coverLetterInputs, coverLetterPreview
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/** A single country visit entry with structured month/year */
export interface CountryVisit {
  country: string;
  /** Native <input type="month"> value — "YYYY-MM" e.g. "2024-06" */
  month: string;
}

export interface CoverLetterInputs {
  // Travel
  departureCity: string;
  /** Structured list of countries visited in last 5 years */
  countriesVisited: CountryVisit[];
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
  sponsorAccompanying: "accompanying" | "staying" | null;
  sponsorPassport: string;
  sponsorDob: string;

  // Family ties
  married: "yes" | "no";
  parentsInIndia: "yes" | "no";
  hasChildren: "yes" | "no";

  // Letter inline fields
  purpose: string;
  hotelName: string;
  bankBalance: string;

  // Dependant travelling with applicant
  hasDependant: "yes" | "no";
  dependantName: string;
  dependantDob: string;
  dependantPassport: string;
  dependantRelationship: string;

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
  country: string;
  countryName?: string;
  vfsCenter: string;
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

export function isNocNeeded(vfsCenter: string): boolean {
  return !vfsCenter.toLowerCase().includes("delhi");
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
  if (!state.lFinance.trim()) missing.push("Finance / accommodation detail");
  if (!state.lSigName.trim()) missing.push("Applicant name (signature block)");
  if (!state.lSigPassport.trim()) missing.push("Passport number (signature block)");

  return missing;
}