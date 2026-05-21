"use client";

interface LogoProps {
  /** Render size variant. "sm" = footer (30px icon), "md" = header (32px icon, default) */
  size?: "sm" | "md";
  /** Hide the "AI-powered" pulsing badge. Badge is hidden in the footer by default. */
  showBadge?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showBadge = false, className }: LogoProps) {
  const iconSize = size === "sm" ? 30 : 32;
  const iconRadius = size === "sm" ? 8 : 9;
  const svgSize = size === "sm" ? 15 : 16;
  const wordmarkSize = size === "sm" ? "14.5px" : "15.5px";

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 9 }}
    >
        <div
          className="vm-logo-icon"
          style={{ width: iconSize, height: iconSize, borderRadius: iconRadius }}
        >
          <svg width={svgSize} height={svgSize} fill="none" viewBox="0 0 24 24">
            <path
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="vm-logo-wordmark" style={{ fontSize: wordmarkSize }}>
          Visa<span>Mate</span>
        </span>

        {showBadge && (
          <span className="vm-badge">
            <span className="vm-badge-dot" />
            AI-powered
          </span>
        )}
      </div>
  );
}