"use client";

// CoverLetterWidget.tsx — Japan Visa Cover Letter Builder
// Reads all pre-filled data from ApplicantContext.
// Writes cover-letter-specific inputs back to context on form submit.

import { useState, useRef, useEffect } from "react";
import { useApplicant } from "@/lib/context/ApplicantContext";
import {
  fmtDate,
  fmtDateEnd,
  today,
  validateCoverLetterInputs,
  getUnfilledFields,
  buildImmigrationParag,
  buildSponsorParag,
  isSponsored as isSponsoredFn,
  isEmployed as isEmployedFn,
  isStudent as isStudentFn,
} from "@/services/coverLetterService";
import type { CoverLetterInputs, ApplicantContext as CoverLetterCtx } from "@/services/coverLetterService";

/* ─────────────────────────── INLINE TEXT FIELD ─────────────────────────── */
/** Single-line editable field that looks like plain letter text until focused */
function InlineField({ value, onChange, placeholder = "Click to edit", style = {} }: {
  value: string; onChange: (v: string) => void; placeholder?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      className="cl-inline-field"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={style}
      title="Click to edit"
    />
  );
}

/* ─────────────────────────── INLINE TEXTAREA ─────────────────────────── */
/** Multi-line editable paragraph — always editable, styled like letter text */
function InlinePara({ value, onChange, rows = 4 }: {
  value: string; onChange: (v: string) => void; rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // Auto-resize
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      className="cl-inline-para"
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      title="Click to edit paragraph"
    />
  );
}

/* ─────────────────────────── CONTACT ROW ─────────────────────────── */
function ContactRow({ contact, idx, onChange, onRemove }) {
  return (
    <div className="cl-contact-row">
      <span className="cl-contact-num">{idx + 1}</span>
      <input className="cl-input cl-contact-field" placeholder="Full name" value={contact.name}
        onChange={e => onChange({ ...contact, name: e.target.value })} />
      <input className="cl-input cl-contact-field" placeholder="Relationship" value={contact.rel}
        onChange={e => onChange({ ...contact, rel: e.target.value })} />
      <input className="cl-input cl-contact-field" placeholder="+91 XXXXX XXXXX" value={contact.phone}
        onChange={e => onChange({ ...contact, phone: e.target.value })} />
      <input className="cl-input cl-contact-field" placeholder="email@example.com" value={contact.email}
        onChange={e => onChange({ ...contact, email: e.target.value })} />
      <button className="cl-icon-btn cl-icon-btn--remove" onClick={onRemove} title="Remove">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/* ═══════════════════════════ MAIN WIDGET ═══════════════════════════ */
export default function CoverLetterWidget() {
  const { ctx, update } = useApplicant();
  const [step, setStep] = useState("select"); // "select" | "inputs" | "letter"

  /* ── Fresh inputs (Step 1) — seeded from context so navigating back preserves values ── */
  const [departureCity, setDepartureCity] = useState(ctx.departureCity || "");
  const [countriesVisited, setCountriesVisited] = useState(ctx.countriesVisited || "");
  const [travellingWith, setTravellingWith] = useState<"alone" | "with">(ctx.travellingWith || "alone");
  const [companion, setCompanion] = useState(ctx.companion || "");
  const [designation, setDesignation] = useState(ctx.designation || "");
  const [companyName, setCompanyName] = useState(ctx.companyName || "");
  const [institutionName, setInstitutionName] = useState(ctx.institutionName || "");
  const [sponsorName, setSponsorName] = useState(ctx.sponsorName || "");
  const [sponsorRel, setSponsorRel] = useState(ctx.sponsorRel || "");
  const [sponsorAccompanying, setSponsorAccompanying] = useState(ctx.sponsorAccompanying || "staying");
  const [married, setMarried] = useState(ctx.married || "no");
  const [parentsInIndia, setParentsInIndia] = useState(ctx.parentsInIndia || "yes");
  const [hasChildren, setHasChildren] = useState(ctx.hasChildren || "no");
  const [contacts, setContacts] = useState(
    ctx.contacts?.length ? ctx.contacts : [{ name: "", rel: "", phone: "", email: "" }]
  );

  /* ── Letter inline placeholders — seeded from context ── */
  const [purpose, setPurpose] = useState(ctx.purpose || "");
  const [hotelName, setHotelName] = useState(ctx.hotelName || "");
  const [bankBalance, setBankBalance] = useState(ctx.bankBalance || "");

  /* ── Re-sync local state whenever context fields updated externally ── */
  // Split into two effects:
  //   1. Mount-only: seeds all fields from context on first open, so values filled in
  //      ItineraryWidget (name, passport, dates, cities) are immediately visible.
  //   2. Profile/sponsorship change: re-seeds when StepDetails changes the profile or
  //      sponsorship type, so conditional fields (company, institution, sponsor) update.
  const { applicantProfile, sponsorshipType } = ctx;

  const reseedFromContext = () => {
    if (step === "letter") return;
    setDepartureCity(ctx.departureCity || "");
    setCountriesVisited(ctx.countriesVisited || "");
    setTravellingWith(ctx.travellingWith || "alone");
    setCompanion(ctx.companion || "");
    setDesignation(ctx.designation || "");
    setCompanyName(ctx.companyName || "");
    setInstitutionName(ctx.institutionName || "");
    setSponsorName(ctx.sponsorName || "");
    setSponsorRel(ctx.sponsorRel || "");
    setSponsorAccompanying(ctx.sponsorAccompanying || "staying");
    setMarried(ctx.married || "no");
    setParentsInIndia(ctx.parentsInIndia || "yes");
    setHasChildren(ctx.hasChildren || "no");
    if (ctx.contacts?.length) setContacts(ctx.contacts);
    setPurpose(ctx.purpose || "");
    setHotelName(ctx.hotelName || "");
    setBankBalance(ctx.bankBalance || "");
  };

  // Effect 1: run once on mount — picks up everything already in context
  // (applicantName, passportNo, travelStartDate, travelDuration, cities, etc.)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reseedFromContext, []);

  // Effect 2: re-seed when profile or sponsorship changes (e.g. user visits StepDetails
  // after opening CoverLetter, then comes back)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reseedFromContext, [applicantProfile, sponsorshipType]);

  /* ── Validation ── */
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  /* ── Download state ── */
  const [downloading, setDownloading] = useState(false);
  const [unfilled, setUnfilled] = useState([]);

  /* ── Derived booleans via service helpers ── */
  const isEmployed = isEmployedFn(ctx.applicantProfile);
  const isStudent = isStudentFn(ctx.applicantProfile);
  const isSponsored = isSponsoredFn(ctx.sponsorshipType);

  function handleProceed() {
    setAttempted(true);
    const inputs: CoverLetterInputs = {
      departureCity, countriesVisited, travellingWith, companion,
      applicantProfile: ctx.applicantProfile, designation, companyName, institutionName,
      sponsorshipType: ctx.sponsorshipType, sponsorName, sponsorRel, sponsorAccompanying,
      married, parentsInIndia, hasChildren, contacts, purpose, hotelName, bankBalance,
    };
    const e = validateCoverLetterInputs(inputs);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // Write all fresh inputs back to context before showing the letter
      update({
        departureCity,
        countriesVisited,
        travellingWith,
        companion: companion as any,
        designation,
        companyName,
        institutionName,
        sponsorName,
        sponsorRel,
        sponsorAccompanying: sponsorAccompanying as any,
        married: married as any,
        parentsInIndia: parentsInIndia as any,
        hasChildren: hasChildren as any,
        contacts,
        hotelName,
        bankBalance,
        purpose,
      });
      setStep("letter");
    }
  }

  /* ── Build service inputs/ctx objects ── */
  function makeInputs(): CoverLetterInputs {
    return {
      departureCity, countriesVisited, travellingWith, companion,
      applicantProfile: ctx.applicantProfile, designation, companyName, institutionName,
      sponsorshipType: ctx.sponsorshipType, sponsorName, sponsorRel, sponsorAccompanying,
      married, parentsInIndia, hasChildren, contacts, purpose, hotelName, bankBalance,
    };
  }

  function makeCtx(): CoverLetterCtx {
    return {
      applicantName: ctx.applicantName,
      passportNo: ctx.passportNo,
      travelStartDate: ctx.travelStartDate,
      travelDuration: ctx.travelDuration,
      cities: ctx.cities ?? [],
      applicantProfile: ctx.applicantProfile,
      sponsorshipType: ctx.sponsorshipType,
    };
  }

  /* ── Download check ── */
  async function handleDownload() {
    const missing = getUnfilledFields(makeInputs());
    if (missing.length > 0) {
      setUnfilled(missing);
      return;
    }
    setUnfilled([]);
    setDownloading(true);
    await new Promise(r => setTimeout(r, 1800));
    setDownloading(false);

    // Build plain text entirely from the editable preview state (l* vars)
    const contactsTable = lContacts.filter(c => c.name.trim()).map(c =>
      `  ${c.name} (${c.rel || "—"}) | ${c.phone || "—"} | ${c.email || "—"}`
    ).join("\n");

    const docRowsText = lDocRows.map((r, i) => `  ${i + 1}. ${r}`).join("\n");
    const bulletsText = lBullets.map(b => `  • ${b}`).join("\n");

    const sections: string[] = [
      lHeading,
      "",
      lToBlock,
      "",
      lDate,
      "",
      `Subject: ${lSubject}`,
      "",
      lSalutation,
      "",
      lIntro,
      "",
      bulletsText,
      "",
      `${lSecDocs.toUpperCase()}`,
      lSecDocsIntro,
      docRowsText,
      "",
      `${lSecPurpose.toUpperCase()}`,
      lSecPurposeIntro,
      lPurposeDetail,
      lFlightPara,
      "",
      `${lSecOverstay.toUpperCase()}`,
      lSecOverstayIntro,
      "",
      lSecImmigration,
      lImmigration,
      "",
      lSecFamily,
      lFamilyTies,
      "",
      lSecEconomic,
      lEconomicTies,
      "",
      `${lSecFinance.toUpperCase()}`,
      ...(!isSponsoredFn(ctx.sponsorshipType)
        ? [lSecFinanceIntro, "", lSecIncome, lFinance]
        : [lFinance, "", lSecSponsor, lSponsor]
      ),
      "",
      `${lSecContacts.toUpperCase()}`,
      lContactsNote,
      contactsTable,
      "",
      lClosing,
      "",
      `${lSigName}  (Passport No. — ${lSigPassport})`,
      "_____________________",
      "Signature",
    ];

    const text = sections.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Japan_Visa_Cover_Letter_${(lSigName || ctx.applicantName || "applicant").replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setStep("select");
  }

  /* ── Editable letter fields (seeded when entering letter step) ── */
  const [lHeading, setLHeading] = useState("COVER LETTER");
  const [lToBlock, setLToBlock] = useState("To,\nThe Visa Officer,\nEmbassy of Japan,\nDelhi, India");
  const [lDate, setLDate] = useState(today());
  const [lSubject, setLSubject] = useState("");
  const [lSalutation, setLSalutation] = useState("To whom it may concern,");
  const [lIntro, setLIntro] = useState("");
  const [lPurposeDetail, setLPurposeDetail] = useState("");
  const [lFlightPara, setLFlightPara] = useState("");
  const [lImmigration, setLImmigration] = useState("");
  const [lFamilyTies, setLFamilyTies] = useState("");
  const [lEconomicTies, setLEconomicTies] = useState("");
  const [lFinance, setLFinance] = useState("");
  const [lSponsor, setLSponsor] = useState("");
  const [lContactsNote, setLContactsNote] = useState(
    "It is appreciated that you may want to contact my family and friends in order to verify my intentions. If you would like to do so, the following are some useful contact details:"
  );
  const [lClosing, setLClosing] = useState("Finally, I can confirm that the information provided above is true to the best of my knowledge and belief.\n\nYour faithfully,");
  const [lSigName, setLSigName] = useState("");
  const [lSigPassport, setLSigPassport] = useState("");
  // Editable contacts table in preview
  const [lContacts, setLContacts] = useState(contacts);
  // Editable doc table rows
  const [lDocRows, setLDocRows] = useState<string[]>([]);

  // Section headings (were uncontrolled defaultValue — now fully controlled)
  const [lSecDocs, setLSecDocs] = useState("List of Supporting Documents");
  const [lSecDocsIntro, setLSecDocsIntro] = useState("In support of my temporary visitor visa for tourism application, I have included the following documents");
  const [lSecPurpose, setLSecPurpose] = useState("The Purpose of my Visit");
  const [lSecPurposeIntro, setLSecPurposeIntro] = useState("The purpose of my visit:");
  const [lSecOverstay, setLSecOverstay] = useState("Why I will not overstay the temporary visitor visa for tourism");
  const [lSecOverstayIntro, setLSecOverstayIntro] = useState("I fully intend to return to India before my Japan visitor visa expires. I have a good life back home and have no reason or intention to overstay. The following are the reasons that I would like you to consider when deciding my application:");
  const [lSecImmigration, setLSecImmigration] = useState("My good immigration history");
  const [lSecFamily, setLSecFamily] = useState("Family ties to my home country");
  const [lSecEconomic, setLSecEconomic] = useState("Financial and economic ties to my home country");
  const [lSecFinance, setLSecFinance] = useState("My ability to adequately maintain myself during my visit to Japan");
  const [lSecFinanceIntro, setLSecFinanceIntro] = useState("I confirm that I can adequately maintain myself. To support this, my sources of income and financial assets are highlighted below.");
  const [lSecIncome, setLSecIncome] = useState("My sources of income");
  const [lSecSponsor, setLSecSponsor] = useState("My sponsor");
  const [lSecContacts, setLSecContacts] = useState("Relevant contact details");

  // Bullet overview items
  const [lBullets, setLBullets] = useState<string[]>([]);

  // Seed editable state whenever we enter the letter step
  useEffect(() => {
    if (step !== "letter") return;
    const inp = makeInputs();
    const c = makeCtx();
    const citiesStr = (c.cities || []).join(", ") || "[Cities]";
    setLSubject(`Application for Japan Temporary Visitor Visa (Tourism) — ${c.applicantName || "[Name]"}`);
    setLIntro(`My name is ${c.applicantName || "[Name]"} and I am from India. I am applying from India and I am applying for a Temporary Visitor Visa for Tourism.\nIn discussing that I am a genuine and credible applicant for a Japan Tourism Visa, this letter will cover;`);
    const flightCity = (c.cities && c.cities[0]) || "[City]";
    setLFlightPara(
      `I will fly from ${inp.departureCity || "[Departure City]"}, India on ${fmtDate(c.travelStartDate)} and land in ${flightCity} on ${fmtDate(c.travelStartDate)}. I will explore the country for ${c.travelDuration} days and leave on ${fmtDateEnd(c.travelStartDate, c.travelDuration)} for India.\n\nComplete travel itinerary has been attached.`
    );
    setLPurposeDetail(
      `To explore the beautiful country including ${citiesStr} and visit the tourist spots. ${inp.purpose || ""}` +
      (inp.travellingWith === "with" && inp.companion ? `\nTo accompany my ${inp.companion} who will also be travelling on the same dates and has applied for a tourist visa.` : "")
    );
    setLImmigration(buildImmigrationParag(inp));
    const family: string[] = [];
    if (inp.married === "yes") family.push("spouse");
    if (inp.parentsInIndia === "yes") family.push("parents");
    if (inp.hasChildren === "yes") family.push("children");
    setLFamilyTies(
      family.length > 0
        ? `I have my ${family.join(", ")} back home in India, which is another indication that I will return to my home country prior to my visa expiring.`
        : "I have family back home in India which is another indication that I will return to my home country prior to my visa expiring."
    );
    if (isEmployedFn(ctx.applicantProfile)) setLEconomicTies(`I am currently employed as ${inp.designation || "[Designation]"} at ${inp.companyName || "[Company Name]"}. My employment is a strong tie to India and demonstrates my intention to return. A No Objection Certificate from my employer confirming my leave approval is enclosed.`);
    else if (isStudentFn(ctx.applicantProfile)) setLEconomicTies(`I am currently enrolled as a student at ${inp.institutionName || "[Institution Name]"}. My studies are a strong tie to India and demonstrate my intention to return. A No Objection Certificate from my institution is enclosed.`);
    else setLEconomicTies("I have strong financial and economic ties to India which demonstrate my intention to return.");
    if (!isSponsoredFn(ctx.sponsorshipType)) {
      setLFinance(`My bank account reflects a balance of ${inp.bankBalance || "[₹X,XX,XXX]"}, which is sufficient to cover all travel, accommodation, and living expenses during my stay. I will be staying at ${inp.hotelName || "[Hotel Name]"} during my visit. Relevant bank statements are enclosed for your reference.`);
    } else {
      setLFinance(`I confirm that my ${inp.sponsorRel || "[Relationship]"} ${inp.sponsorAccompanying === "accompanying" ? "who is accompanying me in this trip " : ""}will sponsor and bear all the cost incurred in this trip. I have attached the consent letter from them. I have also attached their financial records.`);
      setLSponsor(buildSponsorParag(inp));
    }
    setLSigName(c.applicantName || "[Name]");
    setLSigPassport(c.passportNo || "[Passport No]");
    setLContacts(contacts.length ? contacts : [{ name: "", rel: "", phone: "", email: "" }]);
    // Build doc rows
    const rows = [
      "Copy of my passport",
      "Travel itinerary",
      `Financial evidence ${!isSponsoredFn(ctx.sponsorshipType) ? "(bank statements)" : "(sponsor's financial records)"}`,
    ];
    if (isEmployedFn(ctx.applicantProfile)) rows.push("No Objection Certificate (NOC) from employer");
    if (isStudentFn(ctx.applicantProfile)) rows.push("No Objection Certificate (NOC) from institution");
    if (isSponsoredFn(ctx.sponsorshipType)) rows.push(`Letter of consent and sponsorship from my ${inp.sponsorRel || "sponsor"} and his/her financial evidence`);
    rows.push("Onward and Return Air tickets");
    rows.push("Hotel Bookings");
    setLDocRows(rows);
    // Seed bullet overview items
    setLBullets([
      "A list of the supporting documents that I am submitting to support my application",
      "The purpose of my visit",
      "The reasons why I will comply with the terms of my visa and why I will not overstay",
      "My ability to adequately maintain myself during my intended trip",
      ...(isSponsoredFn(ctx.sponsorshipType) ? ["Information relating to my sponsor"] : []),
      "Contact details of other relevant persons you may wish to contact",
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>

      {/* ── SELECT SCREEN ── */}
      {step === "select" && (
        <div className="cl-select">
          <div className="cl-select-inner">
            <p className="cl-eyebrow">Japan Visa Documents</p>
            <h2 className="cl-select-title">Cover Letter Generator</h2>
            <p className="cl-select-sub">
              We'll pre-fill everything we already know — name, dates, cities, passport — and ask only
              for what's missing. Takes under 2 minutes.
            </p>

            {/* Summary of what we know */}
            <div className="cl-context-strip">
              <div className="cl-context-item">
                <span className="cl-context-label">Applicant</span>
                <span className={`cl-context-val${!ctx.applicantName ? " cl-context-val--empty" : ""}`}>
                  {ctx.applicantName || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Passport</span>
                <span className={`cl-context-val${!ctx.passportNo ? " cl-context-val--empty" : ""}`}>
                  {ctx.passportNo || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Dates</span>
                <span className={`cl-context-val${!ctx.travelStartDate ? " cl-context-val--empty" : ""}`}>
                  {ctx.travelStartDate
                    ? `${fmtDate(ctx.travelStartDate)} → ${fmtDateEnd(ctx.travelStartDate, ctx.travelDuration)}`
                    : "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Cities</span>
                <span className={`cl-context-val${!(ctx.cities || []).length ? " cl-context-val--empty" : ""}`}>
                  {(ctx.cities || []).length ? ctx.cities.join(", ") : "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Profile</span>
                <span className={`cl-context-val${!ctx.applicantProfile ? " cl-context-val--empty" : ""}`} style={{ textTransform: "capitalize" }}>
                  {ctx.applicantProfile || "Not filled yet"}
                </span>
              </div>
              <div className="cl-context-item">
                <span className="cl-context-label">Funding</span>
                <span className={`cl-context-val${!ctx.sponsorshipType ? " cl-context-val--empty" : ""}`}>
                  {ctx.sponsorshipType === "sponsored" ? "Sponsored" : ctx.sponsorshipType === "self" ? "Self-funded" : "Not filled yet"}
                </span>
              </div>
            </div>
            {(!ctx.applicantName || !ctx.travelStartDate || !ctx.applicantProfile) && (
              <p className="cl-context-hint">
                ⚠ Some fields are missing above — fill them in the Itinerary and Trip Details steps first. You can still continue and the letter will use placeholders.
              </p>
            )}

            <div className="cl-options">
              <button className="cl-opt cl-opt--dark" onClick={() => setStep("inputs")}>
                <div className="cl-opt-left">
                  <div className="cl-opt-icon cl-opt-icon--dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div className="cl-opt-text">
                    <span className="cl-opt-title">
                      Build Cover Letter
                      <span className="cl-opt-badge">Recommended</span>
                    </span>
                    <span className="cl-opt-desc">Answer a few quick questions, then get an editable pre-filled letter ready to download.</span>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INPUTS PANEL (Step 1) ── */}
      {step === "inputs" && (
        <div className="cl-builder">
          {/* Topbar */}
          <div className="cl-topbar">
            <button className="cl-back" onClick={() => setStep("select")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="cl-topbar-center">
              <span className="cl-topbar-title">Quick Details</span>
              <span className="cl-topbar-sub">Step 1 of 2 — takes ~2 minutes</span>
            </div>
            <div className="cl-topbar-steps">
              <span className="cl-step cl-step--active">1</span>
              <span className="cl-step-line"/>
              <span className="cl-step">2</span>
            </div>
          </div>

          <div className="cl-inputs-body">

            {/* Departure */}
            <div className="cl-section">
              <p className="cl-section-label">Travel</p>
              <div className="cl-field-row">
                <div className="cl-field">
                  <label className="cl-label">
                    Departure city in India
                    {attempted && errors.departureCity && <span className="cl-field-err">{errors.departureCity}</span>}
                  </label>
                  <input className={`cl-input${attempted && errors.departureCity ? " cl-input--error" : ""}`}
                    placeholder="e.g. New Delhi" value={departureCity}
                    onChange={e => { setDepartureCity(e.target.value); setErrors(p => { const n={...p}; delete n.departureCity; return n; }); }} />
                </div>
                <div className="cl-field">
                  <label className="cl-label">Countries visited in last 5 years</label>
                  <input className="cl-input" placeholder="e.g. UAE, Thailand (leave blank if none)"
                    value={countriesVisited} onChange={e => setCountriesVisited(e.target.value)} />
                </div>
              </div>

              {/* Travelling with */}
              <div className="cl-field">
                <label className="cl-label">Travelling</label>
                <div className="cl-toggle-row">
                  {["alone", "with"].map(v => (
                    <button key={v} className={`cl-toggle-btn${travellingWith === v ? " cl-toggle-btn--active" : ""}`}
                      onClick={() => setTravellingWith(v)}>
                      {v === "alone" ? "Alone" : "With someone"}
                    </button>
                  ))}
                </div>
              </div>

              {travellingWith === "with" && (
                <div className="cl-field">
                  <label className="cl-label">
                    Travelling with
                    {attempted && errors.companion && <span className="cl-field-err">{errors.companion}</span>}
                  </label>
                  <div className="cl-toggle-row">
                    {["mother", "father", "spouse", "friend", "colleague"].map(v => (
                      <button key={v} className={`cl-toggle-btn${companion === v ? " cl-toggle-btn--active" : ""}`}
                        onClick={() => { setCompanion(v); setErrors(p => { const n={...p}; delete n.companion; return n; }); }}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employment / Student */}
            {isEmployed && (
              <div className="cl-section">
                <p className="cl-section-label">Employment</p>
                <div className="cl-field-row">
                  <div className="cl-field">
                    <label className="cl-label">
                      Designation / Job title
                      {attempted && errors.designation && <span className="cl-field-err">{errors.designation}</span>}
                    </label>
                    <input className={`cl-input${attempted && errors.designation ? " cl-input--error" : ""}`}
                      placeholder="e.g. Software Engineer" value={designation}
                      onChange={e => { setDesignation(e.target.value); setErrors(p => { const n={...p}; delete n.designation; return n; }); }} />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">
                      Company name
                      {attempted && errors.companyName && <span className="cl-field-err">{errors.companyName}</span>}
                    </label>
                    <input className={`cl-input${attempted && errors.companyName ? " cl-input--error" : ""}`}
                      placeholder="e.g. Infosys Ltd." value={companyName}
                      onChange={e => { setCompanyName(e.target.value); setErrors(p => { const n={...p}; delete n.companyName; return n; }); }} />
                  </div>
                </div>
              </div>
            )}

            {isStudent && (
              <div className="cl-section">
                <p className="cl-section-label">Education</p>
                <div className="cl-field">
                  <label className="cl-label">
                    Institution name
                    {attempted && errors.institutionName && <span className="cl-field-err">{errors.institutionName}</span>}
                  </label>
                  <input className={`cl-input${attempted && errors.institutionName ? " cl-input--error" : ""}`}
                    placeholder="e.g. IIT Delhi" value={institutionName}
                    onChange={e => { setInstitutionName(e.target.value); setErrors(p => { const n={...p}; delete n.institutionName; return n; }); }} />
                </div>
              </div>
            )}

            {/* Sponsor */}
            {isSponsored && (
              <div className="cl-section">
                <p className="cl-section-label">Sponsor Details</p>
                <div className="cl-field-row">
                  <div className="cl-field">
                    <label className="cl-label">
                      Sponsor's name
                      {attempted && errors.sponsorName && <span className="cl-field-err">{errors.sponsorName}</span>}
                    </label>
                    <input className={`cl-input${attempted && errors.sponsorName ? " cl-input--error" : ""}`}
                      placeholder="e.g. Ramesh Yadav" value={sponsorName}
                      onChange={e => { setSponsorName(e.target.value); setErrors(p => { const n={...p}; delete n.sponsorName; return n; }); }} />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">
                      Relationship to you
                      {attempted && errors.sponsorRel && <span className="cl-field-err">{errors.sponsorRel}</span>}
                    </label>
                    <input className={`cl-input${attempted && errors.sponsorRel ? " cl-input--error" : ""}`}
                      placeholder="e.g. Father" value={sponsorRel}
                      onChange={e => { setSponsorRel(e.target.value); setErrors(p => { const n={...p}; delete n.sponsorRel; return n; }); }} />
                  </div>
                </div>
                <div className="cl-field">
                  <label className="cl-label">Sponsor during travel</label>
                  <div className="cl-toggle-row">
                    {[["staying", "Staying in India"], ["accompanying", "Accompanying me"]].map(([v, l]) => (
                      <button key={v} className={`cl-toggle-btn${sponsorAccompanying === v ? " cl-toggle-btn--active" : ""}`}
                        onClick={() => setSponsorAccompanying(v)}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Family ties */}
            <div className="cl-section">
              <p className="cl-section-label">Family Ties in India</p>
              <div className="cl-ties-grid">
                <div className="cl-ties-item">
                  <label className="cl-label">Married?</label>
                  <div className="cl-toggle-row cl-toggle-row--sm">
                    {["yes", "no"].map(v => (
                      <button key={v} className={`cl-toggle-btn${married === v ? " cl-toggle-btn--active" : ""}`}
                        onClick={() => setMarried(v)}>{v === "yes" ? "Yes" : "No"}</button>
                    ))}
                  </div>
                </div>
                <div className="cl-ties-item">
                  <label className="cl-label">Parents in India?</label>
                  <div className="cl-toggle-row cl-toggle-row--sm">
                    {["yes", "no"].map(v => (
                      <button key={v} className={`cl-toggle-btn${parentsInIndia === v ? " cl-toggle-btn--active" : ""}`}
                        onClick={() => setParentsInIndia(v)}>{v === "yes" ? "Yes" : "No"}</button>
                    ))}
                  </div>
                </div>
                <div className="cl-ties-item">
                  <label className="cl-label">Children?</label>
                  <div className="cl-toggle-row cl-toggle-row--sm">
                    {["yes", "no"].map(v => (
                      <button key={v} className={`cl-toggle-btn${hasChildren === v ? " cl-toggle-btn--active" : ""}`}
                        onClick={() => setHasChildren(v)}>{v === "yes" ? "Yes" : "No"}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency contacts */}
            <div className="cl-section">
              <p className="cl-section-label">Emergency Contacts in India <span className="cl-section-hint">(up to 3)</span></p>
              <div className="cl-contact-header">
                <span>Name</span><span>Relationship</span><span>Phone</span><span>Email</span><span/>
              </div>
              {contacts.map((c, i) => (
                <ContactRow key={i} contact={c} idx={i}
                  onChange={updated => setContacts(prev => prev.map((x, j) => j === i ? updated : x))}
                  onRemove={() => setContacts(prev => prev.filter((_, j) => j !== i))} />
              ))}
              {contacts.length < 3 && (
                <button className="cl-add-contact"
                  onClick={() => setContacts(p => [...p, { name: "", rel: "", phone: "", email: "" }])}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add contact
                </button>
              )}
            </div>

            {/* Proceed */}
            <div className="cl-save-row">
              <p className="cl-save-hint">The letter preview opens in the next step. You can edit every paragraph inline before downloading.</p>
              <button className="cl-save-btn" onClick={handleProceed}>
                Preview Letter →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── LETTER PREVIEW (Step 2) ── */}
      {step === "letter" && (
        <div className="cl-builder">
          {/* Topbar */}
          <div className="cl-topbar">
            <button className="cl-back" onClick={() => setStep("inputs")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Builder
            </button>
            <div className="cl-topbar-center">
              <span className="cl-topbar-title">Cover Letter Preview</span>
              <span className="cl-topbar-sub">Click any field to edit inline</span>
            </div>
            <div className="cl-topbar-steps">
              <span className="cl-step cl-step--done">✓</span>
              <span className="cl-step-line"/>
              <span className="cl-step cl-step--active">2</span>
            </div>
          </div>

          <div className="cl-letter-body">

            {/* Info strip */}
            <div className="cl-preview-info-strip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>
                <strong>Click any text to edit it directly</strong> — every heading, paragraph, table cell, and contact is editable right here.
              </span>
            </div>

            {/* THE LETTER */}
            <div className="cl-letter-sheet">

              {/* Heading */}
              <input
                className="cl-letter-heading-input"
                value={lHeading}
                onChange={e => setLHeading(e.target.value)}
                title="Click to edit"
              />

              {/* To / Date block */}
              <div className="cl-addr-block">
                <textarea
                  className="cl-addr-textarea"
                  value={lToBlock}
                  onChange={e => setLToBlock(e.target.value)}
                  rows={4}
                  title="Click to edit address"
                />
                <input
                  className="cl-date-input"
                  value={lDate}
                  onChange={e => setLDate(e.target.value)}
                  title="Click to edit date"
                />
              </div>

              {/* Subject */}
              <div className="cl-subject-row">
                <span className="cl-subject-bold">Subject: </span>
                <input
                  className="cl-inline-field cl-inline-field--subject"
                  value={lSubject}
                  onChange={e => setLSubject(e.target.value)}
                  title="Click to edit subject"
                />
              </div>

              {/* Salutation */}
              <input
                className="cl-inline-field cl-inline-field--salutation"
                value={lSalutation}
                onChange={e => setLSalutation(e.target.value)}
                title="Click to edit"
              />

              {/* Intro */}
              <InlinePara value={lIntro} onChange={setLIntro} rows={3}/>

              {/* Bullet overview — editable list */}
              <ul className="cl-bullet-list cl-bullet-list--edit">
                {lBullets.map((item, i) => (
                  <li key={i} className="cl-bullet-edit-item">
                    <input
                      className="cl-inline-field cl-inline-field--bullet"
                      value={item}
                      onChange={e => setLBullets(prev => prev.map((b, bi) => bi === i ? e.target.value : b))}
                      title="Click to edit"
                    />
                  </li>
                ))}
              </ul>

              {/* Supporting Documents section */}
              <input className="cl-section-heading-input" value={lSecDocs} onChange={e => setLSecDocs(e.target.value)} title="Click to edit"/>
              <InlinePara value={lSecDocsIntro} onChange={setLSecDocsIntro} rows={2}/>

              <table className="cl-doc-table">
                <thead>
                  <tr>
                    <th className="cl-doc-th cl-doc-th--num">Appendix</th>
                    <th className="cl-doc-th">Document</th>
                  </tr>
                </thead>
                <tbody>
                  {lDocRows.map((row, i) => (
                    <tr key={i}>
                      <td className="cl-doc-td cl-doc-td--num">{i + 1}</td>
                      <td className="cl-doc-td cl-doc-td--edit">
                        <input
                          className="cl-cell-input-light"
                          value={row}
                          onChange={e => setLDocRows(rows => rows.map((r, ri) => ri === i ? e.target.value : r))}
                          title="Click to edit"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num" colSpan={2}>
                      <button className="cl-cell-add-btn-light" onClick={() => setLDocRows(r => [...r, ""])}>+ Add row</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Purpose of Visit */}
              <input className="cl-section-heading-input" value={lSecPurpose} onChange={e => setLSecPurpose(e.target.value)} title="Click to edit"/>
              <InlinePara value={lSecPurposeIntro} onChange={setLSecPurposeIntro} rows={1}/>
              <InlinePara value={lPurposeDetail} onChange={setLPurposeDetail} rows={3}/>
              <InlinePara value={lFlightPara} onChange={setLFlightPara} rows={4}/>

              {/* Why I will not overstay */}
              <input className="cl-section-heading-input" value={lSecOverstay} onChange={e => setLSecOverstay(e.target.value)} title="Click to edit"/>
              <InlinePara value={lSecOverstayIntro} onChange={setLSecOverstayIntro} rows={3}/>

              <input className="cl-subsection-heading-input" value={lSecImmigration} onChange={e => setLSecImmigration(e.target.value)} title="Click to edit"/>
              <InlinePara value={lImmigration} onChange={setLImmigration} rows={3}/>

              <input className="cl-subsection-heading-input" value={lSecFamily} onChange={e => setLSecFamily(e.target.value)} title="Click to edit"/>
              <InlinePara value={lFamilyTies} onChange={setLFamilyTies} rows={3}/>

              <input className="cl-subsection-heading-input" value={lSecEconomic} onChange={e => setLSecEconomic(e.target.value)} title="Click to edit"/>
              <InlinePara value={lEconomicTies} onChange={setLEconomicTies} rows={3}/>

              {/* Financial ability */}
              <input className="cl-section-heading-input" value={lSecFinance} onChange={e => setLSecFinance(e.target.value)} title="Click to edit"/>
              {!isSponsoredFn(ctx.sponsorshipType) ? (
                <>
                  <InlinePara value={lSecFinanceIntro} onChange={setLSecFinanceIntro} rows={2}/>
                  <input className="cl-subsection-heading-input" value={lSecIncome} onChange={e => setLSecIncome(e.target.value)} title="Click to edit"/>
                  <InlinePara value={lFinance} onChange={setLFinance} rows={4}/>
                </>
              ) : (
                <>
                  <InlinePara value={lFinance} onChange={setLFinance} rows={3}/>
                  <input className="cl-subsection-heading-input" value={lSecSponsor} onChange={e => setLSecSponsor(e.target.value)} title="Click to edit"/>
                  <InlinePara value={lSponsor} onChange={setLSponsor} rows={3}/>
                </>
              )}

              {/* Contacts */}
              <input className="cl-section-heading-input" value={lSecContacts} onChange={e => setLSecContacts(e.target.value)} title="Click to edit"/>
              <InlinePara value={lContactsNote} onChange={setLContactsNote} rows={3}/>

              <table className="cl-contacts-table">
                <thead>
                  <tr>
                    {["Name", "Relationship to me", "Phone number", "Email"].map(h => (
                      <th key={h} className="cl-contacts-th">{h}</th>
                    ))}
                    <th className="cl-contacts-th" style={{ width: 28 }}/>
                  </tr>
                </thead>
                <tbody>
                  {lContacts.map((c, i) => (
                    <tr key={i}>
                      {(["name", "rel", "phone", "email"] as const).map(field => (
                        <td key={field} className="cl-contacts-td cl-contacts-td--edit">
                          <input
                            className="cl-cell-input-light"
                            value={c[field]}
                            placeholder={field === "name" ? "Full name" : field === "rel" ? "Relationship" : field === "phone" ? "+91 XXXXX" : "email@..."}
                            onChange={e => setLContacts(prev => prev.map((x, j) => j === i ? { ...x, [field]: e.target.value } : x))}
                            title="Click to edit"
                          />
                        </td>
                      ))}
                      <td className="cl-contacts-td" style={{ textAlign: "center", padding: "4px" }}>
                        <button className="cl-cell-remove-btn-light" onClick={() => setLContacts(p => p.filter((_, j) => j !== i))} title="Remove row">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lContacts.length < 5 && (
                <button className="cl-cell-add-btn-light" style={{ marginBottom: 12 }} onClick={() => setLContacts(p => [...p, { name: "", rel: "", phone: "", email: "" }])}>+ Add contact row</button>
              )}

              {/* Closing */}
              <InlinePara value={lClosing} onChange={setLClosing} rows={3}/>

              {/* Signature block */}
              <div className="cl-sig-block">
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <input className="cl-inline-field cl-inline-field--sig" value={lSigName} onChange={e => setLSigName(e.target.value)} placeholder="Full name" title="Click to edit name"/>
                  <span style={{ color: "#555", fontFamily: "'Times New Roman', serif", fontSize: 13 }}> &nbsp;(Passport No. —</span>
                  <input className="cl-inline-field cl-inline-field--sig" value={lSigPassport} onChange={e => setLSigPassport(e.target.value)} placeholder="Passport No." title="Click to edit passport" style={{ width: 120 }}/>
                  <span style={{ color: "#555", fontFamily: "'Times New Roman', serif", fontSize: 13 }}>)</span>
                </div>
                <div className="cl-sig-line"/>
                <p className="cl-sig-sub cl-sig-italic">Signature</p>
              </div>

            </div>{/* /letter-sheet */}

            {/* Download row */}
            <div className="cl-dl-row">
              <p className="cl-save-hint">All edits are saved automatically. Download when ready.</p>
              <button className="cl-save-btn" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <span className="cl-spinner"/>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download .docx
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}



/* ═══════════════════════════ STYLES ═══════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --iw-bg:          #0d0d1f;
    --iw-surface:     #13132a;
    --iw-surface2:    #1a1a35;
    --iw-border:      rgba(255,255,255,0.08);
    --iw-border2:     rgba(255,255,255,0.14);
    --iw-indigo:      #6366f1;
    --iw-indigo-lt:   #818cf8;
    --iw-indigo-glow: rgba(99,102,241,0.18);
    --iw-text:        #f1f5f9;
    --iw-muted:       rgba(255,255,255,0.38);
    --iw-muted2:      rgba(255,255,255,0.55);
    --iw-amber:       #fbbf24;
    --iw-amber-glow:  rgba(251,191,36,0.13);
    --iw-error:       #f87171;
    --iw-error-bg:    rgba(248,113,113,0.1);
    --iw-green:       #4ade80;
    --iw-radius:      10px;
    --iw-ff-body:     'DM Sans', sans-serif;
  }

  /* ─── Select screen ─── */
  .cl-select {
    font-family: var(--iw-ff-body);
    font-weight: 400;
    background: transparent;
    padding: 28px 20px;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cl-select-inner { max-width: 560px; width: 100%; }
  .cl-eyebrow {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
  }
  .cl-select-title {
    font-size: 22px; font-weight: 600;
    color: var(--iw-text); margin: 0 0 8px;
    font-family: var(--iw-ff-body);
  }
  .cl-select-sub {
    font-size: 13px; color: var(--iw-muted2);
    margin: 0 0 18px; line-height: 1.6;
  }

  /* Context strip */
  .cl-context-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .cl-context-item { display: flex; flex-direction: column; gap: 2px; }
  .cl-context-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--iw-muted); }
  .cl-context-val { font-size: 12px; color: var(--iw-text); font-weight: 500; }
  .cl-context-val--empty { color: var(--iw-muted); font-style: italic; font-weight: 400; }
  .cl-context-hint {
    font-size: 11px; color: var(--iw-amber); line-height: 1.6;
    background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.2);
    border-radius: 8px; padding: 9px 14px; margin-bottom: 16px;
  }

  /* Options */
  .cl-options { display: flex; flex-direction: column; gap: 10px; }
  .cl-opt {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 16px 18px; border-radius: var(--iw-radius);
    border: 1px solid var(--iw-border); cursor: pointer; text-align: left;
    width: 100%; transition: border-color 150ms, background 150ms, transform 120ms;
    background: rgba(255,255,255,0.03);
  }
  .cl-opt:active { transform: scale(0.99); }
  .cl-opt--dark { background: var(--iw-indigo-glow); border-color: rgba(99,102,241,0.35); color: var(--iw-text); }
  .cl-opt--dark:hover { background: rgba(99,102,241,0.22); border-color: rgba(99,102,241,0.55); box-shadow: 0 4px 24px rgba(99,102,241,0.15); }
  .cl-opt-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .cl-opt-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cl-opt-icon--dark { background: rgba(99,102,241,0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(99,102,241,0.3); }
  .cl-opt-text { display: flex; flex-direction: column; gap: 3px; }
  .cl-opt-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; line-height: 1; color: var(--iw-text); }
  .cl-opt-badge {
    font-size: 9px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 99px;
    background: rgba(99,102,241,0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(99,102,241,0.35);
  }
  .cl-opt-desc { font-size: 12px; color: var(--iw-muted2); line-height: 1.5; }

  /* ─── Builder shell ─── */
  .cl-builder { font-family: var(--iw-ff-body); background: transparent; display: flex; flex-direction: column; font-weight: 400; }

  /* Topbar */
  .cl-topbar {
    display: flex; align-items: center; gap: 16px;
    background: var(--iw-surface); border: 1px solid var(--iw-border);
    border-radius: 10px 10px 0 0; color: var(--iw-text);
    padding: 12px 16px;
  }
  .cl-back {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border);
    color: var(--iw-muted2); border-radius: 8px;
    padding: 7px 12px; font-size: 12px; font-weight: 500;
    cursor: pointer; font-family: var(--iw-ff-body); flex-shrink: 0;
    transition: background 120ms, color 120ms, border-color 120ms;
  }
  .cl-back:hover { background: rgba(255,255,255,0.1); border-color: var(--iw-border2); color: var(--iw-text); }
  .cl-topbar-center { flex: 1; display: flex; flex-direction: column; }
  .cl-topbar-title { font-size: 13px; font-weight: 600; line-height: 1; color: var(--iw-text); }
  .cl-topbar-sub { font-size: 10px; color: var(--iw-muted); margin-top: 3px; letter-spacing: .05em; text-transform: uppercase; }
  .cl-topbar-steps { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .cl-step {
    width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--iw-border);
    background: var(--iw-surface2); color: var(--iw-muted); font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-step--active { border-color: var(--iw-indigo); background: var(--iw-indigo-glow); color: var(--iw-indigo-lt); }
  .cl-step--done { border-color: rgba(74,222,128,0.5); background: rgba(74,222,128,0.1); color: var(--iw-green); }
  .cl-step-line { width: 20px; height: 1px; background: var(--iw-border); }

  /* ─── Inputs body ─── */
  .cl-inputs-body {
    background: var(--iw-surface);
    border: 1px solid var(--iw-border); border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 20px;
    display: flex; flex-direction: column; gap: 20px;
  }
  .cl-section { display: flex; flex-direction: column; gap: 12px; }
  .cl-section-label {
    font-size: 10px; font-weight: 700; letter-spacing: .07em;
    text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0;
  }
  .cl-section-hint { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--iw-muted); font-size: 10px; }
  .cl-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cl-field { display: flex; flex-direction: column; gap: 5px; }
  .cl-label { font-size: 11px; font-weight: 600; color: var(--iw-muted2); display: flex; gap: 8px; align-items: center; }
  .cl-field-err { font-size: 10px; color: var(--iw-error); font-weight: 500; }
  .cl-input {
    background: var(--iw-surface2); border: 1px solid var(--iw-border);
    border-radius: 7px; padding: 8px 10px; font-size: 12px;
    color: var(--iw-text); font-family: var(--iw-ff-body);
    outline: none; transition: border-color 120ms;
  }
  .cl-input:focus { border-color: rgba(99,102,241,0.5); }
  .cl-input::placeholder { color: var(--iw-muted); }
  .cl-input--error { border-color: rgba(248,113,113,0.45); }

  /* Toggles */
  .cl-toggle-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .cl-toggle-row--sm .cl-toggle-btn { padding: 5px 10px; font-size: 11px; }
  .cl-toggle-btn {
    background: rgba(255,255,255,0.04); border: 1px solid var(--iw-border);
    border-radius: 7px; padding: 7px 14px; font-size: 12px; font-weight: 500;
    color: var(--iw-muted2); cursor: pointer; font-family: var(--iw-ff-body);
    transition: all 120ms;
  }
  .cl-toggle-btn:hover { border-color: var(--iw-border2); color: var(--iw-text); background: rgba(255,255,255,0.07); }
  .cl-toggle-btn--active { background: var(--iw-indigo-glow); border-color: rgba(99,102,241,0.5); color: var(--iw-indigo-lt); }

  /* Family ties grid */
  .cl-ties-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .cl-ties-item { display: flex; flex-direction: column; gap: 6px; }

  /* Contacts */
  .cl-contact-header {
    display: grid; grid-template-columns: 24px 1fr 1fr 1fr 1fr 28px;
    gap: 8px; padding: 0 4px; font-size: 10px; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase; color: var(--iw-muted);
  }
  .cl-contact-row {
    display: grid; grid-template-columns: 24px 1fr 1fr 1fr 1fr 28px;
    gap: 8px; align-items: center;
  }
  .cl-contact-num {
    width: 20px; height: 20px; border-radius: 50%; background: var(--iw-indigo);
    color: white; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cl-contact-field { min-width: 0; }
  .cl-add-contact {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: 1px dashed var(--iw-border);
    border-radius: 7px; padding: 7px 14px; font-size: 12px; font-weight: 500;
    color: var(--iw-muted); cursor: pointer; font-family: var(--iw-ff-body);
    transition: all 120ms; width: fit-content;
  }
  .cl-add-contact:hover { border-color: rgba(99,102,241,0.4); color: var(--iw-indigo-lt); background: var(--iw-indigo-glow); }

  /* Icon btn */
  .cl-icon-btn {
    width: 24px; height: 24px; border: 1px solid var(--iw-border);
    background: rgba(255,255,255,0.04); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--iw-muted); transition: all 100ms;
  }
  .cl-icon-btn--remove:hover { border-color: rgba(248,113,113,0.4); color: var(--iw-error); background: var(--iw-error-bg); }

  /* Save row */
  .cl-save-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }
  .cl-save-hint { font-size: 12px; color: var(--iw-muted); margin: 0; line-height: 1.5; flex: 1; }
  .cl-save-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8); color: white;
    border: none; border-radius: 8px; padding: 9px 20px; font-size: 12px; font-weight: 600;
    font-family: var(--iw-ff-body); cursor: pointer; flex-shrink: 0;
    transition: opacity 150ms, box-shadow 150ms; white-space: nowrap;
    box-shadow: 0 2px 12px rgba(99,102,241,0.3); display: flex; align-items: center; gap: 7px;
  }
  .cl-save-btn:hover:not(:disabled) { opacity: 0.88; box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
  .cl-save-btn:disabled { opacity: 0.5; cursor: default; }

  /* Spinner */
  .cl-spinner {
    width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%; animation: cl-spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes cl-spin { to { transform: rotate(360deg); } }

  /* ─── Letter body ─── */
  .cl-letter-body {
    background: var(--iw-surface); border: 1px solid var(--iw-border); border-top: none;
    border-radius: 0 0 10px 10px; padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .cl-legend { display: flex; align-items: center; gap: 6px; }
  .cl-warn-strip {
    display: flex; align-items: flex-start; gap: 8px;
    background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25);
    border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #fde68a; line-height: 1.5;
  }
  .cl-warn-strip svg { flex-shrink: 0; margin-top: 1px; color: var(--iw-amber); }

  /* Letter sheet — white paper look */
  .cl-letter-sheet {
    background: #fff; border-radius: 8px; padding: 36px 40px;
    border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 20px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; gap: 0;
    font-family: 'Times New Roman', Times, Georgia, serif; color: #1a1a1a;
  }
  /* Big centered heading */
  .cl-letter-heading {
    font-size: 16px; font-weight: 700; text-align: center;
    letter-spacing: .12em; text-decoration: underline;
    margin: 0 0 18px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  /* Address / Date — plain two-column flex, no border */
  .cl-addr-block {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 14px;
  }
  .cl-addr-left {
    font-size: 13px; line-height: 1.8; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-addr-right {
    font-size: 13px; line-height: 1.8; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif; text-align: right;
  }
  /* Subject line */
  .cl-subject { margin-bottom: 14px; }
  /* Bold underlined section headings */
  .cl-section-heading {
    font-size: 13px; font-weight: 700; text-decoration: underline;
    margin: 16px 0 8px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  /* Italic sub-headings (e.g. "My good immigration history") */
  .cl-subsection-heading {
    font-size: 13px; font-weight: 700; font-style: italic;
    margin: 12px 0 6px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  /* Bullet list */
  .cl-bullet-list {
    margin: 0 0 12px; padding-left: 22px;
    font-size: 13px; line-height: 1.85; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-bullet-list li { margin-bottom: 4px; }
  /* Appendix table */
  .cl-doc-table {
    width: 100%; border-collapse: collapse;
    margin-bottom: 16px; font-size: 13px;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-doc-th {
    border: 1px solid #999; padding: 7px 12px;
    background: #f0f0f0; font-weight: 700; text-align: left;
  }
  .cl-doc-th--num { width: 100px; text-align: center; }
  .cl-doc-td { border: 1px solid #999; padding: 7px 12px; vertical-align: top; }
  .cl-doc-td--num { text-align: center; }
  /* Contacts table */
  .cl-contacts-table {
    width: 100%; border-collapse: collapse;
    margin-bottom: 14px; font-size: 13px;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-contacts-th {
    border: 1px solid #999; padding: 7px 10px;
    background: #f0f0f0; font-weight: 700; text-align: left;
  }
  .cl-contacts-td {
    border: 1px solid #999; padding: 7px 10px;
    vertical-align: top; min-height: 28px;
  }
  .cl-letter-date { font-size: 13px; color: #555; margin: 0 0 18px; text-align: right; }
  .cl-para { font-size: 13px; line-height: 1.85; color: #1a1a1a; margin: 0 0 12px; font-family: 'Times New Roman', Times, serif; }
  .cl-para--address { font-size: 13px; line-height: 1.8; color: #1a1a1a; margin: 0 0 18px; }
  .cl-para-edit {
    width: 100%; font-size: 13px; line-height: 1.8; color: #1a1a1a;
    background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 6px;
    padding: 10px 12px; resize: vertical; font-family: 'Times New Roman', Times, serif;
    outline: none; margin: 0 0 12px; box-sizing: border-box;
  }

  /* Placeholder spans */
  .cl-ph {
    display: inline; cursor: pointer; border-radius: 3px;
    transition: background 120ms; white-space: nowrap;
  }
  .cl-ph--empty {
    background: rgba(251,191,36,0.18); border-bottom: 1.5px dashed #fbbf24;
    color: #92400e; padding: 0 3px; font-style: italic;
  }
  .cl-ph--filled {
    background: rgba(251,191,36,0.08); border-bottom: 1px solid #fbbf24;
    color: #1a1a1a; padding: 0 2px;
  }
  .cl-ph-input {
    font-size: 13px; font-family: Georgia, 'Times New Roman', serif;
    background: rgba(251,191,36,0.12); border: 1px solid #fbbf24;
    border-radius: 4px; padding: 1px 5px; color: #1a1a1a; outline: none;
  }

  /* Section meta (label + edit btn) */
  .cl-letter-section { margin-bottom: 0; }
  .cl-section-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .cl-section-tag { font-size: 9px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #999; font-family: var(--iw-ff-body); }
  .cl-edit-para-btn {
    display: flex; align-items: center; gap: 4px;
    background: transparent; border: 1px solid #e5e7eb; border-radius: 5px;
    padding: 2px 7px; font-size: 10px; font-weight: 600; color: #888;
    cursor: pointer; font-family: var(--iw-ff-body); transition: all 100ms;
  }
  .cl-edit-para-btn:hover { border-color: #fbbf24; color: #92400e; background: rgba(251,191,36,0.08); }
  .cl-sig-block { margin-top: 12px; margin-bottom: 8px; }
  .cl-sig-line { width: 180px; border-bottom: 1px solid #999; margin: 8px 0 4px; }
  .cl-sig-name { font-size: 13px; font-weight: 600; color: #1a1a1a; margin: 0 0 2px; font-family: 'Times New Roman', Times, serif; }
  .cl-sig-sub { font-size: 12px; color: #555; margin: 0 0 2px; font-family: 'Times New Roman', Times, serif; }
  .cl-sig-italic { font-style: italic; }

  /* Enclosures */
  .cl-enclosures {
    border-top: 1px solid #e5e7eb; padding-top: 14px; margin-top: 6px;
  }
  .cl-enc-label { font-size: 12px; font-weight: 700; color: #333; margin: 0 0 6px; }
  .cl-enc-list { margin: 0; padding-left: 18px; font-size: 12px; color: #555; line-height: 1.9; }

  /* Download row */
  .cl-dl-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .cl-field-row { grid-template-columns: 1fr; }
    .cl-ties-grid { grid-template-columns: 1fr 1fr; }
    .cl-contact-header { display: none; }
    .cl-contact-row { grid-template-columns: 24px 1fr 28px; }
    .cl-contact-field:nth-child(4), .cl-contact-field:nth-child(5) { grid-column: 2; }
    .cl-context-strip { grid-template-columns: repeat(2, 1fr); }
    .cl-letter-sheet { padding: 24px 18px; }
  }

  /* ─── Inline-editable letter preview ─── */

  /* Info strip */
  .cl-preview-info-strip {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.22);
    border-radius: 8px; padding: 11px 14px;
    font-size: 12px; color: var(--iw-muted2); line-height: 1.55;
  }
  .cl-preview-info-strip strong { color: var(--iw-indigo-lt); }
  .cl-preview-info-strip svg { color: var(--iw-indigo-lt); }

  /* Shared inline edit affordance */
  .cl-inline-edit-base {
    border: none; outline: none; background: transparent;
    font-family: 'Times New Roman', Times, serif; color: #1a1a1a;
    border-radius: 4px; transition: background 110ms, box-shadow 110ms;
    box-sizing: border-box;
  }
  .cl-inline-edit-base:hover { background: rgba(99,102,241,0.06); }
  .cl-inline-edit-base:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  /* Heading input */
  .cl-letter-heading-input {
    font-size: 16px; font-weight: 700; text-align: center;
    letter-spacing: .12em; text-decoration: underline;
    margin: 0 0 18px; color: #1a1a1a; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 4px 6px;
    border-radius: 4px; transition: background 110ms, box-shadow 110ms;
    box-sizing: border-box; display: block;
  }
  .cl-letter-heading-input:hover { background: rgba(99,102,241,0.06); }
  .cl-letter-heading-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  /* Address textarea */
  .cl-addr-textarea {
    font-size: 13px; line-height: 1.8; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; resize: none;
    padding: 3px 5px; border-radius: 4px; width: 55%;
    transition: background 110ms, box-shadow 110ms;
  }
  .cl-addr-textarea:hover { background: rgba(99,102,241,0.06); }
  .cl-addr-textarea:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  /* Date input */
  .cl-date-input {
    font-size: 13px; line-height: 1.8; color: #1a1a1a; text-align: right;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; width: 40%; transition: background 110ms, box-shadow 110ms;
  }
  .cl-date-input:hover { background: rgba(99,102,241,0.06); }
  .cl-date-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  /* Subject row */
  .cl-subject-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
  .cl-subject-bold { font-size: 13px; font-weight: 700; font-family: 'Times New Roman', serif; white-space: nowrap; color: #1a1a1a; }

  /* Generic inline field */
  .cl-inline-field {
    font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent;
    border-bottom: 1.5px dashed rgba(99,102,241,0.35);
    padding: 2px 4px; border-radius: 3px 3px 0 0;
    transition: border-color 110ms, background 110ms;
    min-width: 80px; width: auto;
  }
  .cl-inline-field:hover { border-bottom-color: #6366f1; background: rgba(99,102,241,0.05); }
  .cl-inline-field:focus { border-bottom-color: #6366f1; background: rgba(99,102,241,0.1); outline: none; box-shadow: none; }
  .cl-inline-field::placeholder { color: #bbb; font-style: italic; }
  .cl-inline-field--subject { flex: 1; font-weight: 700; }
  .cl-inline-field--salutation { display: block; width: 100%; margin-bottom: 10px; border-bottom-color: transparent; }
  .cl-inline-field--bullet { width: 100%; border-bottom-color: transparent; }
  .cl-inline-field--sig { font-weight: 600; min-width: 160px; }

  /* Inline paragraph textarea */
  .cl-inline-para {
    width: 100%; font-size: 13px; line-height: 1.85; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; resize: none;
    padding: 5px 6px; border-radius: 4px; margin: 0 0 10px;
    box-sizing: border-box; overflow: hidden;
    transition: background 110ms, box-shadow 110ms;
    border-left: 2px solid transparent;
  }
  .cl-inline-para:hover { background: rgba(99,102,241,0.05); border-left-color: rgba(99,102,241,0.25); }
  .cl-inline-para:focus { background: rgba(99,102,241,0.08); border-left-color: rgba(99,102,241,0.5); box-shadow: none; }

  /* Section heading inputs */
  .cl-section-heading-input {
    font-size: 13px; font-weight: 700; text-decoration: underline;
    margin: 16px 0 8px; color: #1a1a1a; display: block; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; transition: background 110ms;
    box-sizing: border-box;
  }
  .cl-section-heading-input:hover { background: rgba(99,102,241,0.06); }
  .cl-section-heading-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  .cl-subsection-heading-input {
    font-size: 13px; font-weight: 700; font-style: italic;
    margin: 12px 0 6px; color: #1a1a1a; display: block; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; transition: background 110ms; box-sizing: border-box;
  }
  .cl-subsection-heading-input:hover { background: rgba(99,102,241,0.06); }
  .cl-subsection-heading-input:focus { background: rgba(99,102,241,0.1); box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }

  /* Bullet list editable */
  .cl-bullet-list--edit { list-style: none; padding-left: 14px; }
  .cl-bullet-edit-item { display: flex; align-items: center; margin-bottom: 3px; }
  .cl-bullet-edit-item::before { content: "•"; color: #1a1a1a; margin-right: 6px; flex-shrink: 0; font-size: 13px; }

  /* Table cell input (light, on white background) */
  .cl-cell-input-light {
    width: 100%; font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 2px 4px;
    border-radius: 3px; transition: background 100ms;
    box-sizing: border-box;
  }
  .cl-cell-input-light:hover { background: rgba(99,102,241,0.07); }
  .cl-cell-input-light:focus { background: rgba(99,102,241,0.12); box-shadow: 0 0 0 2px rgba(99,102,241,0.25); }
  .cl-cell-input-light::placeholder { color: #bbb; font-style: italic; }
  .cl-doc-td--edit { padding: 5px 8px !important; }
  .cl-contacts-td--edit { padding: 5px 8px !important; }

  /* Add/remove buttons inside tables */
  .cl-cell-add-btn-light {
    font-size: 11px; font-weight: 600; color: #6366f1;
    background: rgba(99,102,241,0.07); border: 1px dashed rgba(99,102,241,0.35);
    border-radius: 4px; padding: 3px 10px; cursor: pointer;
    font-family: 'Times New Roman', Times, serif;
    transition: background 100ms; margin-top: 4px;
  }
  .cl-cell-add-btn-light:hover { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.6); }

  .cl-cell-remove-btn-light {
    width: 20px; height: 20px; border-radius: 50%; border: 1px solid #e0e0e0;
    background: #f5f5f5; font-size: 14px; line-height: 1; cursor: pointer;
    color: #999; display: flex; align-items: center; justify-content: center;
    transition: all 100ms; padding: 0;
  }
  .cl-cell-remove-btn-light:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }
`;