/**
 * sponsorConsentService.ts
 *
 * Core types, helpers, and seed logic for the Sponsor Consent Letter builder.
 * Pure data — no React, no side effects.
 */

import { today, fmtDate, fmtDob } from "@/lib/utils/date";
import { hint } from "../utils/textFormatting";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SponsorConsentInputs {
  // Sponsor (author of the letter)
  sponsorName: string;
  sponsorCity: string;
  sponsorPassport: string;
  sponsorDob: string;           // "YYYY-MM-DD"
  sponsorMobile: string;
  sponsorRelationship: string;  // "brother", "father", etc.
  sponsorAccompanying: "accompanying" | "not_accompanying";
  sponsorshipReason: string;    // why sponsor is bearing costs

  // Applicant (the person being sponsored)
  applicantName: string;
  applicantPassport: string;
  applicantDob: string;         // "YYYY-MM-DD"

  // Trip
  destination: string;          // "Japan", "France", etc.
  visaTypeName: string;         // "Tourist Visa", "Temporary Visitor Visa", etc.
  travelStartDate: string;      // "YYYY-MM-DD"
  travelEndDate: string;        // "YYYY-MM-DD"  (derived: start + duration - 1)
  travelDuration: string;       // number of days as string
  purposeOfVisit: string;       // "explore tourist spots and cultural landmarks"
}

// ─────────────────────────────────────────────────────────────
// Visa officer address map
// ─────────────────────────────────────────────────────────────

const VISA_OFFICER_ADDRESSES: Record<string, string> = {
  Japan:
    "The Visa Officer,\nEmbassy of Japan,\nNew Delhi,\nIndia",
  France:
    "The Visa Officer,\nEmbassy of France,\nNew Delhi,\nIndia",
  UK:
    "The Visa Officer,\nUK Visa and Immigration,\nNew Delhi,\nIndia",
  Schengen:
    "The Visa Officer,\nVFS Global – Schengen Visa Application Centre,\nNew Delhi,\nIndia",
};

export function getVisaOfficerAddress(destination: string): string {
  return (
    VISA_OFFICER_ADDRESSES[destination] ??
    `The Visa Officer,\nEmbassy of ${destination || "[Country]"},\nNew Delhi,\nIndia`
  );
}

// ─────────────────────────────────────────────────────────────
// Pronoun helpers — neutral default, user can edit in preview
// ─────────────────────────────────────────────────────────────

const PRONOUN = {
  subject: "he/she",           // "he/she will be visiting"
  object: "him/her",           // "accompanying him/her"
  possessive: "his/her",       // "his/her trip", "his/her expenses"
  reflexive: "himself/herself",
} as const;

// ─────────────────────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────────────────────

export interface SeededConsentState {
  lHeading: string;
  lToBlock: string;
  lDate: string;
  lSalutation: string;
  lIntro: string;
  lPurpose: string;
  lSponsorship: string;
  lDocuments: string;
  lRequest: string;
  lClosing: string;
  lSigName: string;
  lSigMobile: string;
  lSigPassport: string;
}

export function seedConsentState(inputs: SponsorConsentInputs): SeededConsentState {
  const dest = inputs.destination || "[Country]";
  const visaLabel = inputs.visaTypeName || "Temporary Visitor Visa for Tourism";


  const durationStr = inputs.travelDuration ? `${inputs.travelDuration} days` : "[X] days";
  const startFmt = fmtDate(inputs.travelStartDate);
  const endFmt = fmtDate(inputs.travelEndDate);
  const isAccompanying = inputs.sponsorAccompanying === "accompanying";

  // ── Pronoun shorthands ──
  const { subject: he, object: him, possessive: his } = PRONOUN;

  // ── Sponsorship reason ──
  const sponsorshipReasonText =
    inputs.sponsorshipReason ||
    hint("State why you are sponsoring this trip — e.g. 'he/she is my dependent and a student' or 'I wish to support his/her travel abroad'");

  // ── Purpose of visit ──
  const purposeText =
    inputs.purposeOfVisit ||
    `explore the tourist spots and cultural landmarks of ${dest}`;

  // ── Intro paragraph ──
  // "with me" only when sponsor is accompanying; otherwise just states the trip facts
  const tripContextPhrase = isAccompanying
    ? `${he.charAt(0).toUpperCase() + he.slice(1)} will be accompanying me to ${dest} for ${durationStr}, from ${startFmt} to ${endFmt}.`
    : `${he.charAt(0).toUpperCase() + he.slice(1)} will be travelling to ${dest} for ${durationStr}, from ${startFmt} to ${endFmt}.`;

  // ── Accompanying line (purpose paragraph) ──
  const accompanyingLine = isAccompanying
    ? `I will be accompanying ${him} on this trip.`
    : `I will not be accompanying ${him} on this trip; ${he} will be travelling independently.`;

  // ── "our stay" vs "his/her stay" ──
  const stayPossessive = isAccompanying ? "our" : his;

  return {
    lHeading:
      `Re: Letter of Sponsorship and Consent for ${inputs.applicantName || "[Applicant Name]"} for ${visaLabel} visa`,

    lToBlock: getVisaOfficerAddress(dest),

    lDate: today(),

    lSalutation: "Respected Sir/Madam,",

    lIntro:
      `My name is ${inputs.sponsorName || "[Sponsor Name]"}, and I am an Indian citizen currently residing in ` +
      `${inputs.sponsorCity || hint("Add your city of residence")}. ` +
      `I am writing to confirm my full financial sponsorship for ${inputs.applicantName || "[Applicant Name]"} ` +
      `(Passport No. ${inputs.applicantPassport || hint("Add applicant's passport number")}, ` +
      `D.O.B. ${fmtDob(inputs.applicantDob)}), who is my ${inputs.sponsorRelationship || "[relationship]"}. ` +
      tripContextPhrase,

    lPurpose:
      `The purpose of ${his} visit is to ${purposeText}. ${accompanyingLine}`,

    lSponsorship:
      `I will be fully sponsoring ${his} trip and will bear all costs incurred during ${stayPossessive} stay in ${dest}, ` +
      `as ${sponsorshipReasonText}.`,

    lDocuments:
      `I have enclosed supporting documents as proof of my financial capacity to sponsor ${his} travel. ` +
      `These funds are sufficient to cover all of ${his} expenses throughout the trip. ` +
      `Should you require any further information or clarification, please do not hesitate to contact me — I will be glad to assist.`,

    lRequest:
      `I kindly request you to grant ${inputs.applicantName || "[Applicant Name]"} the ${visaLabel} for ${dest}.`,

    lClosing: `Thanking you.\n\nYours sincerely,`,

    lSigName: inputs.sponsorName || hint("Add sponsor's full name"),
    lSigMobile: inputs.sponsorMobile || hint("Add your mobile number"),
    lSigPassport: inputs.sponsorPassport || hint("Add your passport number"),
  };
}