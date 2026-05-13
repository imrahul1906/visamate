interface StatStripProps {
  requiredCount: number;
  optionalCount: number;
  uploadCount: number;
}

export function StatStrip({ requiredCount, optionalCount, uploadCount }: StatStripProps) {
  const stats = [
    { label: "Required", value: requiredCount, accent: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
    { label: "Optional", value: optionalCount, accent: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
    { label: "Uploaded", value: uploadCount, accent: "#4ade80", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
      {stats.map(s => (
        <div key={s.label} className="vm-stat-card" style={{
          background: s.bg, borderRadius: 12, padding: "14px 16px",
          border: `1px solid ${s.border}`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: s.accent, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginTop: 5,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
