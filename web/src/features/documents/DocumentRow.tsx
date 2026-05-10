
//
// A single expandable document checklist item.
// Now uses shared <Badge> from "@/app/shared/Badge" instead of
// inline badge JSX that was duplicated across DocumentRow / DocumentsContent / CategorySection.

"use client";

import { useEffect, useState } from "react";
import type { DocumentItem, UploadsMap } from "./types";
import type { ItineraryPlacesData } from "@/lib/data/types";
import Badge from "@/app/shared/Badge";
import PhotoSpecWidget from "./PhotoSpecWidget";
import VisaFormWidget from "./VisaFormWidget";
import UploadSlot from "./UploadSlot";
import ItineraryWidget from "./ItineraryWidget";

export default function DocumentRow({
  doc,
  checked,
  onToggle,
  color,
  animDelay,
  uploads,
  onUpload,
  onRemove,
  onItineraryReady,
  itineraryData,
}: {
  doc: DocumentItem;
  checked: boolean;
  onToggle: () => void;
  color: string;
  animDelay: number;
  uploads: UploadsMap;
  onUpload: (docId: string, file: File) => void;
  onRemove: (docId: string) => void;
  onItineraryReady: (docId: string, file: File) => void;
  itineraryData?: ItineraryPlacesData | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  const hasDetails =
    (doc.tips?.length ?? 0) > 0 ||
    !!doc.notes ||
    !!doc.form ||
    (doc.acceptedFormats?.length ?? 0) > 0 ||
    !!doc.specialWidget ||
    !doc.noUpload;

  const isUploaded = !!uploads[doc.id];

  return (
    <div
      onClick={() => hasDetails && setExpanded(x => !x)}
      style={{
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 400ms ease ${animDelay}ms, transform 400ms ease ${animDelay}ms, border-color 200ms ease, background 200ms ease`,
        borderRadius: 12,
        border:     isUploaded
          ? "1.5px solid #22c55e40"
          : checked
          ? `1.5px solid ${color}22`
          : "1.5px solid #f1f1ef",
        background: isUploaded ? "#f0fdf408" : checked ? `${color}06` : "#fff",
        overflow:   "hidden",
        cursor:     hasDetails ? "pointer" : "default",
      }}
    >
      {/* ── Row header ── */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          aria-label={checked ? "Mark as not ready" : "Mark as ready"}
          style={{
            width:      22,
            height:     22,
            borderRadius: 6,
            flexShrink: 0,
            border:     checked ? `2px solid ${color}` : "2px solid #d1d5db",
            background: checked ? color : "transparent",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:     "pointer",
            transition: "all 180ms ease",
            marginTop:  1,
          }}
        >
          {checked && (
            <svg width="11" height="11" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize:       13.5,
                fontWeight:     600,
                color:          checked ? "#6b7280" : "#111827",
                textDecoration: checked ? "line-through" : "none",
                transition:     "color 180ms ease",
              }}
            >
              {doc.name}
            </span>

            {/* Badges — now use shared <Badge> with light theme */}
            {doc.status === "optional" && (
              <Badge variant="optional" theme="light" />
            )}
            {doc.noUpload && (
              <Badge variant="hardcopy" theme="light" />
            )}
            {isUploaded && !doc.noUpload && (
              <Badge variant="uploaded" theme="light" />
            )}
          </div>

          <p style={{ fontSize: 12, color: "#9ca3af", margin: "3px 0 0", lineHeight: 1.5 }}>
            {doc.description}
          </p>

          {doc.notes && (
            <span style={{ fontSize: 11, color: "#6b7280", marginTop: 4, display: "block", fontStyle: "italic" }}>
              ℹ️ {doc.notes}
            </span>
          )}
        </div>

        {/* Chevron */}
        {hasDetails && (
          <div style={{ flexShrink: 0, color: "#9ca3af", display: "flex", alignItems: "center", paddingTop: 2 }}>
            <svg
              width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 250ms ease" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div onClick={e => e.stopPropagation()}>

          {/* Tips & accepted formats */}
          {((doc.tips?.length ?? 0) > 0 || (doc.acceptedFormats?.length ?? 0) > 0) && (
            <div style={{ borderTop: `1px solid ${color}18`, background: `${color}06`, padding: "10px 16px 12px 50px" }}>
              {(doc.tips?.length ?? 0) > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Tips &amp; Requirements
                  </p>
                  {doc.tips!.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4, alignItems: "flex-start" }}>
                      <span style={{ color, marginTop: 1, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </>
              )}
              {(doc.acceptedFormats?.length ?? 0) > 0 && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Accepted Formats
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {doc.acceptedFormats!.map((fmt, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize:   11,
                          color:      "#374151",
                          background: "#f3f4f6",
                          border:     "1px solid #e5e7eb",
                          padding:    "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special widgets */}
          {doc.specialWidget === "photo_spec" && <PhotoSpecWidget color={color} />}

          {doc.specialWidget === "visa_form" && (
            <VisaFormWidget doc={doc} color={color} />
          )}

          {doc.specialWidget === "itinerary" && itineraryData && (
            <ItineraryWidget
              color={color}
              countryName={itineraryData.countryName}
              cities={itineraryData.cities}
              typeColors={itineraryData.typeColors}
              onPdfReady={file => onItineraryReady(doc.id, file)}
            />
          )}

          {/* Upload slot */}
          {!doc.noUpload && (
            <div style={{ padding: "0 16px 14px 16px", borderTop: `1px solid ${color}0a` }}>
              <UploadSlot
                docId={doc.id}
                docName={doc.name}
                color={color}
                uploads={uploads}
                onUpload={onUpload}
                onRemove={onRemove}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}