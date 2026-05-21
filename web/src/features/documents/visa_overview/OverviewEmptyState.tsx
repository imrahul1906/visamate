// visa-overview/OverviewEmptyState.tsx
//
// Shown when visaType is null — no document selected yet.

import { T } from "@/components/shared/theme";

export function OverviewEmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.35,
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: T.text,
          margin: "0 0 8px",
          fontFamily: "'DM Serif Display', serif",
        }}
      >
        Select a document
      </p>
      <p
        style={{
          fontSize: 12,
          color: T.muted,
          margin: 0,
          lineHeight: 1.7,
          maxWidth: 260,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Click any item on the left to view details, upload files, or use
        built-in tools like the itinerary builder.
      </p>
    </div>
  );
}
