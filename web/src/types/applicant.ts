// visamate/web/src/types/applicant.ts

import { CountryVisit } from "@/features/documents/cover_letter/coverLetterService";

export interface ApplicantData {
  // ── From ItineraryWidget ──
  applicantName: string;
  passportNo: string;
  applicantDob: string;          // ISO "YYYY-MM-DD"
  travelStartDate: string;       // ISO "YYYY-MM-DD"
  travelDuration: number;        // days
  cities: string[];

  // ── From StepCountry ──
  country: string;

  // ── From StepLocation ──
  vfsCenter: string;

  // ── From StepDetails ──
  sponsorshipType: "self" | "sponsored" | null;
  applicantProfile: "employed" | "student" | "self-employed" | null;

  // ── Sponsor fields (populated when sponsorshipType === "sponsored") ──
  sponsorName: string;
  sponsorRel: string;             // e.g. "father", "brother"
  sponsorPassport: string;
  sponsorDob: string;             // ISO "YYYY-MM-DD"
  sponsorMobile: string;
  sponsorCity: string;            // city where sponsor resides
  sponsorAccompanying: "accompanying" | "staying" | null;
  sponsorshipReason: string;      // why sponsor is bearing costs

  // ── From StepVisaType ──
  visaType: string;
  visaTypeName: string;

  // ── From CoverLetterWidget (Step 1 inputs) ──
  departureCity: string;
  countriesVisited: CountryVisit[];
  travellingWith: "alone" | "with";
  companion: "mother" | "father" | "spouse" | "friend" | "";
  designation: string;            // employed / self-employed only
  companyName: string;            // employed / self-employed only
  institutionName: string;        // student only
  married: "yes" | "no";
  parentsInIndia: "yes" | "no";
  hasChildren: "yes" | "no";
  contacts: { name: string; rel: string; phone: string; email: string }[];

  // ── Cover letter inline placeholders ──
  hotelName: string;
  bankBalance: string;
  purpose: string;
}