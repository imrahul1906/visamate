interface UploadProgressBannerProps {
  uploadCount: number;
  uploadableCount: number;
  onDownloadAll: () => void;
}

export function UploadProgressBanner({ uploadCount, uploadableCount, onDownloadAll }: UploadProgressBannerProps) {
  if (uploadCount === 0) return null;

  return (
    <div style={{
      background: "rgba(34,197,94,0.08)", borderRadius: 12,
      border: "1px solid rgba(34,197,94,0.2)",
      padding: "12px 16px", marginBottom: 12,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: "rgba(34,197,94,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        border: "1px solid rgba(34,197,94,0.25)",
      }}>
        <span style={{ fontSize: 16 }}>📁</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", fontFamily: "'DM Sans', sans-serif" }}>
            Document Folder Ready
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
            {uploadCount} of {uploadableCount} uploaded
          </span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(uploadCount / uploadableCount) * 100}%`,
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
            borderRadius: 2, transition: "width 400ms ease",
          }} />
        </div>
      </div>

      <button
        onClick={onDownloadAll}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(22,163,74,0.8)", color: "#fff", border: "1px solid rgba(74,222,128,0.3)",
          borderRadius: 8, padding: "7px 14px", cursor: "pointer",
          fontSize: 11, fontWeight: 700, flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <svg width="12" height="12" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download ZIP
      </button>
    </div>
  );
}
