export default function StepDocuments() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      background: "rgba(255,255,255,0.03)",
      border: "0.5px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "rgba(108,92,231,0.12)",
        border: "0.5px solid rgba(108,92,231,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <svg width="22" height="22" fill="none" stroke="#a89cef" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
        Your documents will appear here
      </div>
      <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, lineHeight: 1.6, maxWidth: 280 }}>
        Complete the checklist above to generate your personalised document list
      </div>
    </div>
  );
}