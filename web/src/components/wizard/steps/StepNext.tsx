export default function StepNext() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      background: "rgba(74,222,128,0.04)",
      border: "0.5px solid rgba(74,222,128,0.15)",
      borderRadius: 16,
      textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "rgba(74,222,128,0.1)",
        border: "0.5px solid rgba(74,222,128,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <svg width="22" height="22" fill="none" stroke="#4ade80" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
        You're all set!
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 1.6 }}>
        Next steps coming soon
      </div>
    </div>
  );
}