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
  buildIntroParag,
  buildPurposeParag,
  buildFinanceParag,
  buildImmigrationParag,
  buildTiesParag,
  buildSponsorParag,
  buildContactsParag,
  buildLetterBody,
  buildPlainText,
  isSponsored as isSponsoredFn,
  isEmployed as isEmployedFn,
  isStudent as isStudentFn,
} from "@/services/coverLetterService";
import type { CoverLetterInputs, ApplicantContext as CoverLetterCtx } from "@/services/coverLetterService";

/* ─────────────────────────── PLACEHOLDER SPAN ─────────────────────────── */
function PH({ id, value, onChange, width = 140 }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef();
  const isEmpty = !value || value.trim() === "";

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={ref}
        className="cl-ph-input"
        style={{ width }}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => { if (e.key === "Enter") setEditing(false); }}
      />
    );
  }

  return (
    <span
      className={`cl-ph${isEmpty ? " cl-ph--empty" : " cl-ph--filled"}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {isEmpty ? `[${id}]` : value}
    </span>
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

/* ─────────────────────────── LETTER PARAGRAPH ─────────────────────────── */
function LetterPara({ children, editable, value, onChange }) {
  if (editable) {
    return (
      <textarea
        className="cl-para-edit"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
      />
    );
  }
  return <p className="cl-para">{children}</p>;
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
    // Simulate DOCX generation delay (replace with actual docx skill call)
    await new Promise(r => setTimeout(r, 1800));
    setDownloading(false);
    // Trigger browser download with a placeholder
    const blob = new Blob([buildPlainText(makeInputs(), makeCtx())], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Japan_Visa_Cover_Letter_${ctx.applicantName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

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
              Back
            </button>
            <div className="cl-topbar-center">
              <span className="cl-topbar-title">Cover Letter Preview</span>
              <span className="cl-topbar-sub">Step 2 of 2 — click highlighted fields to edit</span>
            </div>
            <div className="cl-topbar-steps">
              <span className="cl-step cl-step--done">✓</span>
              <span className="cl-step-line"/>
              <span className="cl-step cl-step--active">2</span>
            </div>
          </div>

          <div className="cl-letter-body">

            {/* Legend */}
            <div className="cl-legend">
              <span className="cl-ph cl-ph--empty" style={{ pointerEvents: "none", fontSize: 11 }}>[field]</span>
              <span style={{ fontSize: 11, color: "var(--iw-muted2)" }}>= click to fill in</span>
              <span style={{ fontSize: 11, color: "var(--iw-muted)", marginLeft: 12 }}>·</span>
              <span style={{ fontSize: 11, color: "var(--iw-muted2)", marginLeft: 12 }}>Paragraphs are directly editable</span>
            </div>

            {/* Unfilled warning */}
            {unfilled.length > 0 && (
              <div className="cl-warn-strip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>Please fill in before downloading: <strong>{unfilled.join(", ")}</strong></span>
              </div>
            )}

            {/* ─── THE LETTER ─── */}
            <div className="cl-letter-sheet">

              {/* COVER LETTER heading */}
              <p className="cl-letter-heading">COVER LETTER</p>

              {/* To / Date — no border box, clean layout */}
              <div className="cl-addr-block">
                <div className="cl-addr-left">
                  To,<br/>
                  The Visa Officer,<br/>
                  Embassy of Japan,<br/>
                  Delhi, India
                </div>
                <div className="cl-addr-right">
                  Date: {today()}
                </div>
              </div>

              {/* Subject */}
              <p className="cl-para cl-subject">
                <strong>Subject: Application for Japan Temporary Visitor Visa (Tourism) —{" "}
                <PH id="applicant name" value={ctx.applicantName} onChange={() => {}} width={200}/></strong>
              </p>

              {/* Salutation */}
              <p className="cl-para">To whom it may concern,</p>

              {/* Intro paragraph */}
              <p className="cl-para">
                My name is{" "}<PH id="full name" value={ctx.applicantName} onChange={() => {}} width={180}/>{" "}and I am from India. I am applying from India and I am applying for a Temporary Visitor Visa for Tourism.
                In discussing that I am a genuine and credible applicant for a Japan Tourism Visa, this letter will cover;
              </p>

              {/* Bullet overview */}
              <ul className="cl-bullet-list">
                <li>A list of the supporting documents that I am submitting to support my application</li>
                <li>The purpose of my visit</li>
                <li>The reasons why I will comply with the terms of my visa and why I will not overstay</li>
                <li>My ability to adequately maintain myself during my intended trip</li>
                {isSponsored && <li>Information relating to my sponsor</li>}
                <li>Contact details of other relevant persons you may wish to contact</li>
              </ul>

              {/* List of Supporting Documents */}
              <p className="cl-section-heading">List of Supporting Documents</p>
              <p className="cl-para">In support of my temporary visitor visa for tourism application, I have included the following documents</p>

              <table className="cl-doc-table">
                <thead>
                  <tr>
                    <th className="cl-doc-th cl-doc-th--num">Appendix</th>
                    <th className="cl-doc-th">Document</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num">1</td>
                    <td className="cl-doc-td">Copy of my passport</td>
                  </tr>
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num">2</td>
                    <td className="cl-doc-td">Travel itinerary</td>
                  </tr>
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num">3</td>
                    <td className="cl-doc-td">Financial evidence {!isSponsored ? "(bank statements)" : "(sponsor's financial records)"}</td>
                  </tr>
                  {isEmployed && (
                    <tr>
                      <td className="cl-doc-td cl-doc-td--num">4</td>
                      <td className="cl-doc-td">No Objection Certificate (NOC) from employer</td>
                    </tr>
                  )}
                  {isStudent && (
                    <tr>
                      <td className="cl-doc-td cl-doc-td--num">4</td>
                      <td className="cl-doc-td">No Objection Certificate (NOC) from institution</td>
                    </tr>
                  )}
                  {isSponsored && (
                    <tr>
                      <td className="cl-doc-td cl-doc-td--num">{isEmployed || isStudent ? 5 : 4}</td>
                      <td className="cl-doc-td">Letter of consent and sponsorship from my {sponsorRel || "sponsor"} and his/her financial evidence</td>
                    </tr>
                  )}
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num">{isSponsored ? (isEmployed || isStudent ? 6 : 5) : (isEmployed || isStudent ? 5 : 4)}</td>
                    <td className="cl-doc-td">Onward and Return Air tickets</td>
                  </tr>
                  <tr>
                    <td className="cl-doc-td cl-doc-td--num">{isSponsored ? (isEmployed || isStudent ? 7 : 6) : (isEmployed || isStudent ? 6 : 5)}</td>
                    <td className="cl-doc-td">Hotel Bookings</td>
                  </tr>
                </tbody>
              </table>

              {/* Purpose of Visit */}
              <p className="cl-section-heading">The Purpose of my Visit</p>
              <p className="cl-para">The purpose of my visit:</p>
              <ul className="cl-bullet-list">
                <li>
                  To explore the beautiful country including{" "}
                  {(ctx.cities || []).join(", ") || "[Cities]"} and visit the tourist spots.{" "}
                  <PH id="additional purpose" value={purpose} onChange={setPurpose} width={280}/>
                </li>
                {travellingWith === "with" && companion && (
                  <li>To accompany my {companion} who will also be travelling on the same dates and has applied for a tourist visa.</li>
                )}
              </ul>
              <p className="cl-para">
                I will fly from <strong>{departureCity || "[Departure City]"}</strong>, India on <em>{fmtDate(ctx.travelStartDate)}</em> and
                land in {(ctx.cities && ctx.cities[0]) || "[City]"} on <em>{fmtDate(ctx.travelStartDate)}</em>. I will explore the country
                for <strong>{ctx.travelDuration} days</strong> and leave on <em>{fmtDateEnd(ctx.travelStartDate, ctx.travelDuration)}</em> for India.
              </p>
              <p className="cl-para">Complete travel itinerary has been attached.</p>

              {/* Why I will not overstay */}
              <p className="cl-section-heading">Why I will not overstay the temporary visitor visa for tourism</p>
              <p className="cl-para">
                I fully intend to return to India before my Japan visitor visa expires. I have a good life back home and have no reason or
                intention to overstay. The following are the reasons that I would like you to consider when deciding my application:
              </p>

              <p className="cl-subsection-heading">My good immigration history</p>
              <LetterSection
                label="Immigration history"
                initial={buildImmigrationParag(makeInputs())}
              />

              <p className="cl-subsection-heading">Family ties to my home country</p>
              <LetterSection
                label="Family ties"
                initial={(() => {
                  const family = [];
                  if (married === "yes") family.push("spouse");
                  if (parentsInIndia === "yes") family.push("parents");
                  if (hasChildren === "yes") family.push("children");
                  return family.length > 0
                    ? `I have my ${family.join(", ")} back home in India, which is another indication that I will return to my home country prior to my visa expiring.`
                    : "I have family back home in India which is another indication that I will return to my home country prior to my visa expiring.";
                })()}
              />

              <p className="cl-subsection-heading">Financial and economic ties to my home country</p>
              <LetterSection
                label="Economic ties"
                initial={(() => {
                  if (isEmployed) return `I am currently employed as ${designation || "[Designation]"} at ${companyName || "[Company Name]"}. My employment is a strong tie to India and demonstrates my intention to return. A No Objection Certificate from my employer confirming my leave approval is enclosed.`;
                  if (isStudent) return `I am currently enrolled as a student at ${institutionName || "[Institution Name]"}. My studies are a strong tie to India and demonstrate my intention to return. A No Objection Certificate from my institution is enclosed.`;
                  return "I have strong financial and economic ties to India which demonstrate my intention to return.";
                })()}
              />

              {/* Financial ability */}
              <p className="cl-section-heading">My ability to adequately maintain myself during my visit to Japan</p>

              {!isSponsored ? (
                <>
                  <p className="cl-para">I confirm that I can adequately maintain myself. To support this, my sources of income and financial assets are highlighted below.</p>
                  <p className="cl-subsection-heading">My sources of income</p>
                  <LetterSection
                    label="Financial means"
                    renderWith={({ PlaceholderSet }) => (
                      <>
                        My bank account reflects a balance of{" "}
                        <PH id="bank balance e.g. ₹3,50,000" value={bankBalance} onChange={setBankBalance} width={220}/>,
                        which is sufficient to cover all travel, accommodation, and living expenses during my stay.
                        I will be staying at <PH id="hotel name" value={hotelName} onChange={setHotelName} width={180}/> during my visit.
                        Relevant bank statements are enclosed for your reference.
                      </>
                    )}
                  />
                </>
              ) : (
                <>
                  <p className="cl-para">
                    I confirm that my <strong>{sponsorRel || "[Relationship]"}</strong>{" "}
                    {sponsorAccompanying === "accompanying" ? "who is accompanying me in this trip" : ""}{" "}
                    will sponsor and bear all the cost incurred in this trip. I have attached the consent letter from them.
                    I have also attached their financial records.
                  </p>
                  <p className="cl-subsection-heading">My sponsor</p>
                  <LetterSection
                    label="Sponsor details"
                    initial={buildSponsorParag(makeInputs())}
                  />
                </>
              )}

              {/* Contacts table */}
              <p className="cl-section-heading">Relevant contact details</p>
              <p className="cl-para">
                It is appreciated that you may want to contact my family and friends in order to verify my intentions.
                If you would like to do so, the following are some useful contact details:
              </p>

              <table className="cl-contacts-table">
                <thead>
                  <tr>
                    <th className="cl-contacts-th">Name</th>
                    <th className="cl-contacts-th">Relationship to me</th>
                    <th className="cl-contacts-th">Phone number</th>
                    <th className="cl-contacts-th">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={i}>
                      <td className="cl-contacts-td">{c.name || ""}</td>
                      <td className="cl-contacts-td">{c.rel || ""}</td>
                      <td className="cl-contacts-td">{c.phone || ""}</td>
                      <td className="cl-contacts-td">{c.email || ""}</td>
                    </tr>
                  ))}
                  {contacts.length < 3 && Array.from({ length: 3 - contacts.length }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="cl-contacts-td">&nbsp;</td>
                      <td className="cl-contacts-td">&nbsp;</td>
                      <td className="cl-contacts-td">&nbsp;</td>
                      <td className="cl-contacts-td">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="cl-para" style={{ marginTop: 12 }}>
                If you would like to contact any other individuals or organisations and I have not provided their contact details,
                please feel free to get in touch and I will be more than happy to provide them for you.
              </p>

              <p className="cl-para">Finally, I can confirm that the information provided above is true to the best of my knowledge and belief.</p>

              {/* Closing */}
              <p className="cl-para" style={{ marginTop: 16 }}>Your faithfully,</p>

              {/* Signature block */}
              <div className="cl-sig-block">
                <p className="cl-sig-name">{ctx.applicantName} &nbsp;&nbsp;&nbsp; (Passport No. — {ctx.passportNo})</p>
                <div className="cl-sig-line"/>
                <p className="cl-sig-sub cl-sig-italic">Signature</p>
              </div>

            </div>{/* /letter-sheet */}

            {/* Download row */}
            <div className="cl-dl-row">
              <p className="cl-save-hint">Review all highlighted fields above, then download your .docx.</p>
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

/* ─────────────────────────── LETTER SECTION (editable paragraph) ─────────────────────────── */
function LetterSection({ label, initial, renderWith }) {
  const [text, setText] = useState(initial || "");
  const [editMode, setEditMode] = useState(false);

  const PlaceholderSet = ({ id }) => {
    // placeholder support inside renderWith
    return <span className="cl-ph cl-ph--empty">[{id}]</span>;
  };

  return (
    <div className="cl-letter-section">
      <div className="cl-section-meta">
        <span className="cl-section-tag">{label}</span>
        {!renderWith && (
          <button className="cl-edit-para-btn" onClick={() => setEditMode(e => !e)}>
            {editMode ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            )}
            {editMode ? "Done" : "Edit"}
          </button>
        )}
      </div>
      {renderWith ? (
        <p className="cl-para">{renderWith({ PlaceholderSet })}</p>
      ) : editMode ? (
        <textarea className="cl-para-edit" value={text} onChange={e => setText(e.target.value)} rows={5}/>
      ) : (
        <p className="cl-para" onClick={() => setEditMode(true)} style={{ cursor: "text" }}>{text}</p>
      )}
    </div>
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
`;