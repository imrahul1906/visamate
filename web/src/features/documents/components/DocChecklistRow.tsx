import Badge from "@/components/shared/Badge";
import { T } from "@/lib/theme";
import type { DocumentItem } from "../../../types/document";

interface DocRowProps {
  doc: DocumentItem;
  isActive: boolean;
  isDone: boolean;
  isUploaded: boolean;
  badge: string | null;
  onSelect: () => void;
  onToggle: (e: React.MouseEvent) => void;
}

export function DocChecklistRow({ doc, isActive, isDone, isUploaded, badge, onSelect, onToggle }: DocRowProps) {
  let rowClass = "vm-doc-row";
  if (isActive) rowClass += " vm-active";
  if (isDone) rowClass += " vm-done";

  return (
    <div className={rowClass} onClick={onSelect}>
      {/* Checkbox */}
      <button
        className={`vm-checkbox-btn${isDone ? " vm-checked" : ""}`}
        onClick={onToggle}
        aria-label={isDone ? "Mark as not ready" : "Mark as ready"}
      >
        {isDone && (
          <svg width="9" height="9" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </button>

      {/* Name */}
      <span style={{
        flex: 1,
        minWidth: 0,
        fontSize: 12,
        fontWeight: 500,
        color: isDone ? T.muted : T.text,
        textDecoration: isDone ? "line-through" : "none",
        lineHeight: 1.3,
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        wordBreak: "break-word",
        paddingRight: 4,
      }}>
        {doc.name}
      </span>

      {/* Badges */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
        {isUploaded && <Badge variant="uploaded" theme="dark" />}
        {badge && !isUploaded && (
          <Badge
            variant={
              badge === "Builder" ? "builder"
                : badge === "Spec" ? "spec"
                  : badge === "Form" ? "form"
                    : "uploadable"
            }
            theme="dark"
          />
        )}
      </div>

      {/* Chevron */}
      <svg
        width="12" height="12" fill="none" stroke={isActive ? T.indigoLight : T.muted}
        strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  );
}

// Helper: derive badge label for a doc
export function getDocBadge(doc: DocumentItem): string | null {
  if (doc.specialWidget === "itinerary" || doc.specialWidget === "cover_letter" || doc.specialWidget === "sponsor_consent") return "Builder";
  if (doc.specialWidget === "photo_spec") return "Spec";
  if (doc.specialWidget === "visa_form") return "Form";
  if (!doc.noUpload) return "Upload";
  return null;
}