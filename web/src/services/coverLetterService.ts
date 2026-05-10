/**
 * coverLetterService.ts
 *
 * Pure business logic for the Japan Visa Cover Letter builder.
 * No React, no hooks, no JSX — fully unit-testable.
 *
 * Consumed by: CoverLetterWidget.tsx
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface Contact {
  name: string;
  rel: string;
  phone: string;
  email: string;
}

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
  contacts: Contact[];
}

export interface ApplicantContext {
  applicantName: string;
  passportNo: string;
  travelStartDate: string; // ISO date string e.g. "2025-03-01"
  travelDuration: number;
  cities: string[];
  applicantProfile: string;
  sponsorshipType: string;
}

export interface ValidationErrors {
  [field: string]: string;
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
// Download pre-flight check
// ─────────────────────────────────────────────────────────────

/**
 * Returns a list of human-readable labels for fields that are still empty
 * before the user triggers a download. An empty array means the letter is
 * ready to export.
 */
export function getUnfilledFields(inputs: CoverLetterInputs): string[] {
  const missing: string[] = [];

  if (!inputs.purpose.trim()) missing.push("Purpose of visit detail");
  if (!inputs.hotelName.trim()) missing.push("Hotel / accommodation name");
  if (!inputs.bankBalance.trim()) missing.push("Bank balance amount");

  inputs.contacts.forEach((c, i) => {
    if (!c.name.trim()) missing.push(`Contact ${i + 1} name`);
  });

  return missing;
}

// ─────────────────────────────────────────────────────────────
// Paragraph builders
// ─────────────────────────────────────────────────────────────

export function buildIntroParag(
  inputs: CoverLetterInputs,
  ctx: ApplicantContext
): string {
  const name = ctx.applicantName || "[Name]";
  const passport = ctx.passportNo || "[Passport No]";
  const fromCity = inputs.departureCity || "[Departure City]";
  const start = fmtDate(ctx.travelStartDate);
  const end = fmtDateEnd(ctx.travelStartDate, ctx.travelDuration);
  const duration = ctx.travelDuration;
  const citiesStr = (ctx.cities || []).join(", ") || "[Cities]";

  return (
    `I, ${name} (Passport No: ${passport}), am writing this letter in support of my tourist visa ` +
    `application to Japan. I am a citizen of India and plan to travel from ${fromCity} to Japan for ` +
    `a period of ${duration} days, from ${start} to ${end}. During my stay, I intend to visit ${citiesStr}.`
  );
}

export function buildPurposeParag(inputs: CoverLetterInputs): string {
  const companionLine =
    inputs.travellingWith === "with" && inputs.companion
      ? ` I will be accompanied by my ${inputs.companion} on this trip.`
      : "";
  const purposeDetail =
    inputs.purpose ||
    "[purpose detail — e.g. experience Japanese culture and cuisine, visit historical temples, and explore modern Tokyo]";

  return (
    `The purpose of my visit is purely tourism. I wish to ${purposeDetail}.${companionLine} ` +
    `I have no intention of engaging in any employment or business activities during my stay in Japan, ` +
    `and I shall return to India upon completion of my trip.`
  );
}

export function buildFinanceParag(inputs: CoverLetterInputs): string {
  const balance = inputs.bankBalance || "[₹X,XX,XXX]";
  const hotel = inputs.hotelName || "[Hotel Name]";

  if (isSponsored(inputs.sponsorshipType)) {
    return (
      `All expenses for this trip, including flight tickets, accommodation, and daily expenses, ` +
      `will be borne by my ${inputs.sponsorRel}, ${inputs.sponsorName || "[Sponsor Name]"}. ` +
      `Duly signed and notarised sponsorship documents are enclosed for your reference. ` +
      `I am staying at ${hotel} during my visit.`
    );
  }

  return (
    `I am self-funding this trip. My bank account reflects a balance of ${balance}, which is ` +
    `sufficient to cover all travel, accommodation, and living expenses during my stay. ` +
    `Relevant bank statements are enclosed for your reference. ` +
    `I will be staying at ${hotel} during my visit to Japan.`
  );
}

export function buildImmigrationParag(inputs: CoverLetterInputs): string {
  const hasCountries = inputs.countriesVisited.trim().length > 0;

  if (!hasCountries) {
    return (
      `I have maintained a clean immigration record and have not travelled internationally in the ` +
      `last five years. I have no history of visa refusals or overstays in any country.`
    );
  }

  return (
    `In the last five years, I have travelled to the following countries: ${inputs.countriesVisited}. ` +
    `I have maintained a clean immigration record with no history of visa refusals or overstays.`
  );
}

export function buildTiesParag(inputs: CoverLetterInputs): string {
  const parts: string[] = [];

  if (isEmployed(inputs.applicantProfile)) {
    const role = inputs.designation || "[Designation]";
    const company = inputs.companyName || "[Company Name]";
    parts.push(
      `I am currently employed as ${role} at ${company}. A No Objection Certificate (NOC) from ` +
      `my employer is enclosed confirming my leave approval and intent to return.`
    );
  }

  if (isStudent(inputs.applicantProfile)) {
    const inst = inputs.institutionName || "[Institution Name]";
    parts.push(
      `I am currently enrolled at ${inst}. A No Objection Certificate from my institution is enclosed.`
    );
  }

  const family: string[] = [];
  if (inputs.married === "yes") family.push("spouse");
  if (inputs.parentsInIndia === "yes") family.push("parents");
  if (inputs.hasChildren === "yes") family.push("children");

  if (family.length > 0) {
    parts.push(
      `My ${family.join(", ")} reside in India, which further demonstrates my strong ties to the ` +
      `country and my intention to return upon the completion of my travel.`
    );
  }

  return (
    parts.join(" ") ||
    `I have strong ties to India and intend to return upon completion of my travel.`
  );
}

export function buildSponsorParag(inputs: CoverLetterInputs): string {
  const sName = inputs.sponsorName || "[Sponsor Name]";
  const sRel = inputs.sponsorRel || "[Relationship]";
  const accompanyLine =
    inputs.sponsorAccompanying === "accompanying"
      ? `${sName} will be accompanying me on this trip.`
      : `${sName} will remain in India during my travel.`;

  return (
    `My ${sRel}, ${sName}, is sponsoring this trip. ${accompanyLine} ` +
    `Copies of their passport, bank statements, and sponsorship letter are enclosed.`
  );
}

export function buildContactsParag(inputs: CoverLetterInputs): string {
  const validContacts = inputs.contacts.filter((c) => c.name.trim());
  if (validContacts.length === 0) return "";

  const list = validContacts
    .map(
      (c) =>
        `${c.name} (${c.rel || "Contact"}) — ${c.phone || "—"} / ${c.email || "—"}`
    )
    .join("; ");

  return (
    `In case of any emergency, I can be reached through the following persons in India: ${list}.`
  );
}

// ─────────────────────────────────────────────────────────────
// Full letter assembler
// ─────────────────────────────────────────────────────────────

export function buildLetterBody(
  inputs: CoverLetterInputs,
  ctx: ApplicantContext
): string {
  return [
    buildIntroParag(inputs, ctx),
    buildPurposeParag(inputs),
    buildFinanceParag(inputs),
    buildImmigrationParag(inputs),
    buildTiesParag(inputs),
    isSponsored(inputs.sponsorshipType) ? buildSponsorParag(inputs) : "",
    buildContactsParag(inputs),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Builds the full plain-text version of the letter for .txt download
 * (used as a fallback until the real DOCX skill is wired up).
 */
export function buildPlainText(
  inputs: CoverLetterInputs,
  ctx: ApplicantContext
): string {
  return [
    "Japan Visa Cover Letter",
    today(),
    "",
    "To,",
    "The Visa Officer",
    "Embassy of Japan",
    "New Delhi, India",
    "",
    "Subject: Cover Letter for Tourist Visa Application",
    "",
    buildLetterBody(inputs, ctx),
    "",
    "Yours sincerely,",
    ctx.applicantName,
    `Passport No: ${ctx.passportNo}`,
  ].join("\n");
}