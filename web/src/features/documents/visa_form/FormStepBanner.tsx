/**
 * FormStepBanner.tsx
 *
 * Renders the "Step 1 — Download the form / Fill the form online" banner
 * including the icon, description text, and primary CTA link.
 *
 * Purely presentational — receives everything it needs via props.
 */

import { T, font } from "@/components/shared/theme";
import type { DocumentItem } from "@/types/document";

interface Props {
  doc: DocumentItem;
  accentColor: string;
  isDownloadable: boolean;
}

export default function FormStepBanner({ doc, accentColor, isDownloadable }: Props) {
  const formInfo = doc.form;

  return (
    <div
      style={{
        padding: "16px 18px",
        borderBottom: `1px solid ${T.border}`,
        background: isDownloadable
          ? "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)"
          : "linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(74,222,128,0.03) 100%)",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          flexShrink: 0,
          background: isDownloadable ? T.indigoGlow : T.greenBg,
          border: `1px solid ${isDownloadable ? "rgba(99,102,241,0.3)" : T.greenBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isDownloadable ? (
          <svg width="18" height="18" fill="none" stroke={T.indigoLight} strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" stroke={T.green} strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: isDownloadable ? T.indigoLight : T.green,
            margin: "0 0 3px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Step 1 — {isDownloadable ? "Download the form" : "Fill the form online"}
        </p>
        <p style={{ fontSize: 12, color: T.muted2, margin: "0 0 12px", lineHeight: 1.5 }}>
          {isDownloadable
            ? "Download the official PDF, print it, and fill by hand using the helper below."
            : "Click below to open the official online application portal."}
        </p>

        {/* Downloadable CTA */}
        {isDownloadable && formInfo?.downloadUrl && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <a
              href={formInfo.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: accentColor,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: `0 2px 12px ${accentColor}40`,
                transition: "opacity 150ms",
                fontFamily: font.sans,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download official form (PDF)
            </a>

            {formInfo.requiresPrint && (
              <span
                style={{
                  fontSize: 11,
                  color: T.amber,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: T.amberBg,
                  border: `1px solid ${T.amberBorder}`,
                  padding: "5px 10px",
                  borderRadius: 7,
                  fontWeight: 500,
                }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
                Print &amp; fill by hand
              </span>
            )}
          </div>
        )}

        {/* Online CTA */}
        {!isDownloadable && formInfo?.onlineUrl && (
          <a
            href={formInfo.onlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#16a34a",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              boxShadow: "0 2px 12px rgba(22,163,74,0.35)",
              fontFamily: font.sans,
            }}
          >
            <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open application portal
          </a>
        )}
      </div>
    </div>
  );
}
