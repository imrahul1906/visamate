"use client";

/**
 * CoverLetterWidget.tsx (REFACTORED)
 *
 * Main orchestrator component for the Japan Visa Cover Letter builder.
 * Manages state and coordinates between input, preview, and download steps.
 *
 * Uses modular components:
 * - coverLetterInputs.tsx: Step 1 (form inputs)
 * - coverLetterPreview.tsx: Step 2 (editable letter)
 * - coverLetterComponents.tsx: UI building blocks
 * - coverLetterUtils.ts: Utilities and state seeding
 * - coverLetterTemplates.ts: Static template texts
 * - coverLetterService.ts: Business logic, validation, paragraph builders
 */

import { useState, useEffect } from "react";
import { useApplicant } from "@/lib/context/ApplicantContext";
import { CoverLetterInputsStep } from "./coverLetterInputs";
import { CoverLetterPreview } from "./coverLetterPreview";
import {
  validateCoverLetterInputs,
  validateLetterPreview,
  isSponsored as isSponsoredFn,
} from "@/features/documents/cover_letter/coverLetterService";
import { buildCoverLetterDocx } from "@/features/documents/cover_letter/coverLetterDocx";
import type {
  CoverLetterInputs,
  ValidationErrors,
  ApplicantContext as CoverLetterCtx,
} from "@/features/documents/cover_letter/coverLetterService";
import { seedLetterState, fmtDate, fmtDateEnd, today } from "./coverLetterUtils";
import { Contact } from "./coverLetterComponents";
import { STYLES } from "./coverLetterStyles";
import { COVER_LETTER_TEMPLATES } from "./coverLetterTemplates";

/* ═══════════════════════════ MAIN WIDGET ═══════════════════════════ */
export default function CoverLetterWidget({
  onDocxReady,
}: {
  /** Called after a .docx Blob is generated so the parent can track documents. */
  onDocxReady?: (file: File) => void;
}) {
  const { ctx, update } = useApplicant();
  const [step, setStep] = useState("select"); // "select" | "inputs" | "letter"

  /* ── Step 1: Collect fresh inputs ── */
  const [inputs, setInputs] = useState<CoverLetterInputs>({
    departureCity: ctx.departureCity || "",
    countriesVisited: Array.isArray(ctx.countriesVisited) ? ctx.countriesVisited : [],
    travellingWith: (ctx.travellingWith as any) || "alone",
    companion: ctx.companion || "",
    applicantProfile: ctx.applicantProfile || "",
    designation: ctx.designation || "",
    companyName: ctx.companyName || "",
    institutionName: ctx.institutionName || "",
    sponsorshipType: ctx.sponsorshipType || "",
    sponsorName: ctx.sponsorName || "",
    sponsorRel: ctx.sponsorRel || "",
    sponsorAccompanying: (ctx.sponsorAccompanying as any) || "staying",
    married: (ctx.married as any) || "no",
    parentsInIndia: (ctx.parentsInIndia as any) || "yes",
    hasChildren: (ctx.hasChildren as any) || "no",
    contacts: ctx.contacts?.length ? ctx.contacts : [{ name: "", rel: "", phone: "", email: "" }],
    purpose: ctx.purpose || "",
    hotelName: ctx.hotelName || "",
    bankBalance: "",
    hasDependant: "no" as const,
    dependantName: "",
    dependantDob: "",
    dependantPassport: "",
    dependantRelationship: "",
  });

  /* ── Step 1: Validation ── */
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attempted, setAttempted] = useState(false);

  /* ── Dependants (separate array, not stored in inputs) ── */
  const [dependants, setDependants] = useState<Array<{ name: string; relationship: string; dob: string; passport: string }>>([]);

  /* ── Step 2: Letter preview state (all l* prefixed states) ── */
  const [lHeading, setLHeading] = useState(COVER_LETTER_TEMPLATES.heading);
  const [lToBlock, setLToBlock] = useState(COVER_LETTER_TEMPLATES.toBlock);
  const [lDate, setLDate] = useState(today());
  const [lSubject, setLSubject] = useState("");
  const [lSalutation, setLSalutation] = useState(COVER_LETTER_TEMPLATES.salutation);
  const [lIntro, setLIntro] = useState("");
  const [lBullets, setLBullets] = useState<string[]>([]);
  const [lSecDocs, setLSecDocs] = useState(COVER_LETTER_TEMPLATES.secDocs);
  const [lSecDocsIntro, setLSecDocsIntro] = useState(COVER_LETTER_TEMPLATES.secDocsIntro);
  const [lDocRows, setLDocRows] = useState<string[]>([]);
  const [lSecPurpose, setLSecPurpose] = useState(COVER_LETTER_TEMPLATES.secPurpose);
  const [lSecPurposeIntro, setLSecPurposeIntro] = useState(COVER_LETTER_TEMPLATES.secPurposeIntro);
  const [lPurposeDetail, setLPurposeDetail] = useState("");
  const [lFlightPara, setLFlightPara] = useState("");
  const [lSecOverstay, setLSecOverstay] = useState(COVER_LETTER_TEMPLATES.secOverstay);
  const [lSecOverstayIntro, setLSecOverstayIntro] = useState(COVER_LETTER_TEMPLATES.secOverstayIntro);
  const [lSecImmigration, setLSecImmigration] = useState(COVER_LETTER_TEMPLATES.secImmigration);
  const [lImmigration, setLImmigration] = useState("");
  const [lSecFamily, setLSecFamily] = useState(COVER_LETTER_TEMPLATES.secFamily);
  const [lFamilyTies, setLFamilyTies] = useState("");
  const [lSecEconomic, setLSecEconomic] = useState(COVER_LETTER_TEMPLATES.secEconomic);
  const [lEconomicTies, setLEconomicTies] = useState("");
  const [lSecFinance, setLSecFinance] = useState(COVER_LETTER_TEMPLATES.secFinance);
  const [lSecFinanceIntro, setLSecFinanceIntro] = useState(COVER_LETTER_TEMPLATES.secFinanceIntro);
  const [lSecIncome, setLSecIncome] = useState(COVER_LETTER_TEMPLATES.secIncome);
  const [lIncomeContent, setLIncomeContent] = useState("");
  const [lSecAssets, setLSecAssets] = useState(COVER_LETTER_TEMPLATES.secAssets);
  const [lAssetsContent, setLAssetsContent] = useState("");
  const [lFinance, setLFinance] = useState("");
  const [lSecSponsor, setLSecSponsor] = useState(COVER_LETTER_TEMPLATES.secSponsor);
  const [lSponsor, setLSponsor] = useState("");
  const [lSecDependant, setLSecDependant] = useState("Information Relating to the Dependants Applying with Me");
  const [lDependant, setLDependant] = useState("");
  const [lSecContacts, setLSecContacts] = useState(COVER_LETTER_TEMPLATES.secContacts);
  const [lContactsNote, setLContactsNote] = useState(COVER_LETTER_TEMPLATES.contactsNote);
  const [lContacts, setLContacts] = useState<Contact[]>([]);
  const [lClosing, setLClosing] = useState(COVER_LETTER_TEMPLATES.closing);
  const [lSigName, setLSigName] = useState("");
  const [lSigPassport, setLSigPassport] = useState("");

  /* ── Download state ── */
  const [downloading, setDownloading] = useState(false);
  const [unfilled, setUnfilled] = useState<string[]>([]);

  /* ── Re-sync local state whenever context fields change ── */
  const { applicantProfile, sponsorshipType } = ctx;

  const reseedFromContext = () => {
    if (step === "letter") return;
    setInputs({
      departureCity: ctx.departureCity || "",
      countriesVisited: Array.isArray(ctx.countriesVisited) ? ctx.countriesVisited : [],
      travellingWith: (ctx.travellingWith as any) || "alone",
      companion: ctx.companion || "",
      applicantProfile: ctx.applicantProfile || "",
      designation: ctx.designation || "",
      companyName: ctx.companyName || "",
      institutionName: ctx.institutionName || "",
      sponsorshipType: ctx.sponsorshipType || "",
      sponsorName: ctx.sponsorName || "",
      sponsorRel: ctx.sponsorRel || "",
      sponsorAccompanying: (ctx.sponsorAccompanying as any) || "staying",
      married: (ctx.married as any) || "no",
      parentsInIndia: (ctx.parentsInIndia as any) || "yes",
      hasChildren: (ctx.hasChildren as any) || "no",
      contacts: ctx.contacts?.length ? ctx.contacts : inputs.contacts,
      purpose: ctx.purpose || "",
      hotelName: ctx.hotelName || "",
      bankBalance: inputs.bankBalance,
      hasDependant: inputs.hasDependant,
      dependantName: "",
      dependantDob: "",
      dependantPassport: "",
      dependantRelationship: "",
    });
  };

  useEffect(reseedFromContext, []);
  useEffect(reseedFromContext, [applicantProfile, sponsorshipType]);

  /* ── Handle input changes ── */
  function handleInputChange(key: keyof CoverLetterInputs, value: any) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    if (attempted) {
      const e = validateCoverLetterInputs({ ...inputs, [key]: value });
      setErrors(e);
    }
  }

  /* ── Proceed to preview ── */
  function handleProceed() {
    setAttempted(true);
    const e = validateCoverLetterInputs(inputs);
    setErrors(e);

    if (Object.keys(e).length === 0) {
      // Write inputs back to context
      update({
        departureCity: inputs.departureCity,
        countriesVisited: inputs.countriesVisited,
        travellingWith: inputs.travellingWith,
        companion: inputs.companion,
        designation: inputs.designation,
        companyName: inputs.companyName,
        institutionName: inputs.institutionName,
        sponsorName: inputs.sponsorName,
        sponsorRel: inputs.sponsorRel,
        sponsorAccompanying: inputs.sponsorAccompanying,
        married: inputs.married,
        parentsInIndia: inputs.parentsInIndia,
        hasChildren: inputs.hasChildren,
        contacts: inputs.contacts,
        hotelName: inputs.hotelName,
        bankBalance: inputs.bankBalance,
        purpose: inputs.purpose,
        hasDependant: inputs.hasDependant,
        dependantName: inputs.dependantName,
        dependantDob: inputs.dependantDob,
        dependantPassport: inputs.dependantPassport,
        dependantRelationship: inputs.dependantRelationship,
      });

      // Seed letter preview state
      const seeded = seedLetterState(inputs, makeCtx(), dependants);
      setLHeading(seeded.lHeading as string);
      setLDate(seeded.lDate as string);
      setLSubject(seeded.lSubject as string);
      setLIntro(seeded.lIntro as string);
      setLPurposeDetail(seeded.lPurposeDetail as string);
      setLFlightPara(seeded.lFlightPara as string);
      setLImmigration(seeded.lImmigration as string);
      setLFamilyTies(seeded.lFamilyTies as string);
      setLEconomicTies(seeded.lEconomicTies as string);
      setLIncomeContent(seeded.lIncomeContent as string);
      setLAssetsContent(seeded.lAssetsContent as string);
      setLFinance(seeded.lFinance as string);
      setLSponsor(seeded.lSponsor as string);
      setLDependant(seeded.lDependant as string);
      setLSecDependant(seeded.lSecDependant as string);
      setLSigName(seeded.lSigName as string);
      setLSigPassport(seeded.lSigPassport as string);
      setLSecDocsIntro(seeded.lSecDocsIntro as string);
      setLSecPurposeIntro(seeded.lSecPurposeIntro as string);
      setLSecOverstayIntro(seeded.lSecOverstayIntro as string);
      setLSecFinanceIntro(seeded.lSecFinanceIntro as string);
      setLDocRows(seeded.lDocRows as string[]);
      setLBullets(seeded.lBullets as string[]);
      setLContacts(inputs.contacts.length ? inputs.contacts : [{ name: "", rel: "", phone: "", email: "" }]);
      setLContactsNote(seeded.lContactsNote as string);

      setStep("letter");
    }
  }

  /* ── Build context for letter builders ── */
  function makeCtx(): CoverLetterCtx {
    return {
      applicantName: ctx.applicantName || "",
      passportNo: ctx.passportNo || "",
      travelStartDate: ctx.travelStartDate || "",
      travelDuration: ctx.travelDuration || 0,
      cities: ctx.cities ?? [],
      applicantProfile: ctx.applicantProfile || "",
      sponsorshipType: ctx.sponsorshipType || "",
      visaType: ctx.visaType || "",
      visaTypeName: ctx.visaTypeName || "",
      country: ctx.country || "",
      vfsCenter: ctx.vfsCenter || "",
    };
  }

  /* ── Download handler ── */
  async function handleDownload() {
    const missing = validateLetterPreview({ lPurposeDetail, lFinance, lSigName, lSigPassport });
    if (missing.length > 0) {
      setUnfilled(missing);
      return;
    }
    setUnfilled([]);
    setDownloading(true);

    try {
      const blob = await buildCoverLetterDocx({
        lHeading, lToBlock, lDate, lSubject, lSalutation, lIntro, lBullets,
        lSecDocs, lSecDocsIntro, lDocRows,
        lSecPurpose, lSecPurposeIntro, lPurposeDetail, lFlightPara,
        lSecOverstay, lSecOverstayIntro,
        lSecImmigration, lImmigration,
        lSecFamily, lFamilyTies,
        lSecEconomic, lEconomicTies,
        lSecFinance, lSecFinanceIntro, lSecIncome, lIncomeContent, lSecAssets, lAssetsContent, lFinance,
        lSecSponsor, lSponsor,
        lSecDependant, lDependant,
        lSecContacts, lContactsNote, lContacts,
        lClosing, lSigName, lSigPassport,
        sponsorshipType: ctx.sponsorshipType,
        hasDependant: inputs.hasDependant,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Japan_Visa_Cover_Letter_${(lSigName || ctx.applicantName || "applicant").replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const filename = `Japan_Visa_Cover_Letter_${(lSigName || ctx.applicantName || "applicant").replace(/\s+/g, "_")}.docx`;
      onDocxReady?.(new File([blob], filename, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }));

      setStep("select");
    } finally {
      setDownloading(false);
    }
  }

  /* ── RENDER ── */
  return (
    <>
      <style>{STYLES}</style>

      {/* SELECT SCREEN */}
      {step === "select" && (
        <div className="cl-select">
          <div className="cl-select-inner">
            <p className="cl-eyebrow">Japan Visa Documents</p>
            <h2 className="cl-select-title">Cover Letter Generator</h2>
            <p className="cl-select-sub">
              We'll pre-fill everything we already know — name, dates, cities, passport — and ask only for what's missing.
              Takes under 2 minutes.
            </p>

            {/* Summary */}
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
                  {ctx.sponsorshipType === "sponsored"
                    ? "Sponsored"
                    : ctx.sponsorshipType === "self"
                      ? "Self-funded"
                      : "Not filled yet"}
                </span>
              </div>
            </div>

            {(!ctx.applicantName || !ctx.travelStartDate || !ctx.applicantProfile) && (
              <p className="cl-context-hint">
                ⚠ Some fields are missing above — fill them in the Itinerary and Trip Details steps first. You can still
                continue and the letter will use placeholders.
              </p>
            )}

            <div className="cl-options">
              <button className="cl-opt cl-opt--dark" onClick={() => setStep("inputs")}>
                <div className="cl-opt-left">
                  <div className="cl-opt-icon cl-opt-icon--dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="cl-opt-text">
                    <span className="cl-opt-title">
                      Build Cover Letter<span className="cl-opt-badge">Recommended</span>
                    </span>
                    <span className="cl-opt-desc">Answer a few quick questions, then get an editable pre-filled letter ready to download.</span>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INPUTS PANEL (Step 1) */}
      {step === "inputs" && (
        <div className="cl-builder">
          <CoverLetterInputsStep
            inputs={inputs}
            errors={errors}
            attempted={attempted}
            applicantProfile={ctx.applicantProfile}
            sponsorshipType={ctx.sponsorshipType}
            contacts={inputs.contacts}
            onChange={handleInputChange}
            onAddContact={() => setInputs((p) => ({ ...p, contacts: [...p.contacts, { name: "", rel: "", phone: "", email: "" }] }))}
            onUpdateContact={(idx, c) => setInputs((p) => ({ ...p, contacts: p.contacts.map((x, j) => (j === idx ? c : x)) }))}
            onRemoveContact={(idx) => setInputs((p) => ({ ...p, contacts: p.contacts.filter((_, j) => j !== idx) }))}
            onProceed={handleProceed}
            onBack={() => setStep("select")}
            hasDependant={inputs.hasDependant}
            dependants={dependants}
            onAddDependant={() => setDependants((prev) => [...prev, { name: "", relationship: "", dob: "", passport: "" }])}
            onUpdateDependant={(idx, d) => setDependants((prev) => prev.map((x, j) => (j === idx ? d : x)))}
            onRemoveDependant={(idx) => setDependants((prev) => prev.filter((_, j) => j !== idx))}
            onAddCountryVisit={() =>
              setInputs((p) => ({
                ...p,
                countriesVisited: [...(Array.isArray(p.countriesVisited) ? p.countriesVisited : []), { country: "", month: "" }],
              }))
            }
            onUpdateCountryVisit={(idx, v) =>
              setInputs((p) => ({
                ...p,
                countriesVisited: (Array.isArray(p.countriesVisited) ? p.countriesVisited : []).map((x, j) =>
                  j === idx ? v : x
                ),
              }))
            }
            onRemoveCountryVisit={(idx) =>
              setInputs((p) => ({
                ...p,
                countriesVisited: (Array.isArray(p.countriesVisited) ? p.countriesVisited : []).filter(
                  (_, j) => j !== idx
                ),
              }))
            }
          />
        </div>
      )}

      {/* LETTER PREVIEW (Step 2) */}
      {step === "letter" && (
        <div className="cl-builder">
          <CoverLetterPreview
            lHeading={lHeading}
            setLHeading={setLHeading}
            lToBlock={lToBlock}
            setLToBlock={setLToBlock}
            lDate={lDate}
            setLDate={setLDate}
            lSubject={lSubject}
            setLSubject={setLSubject}
            lSalutation={lSalutation}
            setLSalutation={setLSalutation}
            lIntro={lIntro}
            setLIntro={setLIntro}
            lBullets={lBullets}
            setLBullets={setLBullets}
            lSecDocs={lSecDocs}
            setLSecDocs={setLSecDocs}
            lSecDocsIntro={lSecDocsIntro}
            setLSecDocsIntro={setLSecDocsIntro}
            lDocRows={lDocRows}
            setLDocRows={setLDocRows}
            lSecPurpose={lSecPurpose}
            setLSecPurpose={setLSecPurpose}
            lSecPurposeIntro={lSecPurposeIntro}
            setLSecPurposeIntro={setLSecPurposeIntro}
            lPurposeDetail={lPurposeDetail}
            setLPurposeDetail={setLPurposeDetail}
            lFlightPara={lFlightPara}
            setLFlightPara={setLFlightPara}
            lSecOverstay={lSecOverstay}
            setLSecOverstay={setLSecOverstay}
            lSecOverstayIntro={lSecOverstayIntro}
            setLSecOverstayIntro={setLSecOverstayIntro}
            lSecImmigration={lSecImmigration}
            setLSecImmigration={setLSecImmigration}
            lImmigration={lImmigration}
            setLImmigration={setLImmigration}
            lSecFamily={lSecFamily}
            setLSecFamily={setLSecFamily}
            lFamilyTies={lFamilyTies}
            setLFamilyTies={setLFamilyTies}
            lSecEconomic={lSecEconomic}
            setLSecEconomic={setLSecEconomic}
            lEconomicTies={lEconomicTies}
            setLEconomicTies={setLEconomicTies}
            lSecFinance={lSecFinance}
            setLSecFinance={setLSecFinance}
            lSecFinanceIntro={lSecFinanceIntro}
            setLSecFinanceIntro={setLSecFinanceIntro}
            lSecIncome={lSecIncome}
            setLSecIncome={setLSecIncome}
            lIncomeContent={lIncomeContent}
            setLIncomeContent={setLIncomeContent}
            lSecAssets={lSecAssets}
            setLSecAssets={setLSecAssets}
            lAssetsContent={lAssetsContent}
            setLAssetsContent={setLAssetsContent}
            lFinance={lFinance}
            setLFinance={setLFinance}
            lSecSponsor={lSecSponsor}
            setLSecSponsor={setLSecSponsor}
            lSponsor={lSponsor}
            setLSponsor={setLSponsor}
            lSecDependant={lSecDependant}
            setLSecDependant={setLSecDependant}
            lDependant={lDependant}
            setLDependant={setLDependant}
            lSecContacts={lSecContacts}
            setLSecContacts={setLSecContacts}
            lContactsNote={lContactsNote}
            setLContactsNote={setLContactsNote}
            lContacts={lContacts}
            setLContacts={setLContacts}
            lClosing={lClosing}
            setLClosing={setLClosing}
            lSigName={lSigName}
            setLSigName={setLSigName}
            lSigPassport={lSigPassport}
            setLSigPassport={setLSigPassport}
            onBack={() => setStep("inputs")}
            onDownload={handleDownload}
            downloading={downloading}
            unfilled={unfilled}
            sponsorshipType={ctx.sponsorshipType}
            applicantProfile={ctx.applicantProfile}
            hasDependant={inputs.hasDependant}
          />
        </div>
      )}
    </>
  );
}