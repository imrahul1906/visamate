// visamate/web/src/types/applicant.ts

export interface ApplicantData {
  // ── From ItineraryWidget ──
  applicantName: string;
  passportNo: string;
  travelStartDate: string;   // ISO "YYYY-MM-DD"
  travelDuration: number;    // days
  cities: string[];

  // ── From StepCountry ──
  country: string;

  // ── From StepLocation ──
  vfsCenter: string;

  // ── From StepDetails ──
  sponsorshipType: "self" | "sponsored" | null;
  applicantProfile: "employed" | "student" | "self-employed" | null;

  // ── From StepVisaType ──
  visaType: string;
  visaTypeName: string;

  // ── From CoverLetterWidget (Step 1 inputs) ──
  departureCity: string;
  countriesVisited: string;          // comma-separated
  travellingWith: "alone" | "with";
  companion: "mother" | "father" | "spouse" | "friend" | "";
  designation: string;               // employed / self-employed only
  companyName: string;               // employed / self-employed only
  institutionName: string;           // student only
  sponsorName: string;               // sponsored only
  sponsorRel: string;                // sponsored only
  sponsorAccompanying: "accompanying" | "staying";
  married: "yes" | "no";
  parentsInIndia: "yes" | "no";
  hasChildren: "yes" | "no";
  contacts: { name: string; rel: string; phone: string; email: string }[];

  // ── Cover letter inline placeholders ──
  hotelName: string;
  bankBalance: string;
  purpose: string;
}