import { T } from "@/components/shared/theme";
import type { DocumentData, UploadsMap } from "../../../types/document";
import { DocRow, getDocBadge } from "./DocRow";

interface ChecklistPanelProps {
  data: DocumentData;
  activeDocId: string | null;
  checked: Record<string, boolean>;
  uploads: UploadsMap;
  totalDone: number;
  totalDocs: number;
  overallPct: number;
  onSelectDoc: (id: string) => void;
  onToggleDoc: (id: string) => void;
}

export function ChecklistPanel({
  data,
  activeDocId,
  checked,
  uploads,
  totalDone,
  totalDocs,
  overallPct,
  onSelectDoc,
  onToggleDoc,
}: ChecklistPanelProps) {
  return (
    <>
      {/* Compact progress bar header */}
      <div style={{
        padding: "14px 14px 10px",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Sans', sans-serif" }}>
            Checklist
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.indigoLight, fontFamily: "'DM Sans', sans-serif" }}>
            {totalDone}/{totalDocs} ready
          </span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${overallPct}%`,
            background: `linear-gradient(90deg, ${T.indigo}, ${T.indigoLight})`,
            borderRadius: 2, transition: "width 400ms ease",
          }} />
        </div>
      </div>

      {/* Scrollable doc list */}
      <div
        className="vm-left-scroll"
        style={{
          flex: 1, overflowY: "auto", padding: "10px 10px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.35) transparent",
        }}
      >
        {data.categories.map(cat => {
          const catDone = cat.documents.filter(d => checked[d.id]).length;
          const catTotal = cat.documents.length;

          return (
            <div key={cat.id} style={{ marginBottom: 18 }}>
              {/* Category label */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: cat.color,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {cat.label}
                </span>
                <div style={{ flex: 1, height: 1, background: `${cat.color}25` }} />
                <span style={{ fontSize: 9, fontWeight: 600, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {catDone}/{catTotal}
                </span>
              </div>

              {/* Doc rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {cat.documents.map(doc => (
                  <DocRow
                    key={doc.id}
                    doc={doc}
                    isActive={activeDocId === doc.id}
                    isDone={!!checked[doc.id]}
                    isUploaded={!!uploads[doc.id]}
                    badge={getDocBadge(doc)}
                    onSelect={() => onSelectDoc(doc.id)}
                    onToggle={(e) => { e.stopPropagation(); onToggleDoc(doc.id); }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer tip */}
        <div style={{
          marginTop: 10, padding: "10px 12px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.15)",
          borderLeft: `3px solid ${T.amber}`,
          borderRadius: 8,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.amber, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>
            💡 Pro Tip
          </p>
          <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            All photocopies must be on A4 size only. Upload digital copies to create a ready-to-send document folder.
          </p>
        </div>
      </div>
    </>
  );
}
