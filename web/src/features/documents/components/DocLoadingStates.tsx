import { T, font } from "@/components/shared/theme";

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
          border: `3px solid ${T.border2}`,
          borderTopColor: T.indigoLight,
          margin: "0 auto 14px",
          animation: "spin 0.7s linear infinite",
        }} />
        <p style={{ fontSize: 13, color: T.muted, fontFamily: font.sans }}>
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
        border: `1px solid ${T.redBorder}`,
        padding: "28px 24px", maxWidth: 400, textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 8px", fontFamily: font.sans }}>
          Could not load documents
        </p>
        <p style={{ fontSize: 13, color: T.muted, margin: "0 0 20px", fontFamily: font.sans }}>
          {error}
        </p>
        {!embedded && onGoBack && (
          <button
            onClick={onGoBack}
            style={{
              fontSize: 13, fontWeight: 600, color: "#fff",
              background: `linear-gradient(135deg, ${T.indigo}, ${T.indigoLight})`,
              border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer",
              fontFamily: font.sans,
            }}
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}
