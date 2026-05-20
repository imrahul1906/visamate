// visamate/web/src/lib/context/ApplicantContext.tsx

"use client";

// ApplicantContext.tsx
// Shared data store for the visa wizard.
// Wrap your app root (or page) in <ApplicantProvider>.
// Every widget reads with useApplicant() and writes with update().
// No UI — this file is pure state.

import { createContext, useContext, useState, ReactNode } from "react";
import type { ApplicantData } from "@/types/applicant";

export type { ApplicantData };

/* ─── Defaults (all empty — no mock data) ─── */
const defaults: ApplicantData = {
  // Applicant
  applicantName: "",
  passportNo: "",
  applicantDob: "",
  travelStartDate: "",
  travelDuration: 0,
  cities: [],

  // Destination
  country: "",
  vfsCenter: "",

  // Profile
  sponsorshipType: null,
  applicantProfile: null,

  // Sponsor
  sponsorName: "",
  sponsorRel: "",
  sponsorPassport: "",
  sponsorDob: "",
  sponsorMobile: "",
  sponsorCity: "",
  sponsorAccompanying: null,
  sponsorshipReason: "",

  // Visa type
  visaType: "",
  visaTypeName: "",

  // Cover letter
  departureCity: "",
  countriesVisited: [],
  travellingWith: "alone",
  companion: "",
  designation: "",
  companyName: "",
  institutionName: "",
  married: "no",
  parentsInIndia: "yes",
  hasChildren: "no",
  contacts: [],

  // Inline placeholders
  hotelName: "",
  bankBalance: "",
  purpose: "",
};

/* ─── Context ─── */
interface ApplicantContextValue {
  ctx: ApplicantData;
  update: (patch: Partial<ApplicantData>) => void;
  reset: () => void;
}

const ApplicantContext = createContext<ApplicantContextValue>({
  ctx: defaults,
  update: () => { },
  reset: () => { },
});

/* ─── Provider — wrap your page/app root with this ─── */
export function ApplicantProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<ApplicantData>(defaults);

  const update = (patch: Partial<ApplicantData>) =>
    setCtx((prev) => ({ ...prev, ...patch }));

  const reset = () => setCtx(defaults);

  return (
    <ApplicantContext.Provider value={{ ctx, update, reset }}>
      {children}
    </ApplicantContext.Provider>
  );
}

/* ─── Hook — use this inside any widget ─── */
export function useApplicant() {
  return useContext(ApplicantContext);
}