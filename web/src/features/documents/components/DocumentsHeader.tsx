interface DocumentsHeaderProps {
  embedded: boolean;
  countryName: string;
  visaTypeName: string;
  locationName: string;
  totalDone: number;
  totalDocs: number;
  requiredDone: number;
  requiredTotal: number;
  uploadCount: number;
  uploadableCount: number;
  downloadingZip: boolean;
  onDownloadAll: () => void;
}

export function DocumentsHeader({
  embedded,
  countryName,
  visaTypeName,
  locationName,
  totalDone,
  totalDocs,
  requiredDone,
  requiredTotal,
  uploadCount,
  uploadableCount,
  downloadingZip,
  onDownloadAll,
}: DocumentsHeaderProps) {
  const overallPct = totalDocs ? (totalDone / totalDocs) * 100 : 0;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(49,46,129,0.85) 60%, rgba(67,56,202,0.8) 100%)",
      borderRadius: embedded ? 14 : 20,
      padding: embedded ? "20px 20px 18px" : "28px 28px 24px",
      marginBottom: 16,
      position: "relative", overflow: "hidden",
      border: "1px solid rgba(129,140,248,0.25)",
      backdropFilter: "blur(12px)",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(129,140,248,0.15) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Breadcrumb pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {[
            { icon: "🌏", label: countryName },
            { icon: "📋", label: visaTypeName },
            { icon: "📍", label: locationName },
          ].map(({ icon, label }) => (
            <span key={label} style={{
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)",
              background: "rgba(255,255,255,0.1)",
              padding: "4px 12px", borderRadius: 20,
              display: "flex", alignItems: "center", gap: 5,
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: embedded ? 20 : 26,
          fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2,
        }}>
          Your Document Checklist
        </h1>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.5)",
          margin: "0 0 20px", lineHeight: 1.5,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {totalDocs} documents for your {visaTypeName} to {countryName}
        </p>

        {/* Progress bar */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "14px 16px",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
              Overall Progress
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", fontFamily: "'DM Sans', sans-serif" }}>
              {totalDone} / {totalDocs} ready
            </span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${overallPct}%`,
              background: "linear-gradient(90deg, #6366f1, #a5b4fc)",
              borderRadius: 3, transition: "width 500ms ease",
              boxShadow: "0 0 10px rgba(99,102,241,0.6)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              ✅ {requiredDone}/{requiredTotal} required · 📎 {uploadCount}/{uploadableCount} uploaded
            </span>
            {uploadCount > 0 && (
              <button
                className="vm-dl-btn"
                onClick={onDownloadAll}
                disabled={downloadingZip}
                style={{ opacity: downloadingZip ? 0.6 : 1, cursor: downloadingZip ? "default" : "pointer" }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {downloadingZip ? "Preparing…" : `Download All (${uploadCount})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
