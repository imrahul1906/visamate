"use client";

/**
 * coverLetterInputs.tsx
 *
 * Step 1 of the cover letter builder — collects user inputs.
 * Returns when user clicks "Preview Letter".
 */

import React, { useState } from "react";
import { Contact, ContactRow, CountryVisit, CountryVisitRow } from "./LetterFormFields";
import type { CoverLetterInputs, ValidationErrors } from "./letterValidation";
import { isEmployed, isStudent, isSponsored } from "./letterValidation";
import { validators, validateContact } from "@/lib/utils/validators";

export interface CoverLetterInputsStepProps {
  inputs: CoverLetterInputs;
  errors: ValidationErrors;
  attempted: boolean;
  applicantProfile?: string;
  sponsorshipType?: string;
  contacts: Contact[];
  onChange: <K extends keyof CoverLetterInputs>(key: K, value: CoverLetterInputs[K]) => void;
  onBlur?: <K extends keyof CoverLetterInputs>(key: K, value: CoverLetterInputs[K]) => void;
  onAddContact: () => void;
  onUpdateContact: (idx: number, contact: Contact) => void;
  onRemoveContact: (idx: number) => void;
  onProceed: () => void;
  onBack: () => void;
  dependants: Dependant[];
  onAddDependant: () => void;
  onUpdateDependant: (idx: number, d: Dependant) => void;
  onRemoveDependant: (idx: number) => void;
  // Country visits
  onAddCountryVisit: () => void;
  onUpdateCountryVisit: (idx: number, v: CountryVisit) => void;
  onRemoveCountryVisit: (idx: number) => void;
}

export interface Dependant {
  name: string;
  relationship: string;
  dob: string;
  passport: string;
}

export function CoverLetterInputsStep({
  inputs,
  errors,
  attempted,
  applicantProfile,
  sponsorshipType,
  contacts,
  onChange,
  onBlur,
  onAddContact,
  onUpdateContact,
  onRemoveContact,
  onProceed,
  onBack,
  dependants,
  onAddDependant,
  onUpdateDependant,
  onRemoveDependant,
  onAddCountryVisit,
  onUpdateCountryVisit,
  onRemoveCountryVisit,
}: CoverLetterInputsStepProps) {
  const isEmp = isEmployed(applicantProfile || "");
  const isStu = isStudent(applicantProfile || "");
  const isSpon = isSponsored(sponsorshipType || "");

  // Per-field inline validation (shown on blur, cleared on fix)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [contactErrors, setContactErrors] = useState<Array<{ phone?: string; email?: string }>>([]);

  function validateField(name: string, value: string) {
    let err: string | null = null;
    if (name === "departureCity") err = validators.city.validate(value);
    if (name === "designation") err = validators.nameOnly.validate(value);
    if (name === "institutionName") err = validators.nameOnly.validate(value);
    if (name === "sponsorName") err = validators.nameOnly.validate(value);
    if (name === "sponsorPassport") err = validators.passport.validate(value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  }

  function validateContactField(idx: number, contact: Contact) {
    const errs = validateContact(contact);
    setContactErrors((prev) => {
      const next = [...prev];
      next[idx] = errs;
      return next;
    });
  }

  // Wrap onProceed so we can scroll to the first visible error
  function handleProceedWithScroll() {
    onProceed();
    // Give React a tick to set errors, then scroll to first error field
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(".cl-input--error, .cl-field-err");
      if (el) {
        const field = el.closest(".cl-field") || el;
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const countryVisits: CountryVisit[] = Array.isArray(inputs.countriesVisited)
    ? inputs.countriesVisited
    : [];

  return (
    <>
      {/* Topbar */}
      <div className="cl-topbar">
        <button className="cl-back" onClick={onBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="cl-topbar-center">
          <span className="cl-topbar-title">Quick Details</span>
          <span className="cl-topbar-sub">Step 1 of 2 — takes ~2 minutes</span>
        </div>
        <div className="cl-topbar-steps">
          <span className="cl-step cl-step--active">1</span>
          <span className="cl-step-line" />
          <span className="cl-step">2</span>
        </div>
      </div>

      <div className="cl-inputs-body">
        {/* Travel */}
        <div className="cl-section">
          <p className="cl-section-label">Travel</p>

          {/* Travel row: Departure city | Travelling toggle | Companion (3-col) */}
          <div className="cl-travel-row">
            {/* Col 1 — Departure city */}
            <div className="cl-field">
              <label className="cl-label">
                Departure city in India<span className="cl-required">*</span>
                {(attempted && errors.departureCity || fieldErrors.departureCity) && (
                  <span className="cl-field-err">{errors.departureCity || fieldErrors.departureCity}</span>
                )}
              </label>
              <input
                className={`cl-input${(attempted && errors.departureCity) || fieldErrors.departureCity ? " cl-input--error" : ""}`}
                placeholder="e.g. New Delhi"
                value={inputs.departureCity}
                onChange={(e) => onChange("departureCity", e.target.value)}
                onBlur={(e) => {
                  validateField("departureCity", e.target.value);
                  onBlur?.("departureCity", e.target.value);
                }}
              />
            </div>

            {/* Col 2 — Alone / With someone */}
            <div className="cl-field">
              <label className="cl-label">Travelling</label>
              <div className="cl-toggle-row">
                {(["alone", "with"] as const).map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.travellingWith === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("travellingWith", v)}
                  >
                    {v === "alone" ? "Alone" : "With someone"}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3 — Companion (only visible when "with" is selected) */}
            <div className={`cl-field cl-companion-col${inputs.travellingWith === "with" ? " cl-companion-col--visible" : ""}`}>
              <label className="cl-label">
                Travelling with
                {attempted && errors.companion && (
                  <span className="cl-field-err">{errors.companion}</span>
                )}
              </label>
              <div className="cl-toggle-row">
                {["mother", "father", "spouse"].map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.companion === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("companion", v)}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Countries visited in last 5 years */}
          <div className="cl-field">
            <label className="cl-label">
              Countries visited in last 5 years
              <span className="cl-hint-chip">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                leave blank if none
              </span>
            </label>

            {countryVisits.length > 0 && (
              <>
                {/* Column headers — must mirror cl-country-visit-row grid */}
                <div className="cl-contact-header cl-country-visit-header">
                  <span />
                  <span>Country</span>
                  <span>Month</span>
                  <span>Year</span>
                  <span />
                </div>

                {countryVisits.map((v, i) => (
                  <CountryVisitRow
                    key={i}
                    visit={v}
                    idx={i}
                    onChange={(updated) => onUpdateCountryVisit(i, updated)}
                    onRemove={() => onRemoveCountryVisit(i)}
                  />
                ))}
              </>
            )}

            <button className="cl-add-contact" onClick={onAddCountryVisit}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {countryVisits.length === 0 ? "Add a country" : "Add another country"}
            </button>
          </div>
        </div>

        {/* Employment */}
        {isEmp && (
          <div className="cl-section">
            <p className="cl-section-label">Employment</p>
            <div className="cl-field-row">
              <div className="cl-field">
                <label className="cl-label">
                  Designation / Job title
                  {fieldErrors.designation && (
                    <span className="cl-field-err">{fieldErrors.designation}</span>
                  )}
                </label>
                <input
                  className={`cl-input${fieldErrors.designation ? " cl-input--error" : ""}`}
                  placeholder="e.g. Software Engineer"
                  value={inputs.designation}
                  onChange={(e) => onChange("designation", e.target.value)}
                  onBlur={(e) => {
                    validateField("designation", e.target.value);
                    onBlur?.("designation", e.target.value);
                  }}
                />
              </div>
              <div className="cl-field">
                <label className="cl-label">
                  Company name
                </label>
                <input
                  className="cl-input"
                  placeholder="e.g. Infosys Ltd."
                  value={inputs.companyName}
                  onChange={(e) => onChange("companyName", e.target.value)}
                  onBlur={(e) => onBlur?.("companyName", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {isStu && (
          <div className="cl-section">
            <p className="cl-section-label">Education</p>
            <div className="cl-field">
              <label className="cl-label">
                Institution name
                {fieldErrors.institutionName && (
                  <span className="cl-field-err">{fieldErrors.institutionName}</span>
                )}
              </label>
              <input
                className={`cl-input${fieldErrors.institutionName ? " cl-input--error" : ""}`}
                placeholder="e.g. IIT Delhi"
                value={inputs.institutionName}
                onChange={(e) => onChange("institutionName", e.target.value)}
                onBlur={(e) => {
                  validateField("institutionName", e.target.value);
                  onBlur?.("institutionName", e.target.value);
                }}
              />
            </div>
          </div>
        )}

        {/* Sponsorship */}
        {isSpon && (
          <div className="cl-section">
            <p className="cl-section-label">Sponsorship</p>

            {/* Unified sponsor card — same layout as dependant card */}
            <div className="cl-dependant-row">
              <div className="cl-dependant-row-fields">
                <div className="cl-field-row">
                  <div className="cl-field">
                    <label className="cl-label">
                      Sponsor name
                      {(attempted && errors.sponsorName || fieldErrors.sponsorName) && (
                        <span className="cl-field-err">{errors.sponsorName || fieldErrors.sponsorName}</span>
                      )}
                    </label>
                    <input
                      className={`cl-input${(attempted && errors.sponsorName) || fieldErrors.sponsorName ? " cl-input--error" : ""}`}
                      placeholder="e.g. Rahul Sharma"
                      value={inputs.sponsorName}
                      onChange={(e) => onChange("sponsorName", e.target.value)}
                      onBlur={(e) => {
                        validateField("sponsorName", e.target.value);
                        onBlur?.("sponsorName", e.target.value);
                      }}
                    />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">
                      Relationship to sponsor
                      {(attempted && errors.sponsorRel) && (
                        <span className="cl-field-err">{errors.sponsorRel}</span>
                      )}
                    </label>
                    <input
                      className={`cl-input${(attempted && errors.sponsorRel) ? " cl-input--error" : ""}`}
                      placeholder="e.g. Father, Brother"
                      value={inputs.sponsorRel}
                      onChange={(e) => onChange("sponsorRel", e.target.value)}
                      onBlur={(e) => onBlur?.("sponsorRel", e.target.value)}
                    />
                  </div>
                </div>
                <div className="cl-field-row">
                  <div className="cl-field">
                    <label className="cl-label">
                      Sponsor&apos;s passport number
                      {fieldErrors.sponsorPassport && (
                        <span className="cl-field-err">{fieldErrors.sponsorPassport}</span>
                      )}
                    </label>
                    <input
                      className={`cl-input${fieldErrors.sponsorPassport ? " cl-input--error" : ""}`}
                      placeholder="e.g. P1234567"
                      value={inputs.sponsorPassport || ""}
                      onChange={(e) => {
                        const cleaned = validators.passport.sanitise?.(e.target.value) ?? e.target.value;
                        onChange("sponsorPassport", cleaned);
                      }}
                      onBlur={(e) => {
                        validateField("sponsorPassport", e.target.value);
                        onBlur?.("sponsorPassport", e.target.value);
                      }}
                      onKeyDown={validators.passport.onKeyDown}
                      maxLength={8}
                    />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Sponsor&apos;s date of birth</label>
                    <input
                      className="cl-input cl-input--date"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={inputs.sponsorDob || ""}
                      onChange={(e) => onChange("sponsorDob", e.target.value)}
                      onBlur={(e) => onBlur?.("sponsorDob", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="cl-field" style={{ marginTop: 8 }}>
              <label className="cl-label">Is your sponsor travelling with you?</label>
              <div className="cl-toggle-row">
                {([
                  ["staying", "Staying in India"],
                  ["accompanying", "Accompanying me"],
                ] as const).map(([v, l]) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.sponsorAccompanying === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("sponsorAccompanying", v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dependant */}
        <div className="cl-section">
          <p className="cl-section-label">Anyone else on your application?</p>
          <div className="cl-field">
            <label className="cl-label">Is a dependant (e.g. spouse, child) applying with you?</label>
            <div className="cl-toggle-row">
              {([
                ["no", "No — just me"],
                ["yes", "Yes — add dependant(s)"],
              ] as const).map(([v, l]) => (
                <button
                  key={v}
                  className={`cl-toggle-btn${inputs.hasDependant === v ? " cl-toggle-btn--active" : ""}`}
                  onClick={() => onChange("hasDependant", v)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {inputs.hasDependant === "yes" && (
            <>
              {dependants.map((dep, i) => (
                <div key={i} className="cl-dependant-row">
                  <div className="cl-dependant-row-num">{i + 1}</div>
                  <div className="cl-dependant-row-fields">
                    <div className="cl-field-row">
                      <div className="cl-field">
                        <label className="cl-label">Full name</label>
                        <input
                          className="cl-input"
                          placeholder="e.g. Divya Yadav"
                          value={dep.name}
                          onChange={(e) => onUpdateDependant(i, { ...dep, name: e.target.value })}
                        />
                      </div>
                      <div className="cl-field">
                        <label className="cl-label">Relationship</label>
                        <input
                          className="cl-input"
                          placeholder="e.g. Wife, Son, Mother"
                          value={dep.relationship}
                          onChange={(e) => onUpdateDependant(i, { ...dep, relationship: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="cl-field-row">
                      <div className="cl-field">
                        <label className="cl-label">Date of birth</label>
                        <input
                          className="cl-input cl-input--date"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={dep.dob}
                          onChange={(e) => onUpdateDependant(i, { ...dep, dob: e.target.value })}
                        />
                      </div>
                      <div className="cl-field">
                        <label className="cl-label">Passport number</label>
                        <input
                          className="cl-input"
                          placeholder="e.g. P1234567"
                          value={dep.passport}
                          onChange={(e) => onUpdateDependant(i, { ...dep, passport: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="cl-remove-btn"
                    onClick={() => onRemoveDependant(i)}
                    aria-label="Remove dependant"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              {dependants.length < 3 && (
                <button className="cl-add-contact" onClick={onAddDependant}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add dependant
                </button>
              )}
            </>
          )}
        </div>

        {/* Family ties */}
        <div className="cl-section">
          <p className="cl-section-label">Family Ties in India</p>
          <div className="cl-ties-grid">
            <div className="cl-ties-item">
              <label className="cl-label">Married?</label>
              <div className="cl-toggle-row cl-toggle-row--sm">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.married === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("married", v)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div className="cl-ties-item">
              <label className="cl-label">Parents in India?</label>
              <div className="cl-toggle-row cl-toggle-row--sm">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.parentsInIndia === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("parentsInIndia", v)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div className="cl-ties-item">
              <label className="cl-label">Children?</label>
              <div className="cl-toggle-row cl-toggle-row--sm">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.hasChildren === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("hasChildren", v)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="cl-section">
          <p className="cl-section-label">
            Emergency Contacts in India{" "}
            <span className="cl-hint-chip">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              up to 3
            </span>
          </p>
          <div className="cl-contact-header">
            <span />
            <span>Name</span>
            <span>Relationship</span>
            <span>Phone</span>
            <span>Email</span>
            <span />
          </div>
          {contacts.map((c, i) => (
            <ContactRow
              key={i}
              contact={c}
              idx={i}
              onChange={(updated) => {
                onUpdateContact(i, updated);
                validateContactField(i, updated);
              }}
              onRemove={() => onRemoveContact(i)}
              phoneError={contactErrors[i]?.phone}
              emailError={contactErrors[i]?.email}
            />
          ))}
          {contacts.length < 3 && (
            <button className="cl-add-contact" onClick={onAddContact}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add contact
            </button>
          )}
        </div>

        {/* Proceed */}
        <div className="cl-save-row">
          <p className="cl-save-hint">
            The letter preview opens in the next step. You can edit every
            paragraph inline before downloading.
          </p>
          <button className="cl-save-btn" onClick={handleProceedWithScroll}>
            Preview Letter →
          </button>
        </div>
      </div>
    </>
  );
}