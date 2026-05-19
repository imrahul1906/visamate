/**
 * sponsorConsentService.ts
 *
 * Core types, helpers, and seed logic for the Sponsor Consent Letter builder.
 * Mirrors the architecture of coverLetterService.ts — pure data, no React.
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SponsorConsentInputs {
  // Sponsor details (the person writing the letter)
  sponsorName: string;
  sponsorCity: string;
  sponsorPassport: string;
  sponsorDob: string; // "YYYY-MM-DD"
  sponsorMobile: string;
  sponsorAddress: string;
  sponsorRelationship: string; // "brother", "father", etc.

  // Applicant details (the person being sponsored)
  applicantName: string;
  applicantPassport: string;
  applicantDob: string; // "YYYY-MM-DD"

  // Trip details
  destination: string; // "Japan", "France", etc.
  travelStartDate: string; // "YYYY-MM-DD"
  travelEndDate: string; // "YYYY-MM-DD"
  travelDuration: string; // "14" (days)
  purposeOfVisit: string; // "explore tourist spots"
  sponsorAccompanying: "accompanying" | "not_accompanying";
  sponsorshipReason: string; // reason sponsor is bearing costs
}

export interface SponsorConsentContext {
  applicantName: string;
  sponsorName: string;
  destination: string;
  visaOfficerAddress?: string; // e.g. "Embassy of Japan, Delhi, India"
}

// ─────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────

export function today(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fmtDate(dateStr: string): string {
  if (!dateStr) return "[Date]";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function fmtDob(dateStr: string): string {
  if (!dateStr) return "[DOB]";
  return fmtDate(dateStr);
}

// ─────────────────────────────────────────────────────────────
// Hint helper — amber editorial callouts stripped before .docx
// ─────────────────────────────────────────────────────────────

export const hint = (msg: string) => `[[HINT: ${msg}]]`;

export function stripHints(text: string): string {
  return text.replace(/\[\[HINT:[^\]]*\]\]/g, "").replace(/\s{2,}/g, " ").trim();
}

// ─────────────────────────────────────────────────────────────
// Visa Officer address map
// ─────────────────────────────────────────────────────────────

const VISA_OFFICER_ADDRESSES: Record<string, string> = {
  Japan:
    "The Visa Officer,\nEmbassy of Japan,\nDelhi,\nIndia",
  France:
    "The Visa Officer,\nEmbassy of France,\nDelhi,\nIndia",
  UK:
    "The Visa Officer,\nUK Visa and Immigration,\nDelhi,\nIndia",
  Schengen:
    "The Visa Officer,\nVFS Global – Schengen Visa Application Centre,\nDelhi,\nIndia",
};

export function getVisaOfficerAddress(destination: string): string {
  return (
    VISA_OFFICER_ADDRESSES[destination] ??
    `The Visa Officer,\nEmbassy of ${destination || "[Country]"},\nDelhi,\nIndia`
  );
}

// ─────────────────────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────────────────────

export interface SeededConsentState {
  [key: string]: string;
}

export function seedConsentState(inputs: SponsorConsentInputs): SeededConsentState {
  const dest = inputs.destination || "[Country]";
  const applicantGender = "He/She"; // neutral — user edits in preview
  const relCap =
    inputs.sponsorRelationship
      ? inputs.sponsorRelationship.charAt(0).toUpperCase() + inputs.sponsorRelationship.slice(1)
      : "[Relationship]";

  const durationStr = inputs.travelDuration ? `${inputs.travelDuration} days` : "[X] days";
  const startFmt = fmtDate(inputs.travelStartDate);
  const endFmt = fmtDate(inputs.travelEndDate);

  const accompanyingLine =
    inputs.sponsorAccompanying === "accompanying"
      ? `I will also be accompanying ${applicantGender.toLowerCase()} on this trip.`
      : `I will not be accompanying ${applicantGender.toLowerCase()} on this trip; ${applicantGender.toLowerCase()} will be travelling independently.`;

  const sponsorshipReasonText =
    inputs.sponsorshipReason ||
    hint("State the reason why you are sponsoring this trip — e.g. 'he/she is my dependent' or 'I wish to support his/her travel'");

  return {
    lHeading: `LETTER OF SPONSORSHIP AND CONSENT FOR ${(inputs.applicantName || "[YOUR NAME]").toUpperCase()} FOR TEMPORARY VISITOR VISA FOR TOURISM`,
    lToBlock: getVisaOfficerAddress(dest),
    lDate: today(),
    lSalutation: "Respected Sir/Madam,",
    lIntro:
      `My name is ${inputs.sponsorName || "[Sponsor's Name]"}, currently residing in ${inputs.sponsorCity || "[City Name]"}, and I am a citizen of India. ` +
      `I am writing this letter to confirm and consent my full sponsorship for ${inputs.applicantName || "[Applicant's Name]"} ` +
      `(Passport No. — ${inputs.applicantPassport || hint("Add applicant's passport number")}, ` +
      `D.O.B — ${fmtDob(inputs.applicantDob)}). ${applicantGender} is my ${inputs.sponsorRelationship || "[Relationship]"}. ` +
      `${applicantGender} will be visiting ${dest} with me for ${durationStr} from ${startFmt} to ${endFmt}.`,
    lPurpose:
      `The purpose of ${applicantGender.toLowerCase()} travel is to ${inputs.purposeOfVisit || `explore ${dest}'s tourist spots`}. ${accompanyingLine}`,
    lSponsorship:
      `I will be fully sponsoring ${applicantGender.toLowerCase()} trip and bear all the cost which will incur during our stay in ${dest} because ${sponsorshipReasonText}.`,
    lDocuments:
      `I have enclosed a list of documents as proof of my financial capacity to sponsor ${applicantGender.toLowerCase()}. ` +
      `These funds will replenish and cover ${applicantGender.toLowerCase()} expenses. ` +
      `Please feel free to contact me for any information, I will gladly extend my help in the best possible manner.`,
    lRequest: `I kindly request you to issue the Temporary Visitor Visa for Tourism.`,
    lClosing: `Thanking you.\n\nYours Sincerely,`,
    lSigName: inputs.sponsorName || "[Sponsor Name]",
    lSigAddress: inputs.sponsorAddress || hint("Add your current address"),
    lSigMobile: inputs.sponsorMobile || hint("Add your mobile number"),
    lSigPassport: inputs.sponsorPassport || hint("Add your passport number"),
  };
}