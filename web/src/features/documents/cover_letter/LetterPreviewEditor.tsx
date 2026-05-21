"use client";

/**
 * coverLetterPreview.tsx
 *
 * Step 2 of the cover letter builder — displays and allows editing the generated letter.
 * Every paragraph and field is inline-editable.
 */

import React from "react";
import { Contact, InlinePara } from "./LetterFormFields";
import { isSponsored } from "./letterValidation";

export interface CoverLetterPreviewProps {
  // Paragraph/section states
  lHeading: string;
  setLHeading: (v: string) => void;
  lToBlock: string;
  setLToBlock: (v: string) => void;
  lDate: string;
  setLDate: (v: string) => void;
  lSubject: string;
  setLSubject: (v: string) => void;
  lSalutation: string;
  setLSalutation: (v: string) => void;
  lIntro: string;
  setLIntro: (v: string) => void;
  lBullets: string[];
  setLBullets: (v: string[]) => void;
  lSecDocs: string;
  setLSecDocs: (v: string) => void;
  lSecDocsIntro: string;
  setLSecDocsIntro: (v: string) => void;
  lDocRows: string[];
  setLDocRows: (v: string[]) => void;
  lSecPurpose: string;
  setLSecPurpose: (v: string) => void;
  lSecPurposeIntro: string;
  setLSecPurposeIntro: (v: string) => void;
  lPurposeDetail: string;
  setLPurposeDetail: (v: string) => void;
  lFlightPara: string;
  setLFlightPara: (v: string) => void;
  lSecOverstay: string;
  setLSecOverstay: (v: string) => void;
  lSecOverstayIntro: string;
  setLSecOverstayIntro: (v: string) => void;
  lSecImmigration: string;
  setLSecImmigration: (v: string) => void;
  lImmigration: string;
  setLImmigration: (v: string) => void;
  lSecFamily: string;
  setLSecFamily: (v: string) => void;
  lFamilyTies: string;
  setLFamilyTies: (v: string) => void;
  lSecEconomic: string;
  setLSecEconomic: (v: string) => void;
  lEconomicTies: string;
  setLEconomicTies: (v: string) => void;
  lSecFinance: string;
  setLSecFinance: (v: string) => void;
  lSecFinanceIntro: string;
  setLSecFinanceIntro: (v: string) => void;
  lSecIncome: string;
  setLSecIncome: (v: string) => void;
  lIncomeContent: string;
  setLIncomeContent: (v: string) => void;
  lSecAssets: string;
  setLSecAssets: (v: string) => void;
  lAssetsContent: string;
  setLAssetsContent: (v: string) => void;
  lFinance: string;
  setLFinance: (v: string) => void;
  lSecSponsor: string;
  setLSecSponsor: (v: string) => void;
  lSponsor: string;
  setLSponsor: (v: string) => void;

  lSecDependant: string;
  setLSecDependant: (v: string) => void;
  lDependant: string;
  setLDependant: (v: string) => void;
  lSecContacts: string;
  setLSecContacts: (v: string) => void;
  lContactsNote: string;
  setLContactsNote: (v: string) => void;
  lContacts: Contact[];
  setLContacts: (v: Contact[]) => void;
  lClosing: string;
  setLClosing: (v: string) => void;
  lSigName: string;
  setLSigName: (v: string) => void;
  lSigPassport: string;
  setLSigPassport: (v: string) => void;
  // Actions
  onBack: () => void;
  onDownload: () => void;
  downloading: boolean;
  unfilled?: string[];
  // Sponsorship context
  sponsorshipType?: string;
  hasDependant?: string;
}

export function LetterPreviewEditor({
  lHeading,
  setLHeading,
  lToBlock,
  setLToBlock,
  lDate,
  setLDate,
  lSubject,
  setLSubject,
  lSalutation,
  setLSalutation,
  lIntro,
  setLIntro,
  lBullets,
  setLBullets,
  lSecDocs,
  setLSecDocs,
  lSecDocsIntro,
  setLSecDocsIntro,
  lDocRows,
  setLDocRows,
  lSecPurpose,
  setLSecPurpose,
  lSecPurposeIntro,
  setLSecPurposeIntro,
  lPurposeDetail,
  setLPurposeDetail,
  lFlightPara,
  setLFlightPara,
  lSecOverstay,
  setLSecOverstay,
  lSecOverstayIntro,
  setLSecOverstayIntro,
  lSecImmigration,
  setLSecImmigration,
  lImmigration,
  setLImmigration,
  lSecFamily,
  setLSecFamily,
  lFamilyTies,
  setLFamilyTies,
  lSecEconomic,
  setLSecEconomic,
  lEconomicTies,
  setLEconomicTies,
  lSecFinance,
  setLSecFinance,
  lSecFinanceIntro,
  setLSecFinanceIntro,
  lSecIncome,
  setLSecIncome,
  lIncomeContent,
  setLIncomeContent,
  lSecAssets,
  setLSecAssets,
  lAssetsContent,
  setLAssetsContent,
  lFinance,
  setLFinance,
  lSecSponsor,
  setLSecSponsor,
  lSponsor,
  setLSponsor,

  lSecDependant,
  setLSecDependant,
  lDependant,
  setLDependant,
  lSecContacts,
  setLSecContacts,
  lContactsNote,
  setLContactsNote,
  lContacts,
  setLContacts,
  lClosing,
  setLClosing,
  lSigName,
  setLSigName,
  lSigPassport,
  setLSigPassport,
  onBack,
  onDownload,
  downloading,
  unfilled = [],
  sponsorshipType,
  hasDependant,
}: CoverLetterPreviewProps) {
  const isSpon = isSponsored(sponsorshipType || "");
  const hasDep = hasDependant === "yes";

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
          Builder
        </button>
        <div className="cl-topbar-center">
          <span className="cl-topbar-title">Cover Letter Preview</span>
          <span className="cl-topbar-sub">Click any field to edit inline</span>
        </div>
        <div className="cl-topbar-steps">
          <span className="cl-step cl-step--done">✓</span>
          <span className="cl-step-line" />
          <span className="cl-step cl-step--active">2</span>
        </div>
      </div>

      <div className="cl-letter-body">
        {/* Info strip */}
        <div className="cl-preview-info-strip">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>
            <strong>Click any text to edit it directly. Look for [] or [HINT] to fill values.</strong> — every
            heading, paragraph, table cell, and contact is editable right here.
          </span>
        </div>

        {/* THE LETTER */}
        <div className="cl-letter-sheet">
          {/* Heading */}
          <input
            className="cl-letter-heading-input"
            value={lHeading}
            onChange={(e) => setLHeading(e.target.value)}
            title="Click to edit"
          />

          {/* To / Date block */}
          <div className="cl-addr-block">
            <textarea
              className="cl-addr-textarea"
              value={lToBlock}
              onChange={(e) => setLToBlock(e.target.value)}
              rows={4}
              title="Click to edit address"
            />
            <input
              className="cl-date-input"
              value={lDate}
              onChange={(e) => setLDate(e.target.value)}
              title="Click to edit date"
            />
          </div>

          {/* Subject */}
          <div className="cl-subject-row">
            <span className="cl-subject-bold">Subject: </span>
            <input
              className="cl-inline-field cl-inline-field--subject"
              value={lSubject}
              onChange={(e) => setLSubject(e.target.value)}
              title="Click to edit subject"
            />
          </div>

          {/* Salutation */}
          <input
            className="cl-inline-field cl-inline-field--salutation"
            value={lSalutation}
            onChange={(e) => setLSalutation(e.target.value)}
            title="Click to edit"
          />

          {/* Intro */}
          <InlinePara value={lIntro} onChange={setLIntro} rows={3} />

          {/* Bullet overview — editable list */}
          <ul className="cl-bullet-list cl-bullet-list--edit">
            {lBullets.map((item, i) => (
              <li key={i} className="cl-bullet-edit-item">
                <input
                  className="cl-inline-field cl-inline-field--bullet"
                  value={item}
                  onChange={(e) =>
                    setLBullets(
                      lBullets.map((b, bi) =>
                        bi === i ? e.target.value : b
                      )
                    )
                  }
                  title="Click to edit"
                />
              </li>
            ))}
          </ul>

          {/* Supporting Documents section */}
          <input
            className="cl-section-heading-input"
            value={lSecDocs}
            onChange={(e) => setLSecDocs(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lSecDocsIntro} onChange={setLSecDocsIntro} rows={2} />

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
                      onChange={(e) =>
                        setLDocRows(
                          lDocRows.map((r, ri) =>
                            ri === i ? e.target.value : r
                          )
                        )
                      }
                      title="Click to edit"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="cl-doc-td cl-doc-td--num" colSpan={2}>
                  <button
                    className="cl-cell-add-btn-light"
                    onClick={() => setLDocRows([...lDocRows, ""])}
                  >
                    + Add row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Purpose of Visit */}
          <input
            className="cl-section-heading-input"
            value={lSecPurpose}
            onChange={(e) => setLSecPurpose(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lSecPurposeIntro} onChange={setLSecPurposeIntro} rows={1} />
          <InlinePara value={lPurposeDetail} onChange={setLPurposeDetail} rows={3} />
          <InlinePara value={lFlightPara} onChange={setLFlightPara} rows={4} />

          {/* Why I will not overstay */}
          <input
            className="cl-section-heading-input"
            value={lSecOverstay}
            onChange={(e) => setLSecOverstay(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lSecOverstayIntro} onChange={setLSecOverstayIntro} rows={3} />

          <input
            className="cl-subsection-heading-input"
            value={lSecImmigration}
            onChange={(e) => setLSecImmigration(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lImmigration} onChange={setLImmigration} rows={3} />

          <input
            className="cl-subsection-heading-input"
            value={lSecFamily}
            onChange={(e) => setLSecFamily(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lFamilyTies} onChange={setLFamilyTies} rows={3} />

          <input
            className="cl-subsection-heading-input"
            value={lSecEconomic}
            onChange={(e) => setLSecEconomic(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lEconomicTies} onChange={setLEconomicTies} rows={3} />

          {/* Dependant section (only shown when hasDependant === "yes") */}
          {hasDep && (
            <>
              <input
                className="cl-section-heading-input"
                value={lSecDependant}
                onChange={(e) => setLSecDependant(e.target.value)}
                title="Click to edit"
              />
              <InlinePara value={lDependant} onChange={setLDependant} rows={6} />
            </>
          )}

          {/* Financial ability */}
          <input
            className="cl-section-heading-input"
            value={lSecFinance}
            onChange={(e) => setLSecFinance(e.target.value)}
            title="Click to edit"
          />
          {!isSpon ? (
            <>
              <InlinePara value={lSecFinanceIntro} onChange={setLSecFinanceIntro} rows={2} />
              <input
                className="cl-subsection-heading-input"
                value={lSecIncome}
                onChange={(e) => setLSecIncome(e.target.value)}
                title="Click to edit"
              />
              <InlinePara value={lIncomeContent} onChange={setLIncomeContent} rows={3} />
              <input
                className="cl-subsection-heading-input"
                value={lSecAssets}
                onChange={(e) => setLSecAssets(e.target.value)}
                title="Click to edit"
              />
              <InlinePara value={lAssetsContent} onChange={setLAssetsContent} rows={4} />
            </>
          ) : (
            <>
              <InlinePara value={lFinance} onChange={setLFinance} rows={3} />
              <input
                className="cl-subsection-heading-input"
                value={lSecSponsor}
                onChange={(e) => setLSecSponsor(e.target.value)}
                title="Click to edit"
              />
              <InlinePara value={lSponsor} onChange={setLSponsor} rows={5} />
            </>
          )}

          {/* Contacts */}
          <input
            className="cl-section-heading-input"
            value={lSecContacts}
            onChange={(e) => setLSecContacts(e.target.value)}
            title="Click to edit"
          />
          <InlinePara value={lContactsNote} onChange={setLContactsNote} rows={3} />

          <table className="cl-contacts-table">
            <thead>
              <tr>
                {["Name", "Relationship to me", "Phone number", "Email"].map(
                  (h) => (
                    <th key={h} className="cl-contacts-th">
                      {h}
                    </th>
                  )
                )}
                <th className="cl-contacts-th" style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              {lContacts.map((c, i) => (
                <tr key={i}>
                  {(
                    ["name", "rel", "phone", "email"] as const
                  ).map((field) => (
                    <td
                      key={field}
                      className="cl-contacts-td cl-contacts-td--edit"
                    >
                      <input
                        className="cl-cell-input-light"
                        value={c[field]}
                        placeholder={
                          field === "name"
                            ? "Full name"
                            : field === "rel"
                              ? "Relationship"
                              : field === "phone"
                                ? "+91 XXXXX"
                                : "email@..."
                        }
                        onChange={(e) =>
                          setLContacts(
                            lContacts.map((x, j) =>
                              j === i
                                ? { ...x, [field]: e.target.value }
                                : x
                            )
                          )
                        }
                        title="Click to edit"
                      />
                    </td>
                  ))}
                  <td className="cl-contacts-td" style={{ textAlign: "center", padding: "4px" }}>
                    <button
                      className="cl-cell-remove-btn-light"
                      onClick={() =>
                        setLContacts(lContacts.filter((_, j) => j !== i))
                      }
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lContacts.length < 5 && (
            <button
              className="cl-cell-add-btn-light"
              style={{ marginBottom: 12 }}
              onClick={() =>
                setLContacts([
                  ...lContacts,
                  { name: "", rel: "", phone: "", email: "" },
                ])
              }
            >
              + Add contact row
            </button>
          )}

          {/* Closing */}
          <InlinePara value={lClosing} onChange={setLClosing} rows={3} />

          {/* Signature block */}
          <div className="cl-sig-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                className="cl-inline-field cl-inline-field--sig"
                value={lSigName}
                onChange={(e) => setLSigName(e.target.value)}
                placeholder="Full name"
                title="Click to edit name"
              />
              <span
                style={{
                  color: "#555",
                  fontFamily: "'Times New Roman', serif",
                  fontSize: 13,
                }}
              >
                {" "}
                &nbsp;(Passport No. —
              </span>
              <input
                className="cl-inline-field cl-inline-field--sig"
                value={lSigPassport}
                onChange={(e) => setLSigPassport(e.target.value)}
                placeholder="Passport No."
                title="Click to edit passport"
                style={{ width: 120 }}
              />
              <span
                style={{
                  color: "#555",
                  fontFamily: "'Times New Roman', serif",
                  fontSize: 13,
                }}
              >
                )
              </span>
            </div>
            <div className="cl-sig-line" />
            <p className="cl-sig-sub cl-sig-italic">Signature</p>
          </div>
        </div>

        {/* Unfilled fields warning */}
        {unfilled.length > 0 && (
          <div className="cl-unfilled-warning">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Please fill in the following before downloading:</strong>
              <ul style={{ margin: "4px 0 0 0", paddingLeft: 16 }}>
                {unfilled.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Download row */}
        <div className="cl-dl-row">
          <p className="cl-save-hint">
            All edits are saved automatically. Download when ready.
          </p>
          <button
            className="cl-save-btn"
            onClick={onDownload}
            disabled={downloading}
          >
            {downloading ? (
              <span className="cl-spinner" />
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download .docx
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}