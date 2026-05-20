interface CompletionBannerProps {
  requiredDone: number;
  requiredTotal: number;
}

const bannerAnimation = `
  @keyframes completionBannerIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export function CompletionBanner({ requiredDone, requiredTotal }: CompletionBannerProps) {
  if (requiredDone !== requiredTotal || requiredTotal === 0) return null;

  return (
    <>
      <style>{bannerAnimation}</style>
      <div style={{
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(110,231,183,0.25)",
        borderRadius: 12, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
        animation: "completionBannerIn 0.25s ease forwards",
      }}>
      <span style={{ fontSize: 20 }}>🎉</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          All required documents ready!
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
          You're ready to submit your visa application.
        </p>
      </div>
    </div>
    </>
  );
}