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
  color,
}: {
  doc: DocumentItem;
  color: string;
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
      <div style={styles.errorBox}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, color: "#f59e0b" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <span style={styles.errorText}>Checklist download URL not configured for this visa type.</span>
      </div>
    );
  }

  return (
    <>
      <style>{widgetStyles}</style>

      <div className="dcw-card" onClick={(e) => e.stopPropagation()}>

        {/* Card header */}
        <div className="dcw-header">
          {/* Icon */}
          <div className="dcw-icon-wrap" style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
              <polyline points="9 9 10 9 11 9" />
              <polyline points="7 13 8 12 7 11" />
            </svg>
          </div>

          <div className="dcw-header-text">
            <span className="dcw-eyebrow" style={{ color }}>Official Document</span>
            <h3 className="dcw-title">Documents Checklist</h3>
            <p className="dcw-desc">
              Download the official checklist PDF, fill it in, sign it, and include it with your application.
            </p>
          </div>
        </div>

        {/* Steps strip */}
        <div className="dcw-steps">
          {[
            { icon: "⬇️", label: "Download PDF" },
            { icon: "✏️", label: "Fill & sign" },
            { icon: "📎", label: "Attach to docs" },
          ].map((step, i) => (
            <div key={i} className="dcw-step">
              <span className="dcw-step-icon">{step.icon}</span>
              <span className="dcw-step-label">{step.label}</span>
              {i < 2 && (
                <svg className="dcw-step-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Download row */}
        <div className="dcw-dl-row">
          <div className="dcw-dl-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6b7280", flexShrink: 0, marginTop: 1 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="dcw-dl-filename">Documents-Checklist.pdf</span>
            {downloaded && (
              <span className="dcw-dl-done">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Opened
              </span>
            )}
          </div>

          <button
            className="dcw-dl-btn"
            style={{
              background: downloaded ? "rgba(74,222,128,0.12)" : color,
              borderColor: downloaded ? "rgba(74,222,128,0.35)" : color,
              color: downloaded ? "#4ade80" : "#fff",
              opacity: downloading ? 0.7 : 1,
              cursor: downloading ? "not-allowed" : "pointer",
            }}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <svg className="dcw-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                Opening…
              </>
            ) : downloaded ? (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Download again
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Reminder note */}
        <div className="dcw-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Print, fill in all fields by hand, sign at the bottom, and submit with your physical documents.
          </span>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles — scoped to .dcw-* prefix, dark theme matching the app
// ─────────────────────────────────────────────────────────────

const widgetStyles = `
  .dcw-card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    overflow: hidden;
    margin-bottom: 14px;
  }

  .dcw-header {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 16px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .dcw-icon-wrap {
    width: 48px; height: 48px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .dcw-header-text {
    flex: 1; min-width: 0;
  }

  .dcw-eyebrow {
    display: block;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 3px;
    font-family: 'DM Sans', sans-serif;
  }

  .dcw-title {
    font-size: 15px; font-weight: 700;
    color: rgba(255,255,255,0.92);
    margin: 0 0 5px;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.3;
  }

  .dcw-desc {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    margin: 0;
    line-height: 1.55;
    font-family: 'DM Sans', sans-serif;
  }

  /* Steps */
  .dcw-steps {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }

  .dcw-step {
    display: flex; align-items: center; gap: 5px;
  }

  .dcw-step-icon {
    font-size: 13px;
  }

  .dcw-step-label {
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.55);
    font-family: 'DM Sans', sans-serif;
  }

  .dcw-step-arrow {
    color: rgba(255,255,255,0.2);
    margin-left: 2px;
  }

  /* Download row */
  .dcw-dl-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .dcw-dl-info {
    display: flex;
    align-items: center;
    gap: 7px;
    flex: 1;
    min-width: 0;
  }

  .dcw-dl-filename {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dcw-dl-done {
    display: flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600;
    color: #4ade80;
    background: rgba(74,222,128,0.1);
    border: 1px solid rgba(74,222,128,0.25);
    padding: 2px 7px; border-radius: 20px;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  .dcw-dl-btn {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600;
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: opacity 150ms, filter 150ms;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .dcw-dl-btn:hover:not(:disabled) { filter: brightness(1.1); }

  /* Reminder note */
  .dcw-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 16px;
    font-size: 11px;
    color: rgba(255,255,255,0.38);
    line-height: 1.55;
    font-family: 'DM Sans', sans-serif;
  }

  /* Spinner */
  @keyframes dcw-spin { to { transform: rotate(360deg); } }
  .dcw-spin { animation: dcw-spin 0.8s linear infinite; }
`;

const styles = {
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