import React, { useState } from "react";
import type { ItineraryState } from "./useItineraryState";

interface ItineraryPreviewProps {
  countryName: string;
  state: ItineraryState;
}

export default function ItineraryPreview({
  countryName,
  state,
}: ItineraryPreviewProps) {
  const {
    setMode,
    docxGenerated,
    downloading,
    totalActivities,
    days,
    editableRows,
    editableTitle,
    setEditableTitle,
    editableApplicant,
    setEditableApplicant,
    editablePassport,
    setEditablePassport,
    editableDateRange,
    setEditableDateRange,
    editableSponsor,
    setEditableSponsor,
    isSponsored,
    updateEditableRow,
    updateActivity,
    addActivityToRow,
    removeActivityFromRow,
    handleDownloadDocx,
  } = state;

  const [, setEditingCell] = useState<string | null>(null);

  return (
    <div className="iw-builder" onClick={(e) => e.stopPropagation()}>
      {/* Topbar */}
      <div className="iw-topbar">
        <button className="iw-back" onClick={() => setMode("helper")}>
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
        <div className="iw-topbar-center">
          <span className="iw-topbar-title">Itinerary Preview</span>
          <span className="iw-topbar-sub">Click any field to edit inline</span>
        </div>
        <div className="iw-topbar-stats">
          <span className="iw-stat">
            <strong>{totalActivities}</strong> activities
          </span>
          <span className="iw-stat">
            <strong>{days}</strong> days
          </span>
        </div>
      </div>

      {/* Preview body */}
      <div className="iw-preview-body">
        {/* Info strip */}
        <div className="iw-preview-info-strip">
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
            <strong>Click any field to edit it directly</strong> — title,
            applicant info, dates, activities, hotel names and contacts are all
            editable right here before downloading.
          </span>
        </div>

        {/* White-paper preview sheet */}
        <div className="iw-letter-sheet">
          {/* Document heading */}
          <div className="iw-preview-heading-static">
            {editableTitle}
          </div>

          {/* Editable meta block */}
          <div className="iw-letter-meta">
            <div className="iw-preview-meta-row">
              <span className="iw-preview-meta-label">Applicant:</span>
              <input
                className="iw-preview-meta-input"
                value={editableApplicant}
                placeholder="Applicant name"
                onChange={(e) => setEditableApplicant(e.target.value)}
                onFocus={() => setEditingCell("applicant")}
                onBlur={() => setEditingCell(null)}
                title="Click to edit applicant name"
              />
              <span className="iw-preview-meta-sep">·</span>
              <span className="iw-preview-meta-label">Passport:</span>
              <input
                className="iw-preview-meta-input iw-preview-meta-input--sm"
                value={editablePassport}
                placeholder="Passport no."
                onChange={(e) => setEditablePassport(e.target.value)}
                onFocus={() => setEditingCell("passport")}
                onBlur={() => setEditingCell(null)}
                title="Click to edit passport number"
              />
            </div>
            <div className="iw-preview-meta-row" style={{ marginTop: 4 }}>
              <span className="iw-preview-meta-label">Travel Dates:</span>
              <input
                className="iw-preview-meta-input"
                value={editableDateRange}
                placeholder="e.g. 1 June 2025 – 10 June 2025"
                onChange={(e) => setEditableDateRange(e.target.value)}
                onFocus={() => setEditingCell("dates")}
                onBlur={() => setEditingCell(null)}
                title="Click to edit travel dates"
                style={{ minWidth: 220 }}
              />
            </div>
            {isSponsored && (
              <div className="iw-preview-meta-row" style={{ marginTop: 4 }}>
                <span className="iw-preview-meta-label">Sponsor:</span>
                <input
                  className="iw-preview-meta-input"
                  value={editableSponsor}
                  placeholder="Name (Passport No: XXXXXXX)"
                  onChange={(e) => setEditableSponsor(e.target.value)}
                  onFocus={() => setEditingCell("sponsor")}
                  onBlur={() => setEditingCell(null)}
                  title="Click to edit sponsor details"
                  style={{ minWidth: 280 }}
                />
              </div>
            )}
            <p className="iw-letter-meta-line iw-letter-meta-intro">
              The travel itinerary of the visa applicant(s) is as follows:
            </p>
          </div>

          {/* Itinerary table — fully editable */}
          <div className="iw-preview-table-wrap">
            <table className="iw-preview-table">
              <thead>
                <tr>
                  <th className="iw-preview-th iw-col-date">Date</th>
                  <th className="iw-preview-th iw-col-activity">
                    Activity Plan
                  </th>
                  <th className="iw-preview-th iw-col-contact">Contact</th>
                  <th className="iw-preview-th iw-col-accom">Accommodation</th>
                </tr>
              </thead>
              <tbody>
                {editableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "" : "iw-preview-row-alt"}
                  >
                    {/* Date cell */}
                    <td className="iw-preview-td iw-preview-td--edit">
                      <input
                        className="iw-cell-input"
                        value={row.date}
                        onChange={(e) =>
                          updateEditableRow(idx, "date", e.target.value)
                        }
                        onFocus={() => setEditingCell(`date-${idx}`)}
                        onBlur={() => setEditingCell(null)}
                        title="Click to edit date"
                      />
                    </td>

                    {/* Activities cell */}
                    <td className="iw-preview-td iw-preview-td--edit">
                      {row.activities.length > 0 ? (
                        <ul className="iw-preview-activities iw-preview-activities--edit">
                          {row.activities.map((act, ai) => (
                            <li key={ai} className="iw-activity-edit-row">
                              <input
                                className="iw-cell-input iw-cell-input--activity"
                                value={act}
                                onChange={(e) =>
                                  updateActivity(idx, ai, e.target.value)
                                }
                                onFocus={() => setEditingCell(`act-${idx}-${ai}`)}
                                onBlur={() => setEditingCell(null)}
                                title="Click to edit activity"
                              />
                              <button
                                className="iw-cell-remove-btn"
                                onClick={() => removeActivityFromRow(idx, ai)}
                                title="Remove activity"
                              >
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="iw-preview-empty-cell">—</span>
                      )}
                      <button
                        className="iw-cell-add-btn"
                        onClick={() => addActivityToRow(idx)}
                        title="Add activity to this day"
                      >
                        + Add activity
                      </button>
                    </td>

                    {/* Contact cell */}
                    <td className="iw-preview-td iw-preview-td--edit">
                      {row.contactSameAsAbove ? (
                        <div className="iw-same-toggle-wrap">
                          <span className="iw-preview-same">Same as above</span>
                          <button
                            className="iw-same-override-btn"
                            onClick={() =>
                              updateEditableRow(idx, "contactSameAsAbove", false)
                            }
                            title="Override with custom value"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <input
                          className="iw-cell-input"
                          value={row.contact || ""}
                          placeholder="e.g. +81 3 1234 5678"
                          onChange={(e) =>
                            updateEditableRow(idx, "contact", e.target.value)
                          }
                          onFocus={() => setEditingCell(`contact-${idx}`)}
                          onBlur={() => setEditingCell(null)}
                          title="Click to edit contact"
                        />
                      )}
                    </td>

                    {/* Accommodation cell */}
                    <td className="iw-preview-td iw-preview-td--edit">
                      {row.accommodationSameAsAbove ? (
                        <div className="iw-same-toggle-wrap">
                          <span className="iw-preview-same">Same as above</span>
                          <button
                            className="iw-same-override-btn"
                            onClick={() =>
                              updateEditableRow(
                                idx,
                                "accommodationSameAsAbove",
                                false
                              )
                            }
                            title="Override with custom value"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <input
                          className="iw-cell-input"
                          value={row.accommodation || ""}
                          placeholder="e.g. APA Hotel Shinjuku"
                          onChange={(e) =>
                            updateEditableRow(
                              idx,
                              "accommodation",
                              e.target.value
                            )
                          }
                          onFocus={() => setEditingCell(`accom-${idx}`)}
                          onBlur={() => setEditingCell(null)}
                          title="Click to edit accommodation"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download row */}
        <div className="iw-dl-row">
          <p className="iw-save-hint">
            {docxGenerated
              ? "✓ Itinerary downloaded. It will be included with your document pack."
              : "All edits above are saved automatically. Download when ready."}
          </p>
          <button
            className="iw-save-btn"
            onClick={handleDownloadDocx}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <span className="iw-spinner" /> Generating…
              </>
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {docxGenerated ? "Download Again" : "Download .docx"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
