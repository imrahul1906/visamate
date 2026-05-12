"use client";

/**
 * coverLetterInputs.tsx
 *
 * Step 1 of the cover letter builder — collects user inputs.
 * Returns when user clicks "Preview Letter".
 */

import React from "react";
import { Contact, ContactRow } from "./coverLetterComponents";
import type { CoverLetterInputs, ValidationErrors } from "@/features/documents/cover_letter/coverLetterService";
import { isEmployed, isStudent, isSponsored } from "@/features/documents/cover_letter/coverLetterService";

export interface CoverLetterInputsStepProps {
  inputs: CoverLetterInputs;
  errors: ValidationErrors;
  attempted: boolean;
  applicantProfile?: string;
  sponsorshipType?: string;
  contacts: Contact[];
  onChange: (key: keyof CoverLetterInputs, value: any) => void;
  onAddContact: () => void;
  onUpdateContact: (idx: number, contact: Contact) => void;
  onRemoveContact: (idx: number) => void;
  onProceed: () => void;
}

export function CoverLetterInputsStep({
  inputs,
  errors,
  attempted,
  applicantProfile,
  sponsorshipType,
  contacts,
  onChange,
  onAddContact,
  onUpdateContact,
  onRemoveContact,
  onProceed,
}: CoverLetterInputsStepProps) {
  const isEmp = isEmployed(applicantProfile || "");
  const isStu = isStudent(applicantProfile || "");
  const isSpon = isSponsored(sponsorshipType || "");

  return (
    <>
      {/* Topbar */}
      <div className="cl-topbar">
        <button className="cl-back" onClick={() => window.history.back()}>
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
          <div className="cl-field-row">
            <div className="cl-field">
              <label className="cl-label">
                Departure city in India
                {attempted && errors.departureCity && (
                  <span className="cl-field-err">{errors.departureCity}</span>
                )}
              </label>
              <input
                className={`cl-input${attempted && errors.departureCity ? " cl-input--error" : ""}`}
                placeholder="e.g. New Delhi"
                value={inputs.departureCity}
                onChange={(e) => onChange("departureCity", e.target.value)}
              />
            </div>
            <div className="cl-field">
              <label className="cl-label">
                Countries visited in last 5 years
              </label>
              <input
                className="cl-input"
                placeholder="e.g. UAE, Thailand (leave blank if none)"
                value={inputs.countriesVisited}
                onChange={(e) => onChange("countriesVisited", e.target.value)}
              />
            </div>
          </div>

          {/* Travelling with */}
          <div className="cl-field">
            <label className="cl-label">Travelling</label>
            <div className="cl-toggle-row">
              {["alone", "with"].map((v) => (
                <button
                  key={v}
                  className={`cl-toggle-btn${inputs.travellingWith === v ? " cl-toggle-btn--active" : ""}`}
                  onClick={() => onChange("travellingWith", v as any)}
                >
                  {v === "alone" ? "Alone" : "With someone"}
                </button>
              ))}
            </div>
          </div>

          {inputs.travellingWith === "with" && (
            <div className="cl-field">
              <label className="cl-label">
                Travelling with
                {attempted && errors.companion && (
                  <span className="cl-field-err">{errors.companion}</span>
                )}
              </label>
              <div className="cl-toggle-row">
                {["mother", "father", "spouse", "friend", "colleague"].map(
                  (v) => (
                    <button
                      key={v}
                      className={`cl-toggle-btn${inputs.companion === v ? " cl-toggle-btn--active" : ""}`}
                      onClick={() => onChange("companion", v)}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Employment */}
        {isEmp && (
          <div className="cl-section">
            <p className="cl-section-label">Employment</p>
            <div className="cl-field-row">
              <div className="cl-field">
                <label className="cl-label">
                  Designation / Job title
                  {attempted && errors.designation && (
                    <span className="cl-field-err">
                      {errors.designation}
                    </span>
                  )}
                </label>
                <input
                  className={`cl-input${attempted && errors.designation ? " cl-input--error" : ""}`}
                  placeholder="e.g. Software Engineer"
                  value={inputs.designation}
                  onChange={(e) => onChange("designation", e.target.value)}
                />
              </div>
              <div className="cl-field">
                <label className="cl-label">
                  Company name
                  {attempted && errors.companyName && (
                    <span className="cl-field-err">{errors.companyName}</span>
                  )}
                </label>
                <input
                  className={`cl-input${attempted && errors.companyName ? " cl-input--error" : ""}`}
                  placeholder="e.g. Infosys Ltd."
                  value={inputs.companyName}
                  onChange={(e) => onChange("companyName", e.target.value)}
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
                {attempted && errors.institutionName && (
                  <span className="cl-field-err">
                    {errors.institutionName}
                  </span>
                )}
              </label>
              <input
                className={`cl-input${attempted && errors.institutionName ? " cl-input--error" : ""}`}
                placeholder="e.g. IIT Delhi"
                value={inputs.institutionName}
                onChange={(e) => onChange("institutionName", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Sponsor */}
        {isSpon && (
          <div className="cl-section">
            <p className="cl-section-label">Sponsor Details</p>
            <div className="cl-field-row">
              <div className="cl-field">
                <label className="cl-label">
                  Sponsor's name
                  {attempted && errors.sponsorName && (
                    <span className="cl-field-err">{errors.sponsorName}</span>
                  )}
                </label>
                <input
                  className={`cl-input${attempted && errors.sponsorName ? " cl-input--error" : ""}`}
                  placeholder="e.g. Ramesh Yadav"
                  value={inputs.sponsorName}
                  onChange={(e) => onChange("sponsorName", e.target.value)}
                />
              </div>
              <div className="cl-field">
                <label className="cl-label">
                  Relationship to you
                  {attempted && errors.sponsorRel && (
                    <span className="cl-field-err">{errors.sponsorRel}</span>
                  )}
                </label>
                <input
                  className={`cl-input${attempted && errors.sponsorRel ? " cl-input--error" : ""}`}
                  placeholder="e.g. Father"
                  value={inputs.sponsorRel}
                  onChange={(e) => onChange("sponsorRel", e.target.value)}
                />
              </div>
            </div>
            <div className="cl-field">
              <label className="cl-label">Sponsor during travel</label>
              <div className="cl-toggle-row">
                {[
                  ["staying", "Staying in India"],
                  ["accompanying", "Accompanying me"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.sponsorAccompanying === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("sponsorAccompanying", v as any)}
                  >
                    {l}
                  </button>
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
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.married === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("married", v as any)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div className="cl-ties-item">
              <label className="cl-label">Parents in India?</label>
              <div className="cl-toggle-row cl-toggle-row--sm">
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.parentsInIndia === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("parentsInIndia", v as any)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div className="cl-ties-item">
              <label className="cl-label">Children?</label>
              <div className="cl-toggle-row cl-toggle-row--sm">
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    className={`cl-toggle-btn${inputs.hasChildren === v ? " cl-toggle-btn--active" : ""}`}
                    onClick={() => onChange("hasChildren", v as any)}
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
            <span className="cl-section-hint">(up to 3)</span>
          </p>
          <div className="cl-contact-header">
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
              onChange={(updated) => onUpdateContact(i, updated)}
              onRemove={() => onRemoveContact(i)}
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
          <button className="cl-save-btn" onClick={onProceed}>
            Preview Letter →
          </button>
        </div>
      </div>
    </>
  );
}