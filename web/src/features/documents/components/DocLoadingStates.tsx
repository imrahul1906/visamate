interface LoadingStateProps {
  embedded: boolean;
}

export function LoadingState({ embedded }: LoadingStateProps) {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent",
      minHeight: embedded ? 200 : "calc(100vh - 56px)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.08)",
          borderTopColor: "#818cf8",
          margin: "0 auto 14px",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
          Loading your document checklist…
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  embedded: boolean;
  error: string;
  onGoBack?: () => void;
}

export function ErrorState({ embedded, error, onGoBack }: ErrorStateProps) {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent", padding: 24,
      minHeight: embedded ? 200 : "calc(100vh - 56px)",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        border: "1px solid rgba(239,68,68,0.3)",
        padding: "28px 24px", maxWidth: 400, textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>
          Could not load documents
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
        {!embedded && onGoBack && (
          <button
            onClick={onGoBack}
            style={{
              fontSize: 13, fontWeight: 600, color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}
