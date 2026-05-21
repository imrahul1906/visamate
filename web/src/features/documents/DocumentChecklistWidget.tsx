"use client";

// web\src\features\documents\DocumentChecklistWidget.tsx
//
// Renders a download card for the official document checklist PDF.
// UI pattern mirrors ItineraryWidget's "Download Blank Format" option —
// same card shape, same icon treatment, same button style.

import { useState } from "react";
import type { DocumentItem } from "../../types/document";

export default function DocumentChecklistWidget({
  doc,
}: {
  doc: DocumentItem;
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadUrl = doc.checkListDownloadUrl;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!downloadUrl || downloading) return;

    setDownloading(true);
    try {
      // Open in new tab — same pattern as downloadOfficialPdf in itineraryService
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };

  // No URL in data — show a clear error state rather than silently rendering nothing
  if (!downloadUrl) {
    return (
      <div style={inlineStyles.errorBox}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, color: "#f59e0b" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <span style={inlineStyles.errorText}>Checklist download URL not configured for this visa type.</span>
      </div>
    );
  }

  return (
    <>
      <style>{widgetStyles}</style>

      <div className="dcw-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Download option card — mirrors iw-opt iw-opt--light exactly */}
        <div className="dcw-options">
          <p className="iw-select-sub">
            Prepare your official Document Checklist for your visa application.
          </p>
          <button
            className={`dcw-opt${downloaded ? " dcw-opt--done" : ""}`}
            onClick={handleDownload}
            disabled={downloading}
          >
            <div className="dcw-opt-left">
              {/* Icon block — mirrors iw-opt-icon iw-opt-icon--light */}
              <div className="dcw-opt-icon">
                {downloading ? (
                  <svg className="dcw-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                ) : downloaded ? (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
              </div>

              {/* Text — mirrors iw-opt-text / iw-opt-title / iw-opt-desc */}
              <div className="dcw-opt-text">
                <span className="dcw-opt-title">
                  {downloading ? "Opening…" : downloaded ? "Download Again" : "Download Checklist PDF"}
                  {downloaded && (
                    <span className="dcw-opt-badge">
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Opened
                    </span>
                  )}
                </span>
                <span className="dcw-opt-desc">
                  Official checklist template. Fill it manually, sign it, and attach to your documents.
                </span>
              </div>
            </div>

            {/* Arrow — mirrors iw-opt-arrow */}
            <svg className="dcw-opt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles — mirrors iw-opt / iw-opt--light from ItineraryWidget
// ─────────────────────────────────────────────────────────────

const widgetStyles = `
  .dcw-wrap {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Options container — mirrors iw-options */
  .dcw-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
    max-width: 560px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  /* Card button — mirrors iw-opt iw-opt--light */
  .dcw-opt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: border-color 150ms, background 150ms, transform 120ms;
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.55);
    font-family: 'DM Sans', sans-serif;
  }
  .dcw-opt:active { transform: scale(0.99); }
  .dcw-opt:hover:not(:disabled) {
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.05);
  }
  .dcw-opt:disabled { cursor: not-allowed; opacity: 0.7; }

  /* Opened/done state — subtle green tint */
  .dcw-opt--done {
    border-color: rgba(74,222,128,0.25);
    background: rgba(74,222,128,0.04);
  }
  .dcw-opt--done:hover:not(:disabled) {
    border-color: rgba(74,222,128,0.4);
    background: rgba(74,222,128,0.08);
  }

  /* Left section — mirrors iw-opt-left */
  .dcw-opt-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
  }

  /* Icon box — mirrors iw-opt-icon iw-opt-icon--light */
  .dcw-opt-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .dcw-opt--done .dcw-opt-icon {
    background: rgba(74,222,128,0.1);
    color: #4ade80;
    border-color: rgba(74,222,128,0.25);
  }

  /* Text stack — mirrors iw-opt-text */
  .dcw-opt-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .iw-select-sub { font-size: 13px; color: rgba(255,255,255,0.65); margin: 0 0 10px; line-height: 1.6; }

  /* Title — mirrors iw-opt-title */
  .dcw-opt-title {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
    color: rgba(255,255,255,0.92);
    font-family: 'DM Sans', sans-serif;
  }

  /* "Opened" badge — mirrors iw-opt-badge */
  .dcw-opt-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 99px;
    background: rgba(74,222,128,0.15);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.35);
  }

  /* Description — mirrors iw-opt-desc */
  .dcw-opt-desc {
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    line-height: 1.5;
    font-family: 'DM Sans', sans-serif;
  }

  /* Arrow — mirrors iw-opt-arrow */
  .dcw-opt-arrow {
    flex-shrink: 0;
    color: rgba(255,255,255,0.38);
  }
  .dcw-opt--done .dcw-opt-arrow {
    color: rgba(74,222,128,0.6);
  }

  /* Reminder note */
  .dcw-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 11px;
    color: rgba(255,255,255,0.38);
    line-height: 1.55;
    font-family: 'DM Sans', sans-serif;
  }

  /* Spinner */
  .dcw-spin { animation: spin 0.8s linear infinite; }
`;

const inlineStyles = {
  errorBox: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    padding: "10px 14px",
    background: "rgba(251,191,36,0.06)",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
  },
};