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
  const wordmarkSize = size === "sm" ? "14.5px" : "15.5px";

  return (
    <div
      className={`vm-logo-container ${className || ""}`}
      style={{ display: "flex", alignItems: "center", gap: 9 }}
    >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
            overflow: "visible"
          }}
        >
          <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 32 32">
            <defs>
              {/* Vibrant ribbon gradient (electric blue to deep pink) */}
              <linearGradient id="vm-logo-ribbon-grad" x1="7.5" y1="12" x2="25.5" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              
              {/* Stamp ring gradient */}
              <linearGradient id="vm-logo-ring-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(165, 180, 252, 0.45)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.08)" />
              </linearGradient>

              {/* Glowing star/dot radial gradient */}
              <radialGradient id="vm-logo-dot-grad" cx="17" cy="7.5" r="2" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </radialGradient>
            </defs>

            {/* Dashed Passport Stamp Circle */}
            <circle
              className="vm-logo-ring"
              cx="16"
              cy="16"
              r="14"
              stroke="url(#vm-logo-ring-grad)"
              strokeWidth="1.2"
              strokeDasharray="3.5 2"
            />

            {/* Inner Concentric Stamp Ring */}
            <circle
              className="vm-logo-ring"
              cx="16"
              cy="16"
              r="11.5"
              stroke="url(#vm-logo-ring-grad)"
              strokeWidth="0.8"
              opacity="0.4"
            />

            {/* Subtle Globe Grid Lines */}
            <path
              d="M6 16c5 2 15 2 20 0"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.8"
            />
            <path
              d="M16 6c-2 5-2 15 0 20"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.8"
            />

            {/* Destination Compass Dot */}
            <circle
              className="vm-logo-beacon"
              cx="17"
              cy="7.5"
              r="2"
              fill="url(#vm-logo-dot-grad)"
              style={{
                filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.6))"
              }}
            />

            {/* Continuous VM Monogram & Checkmark Ribbon (Smooth Bezier Curve) */}
            <path
              className="vm-logo-ribbon"
              d="M7.5 12.5 C7.5 18, 9.5 21, 12.5 21 C15.2 21, 15.5 13.5, 17 13.5 C18.3 13.5, 19.3 18, 20.5 18 C21.7 18, 23.5 9.5, 25.5 9.5"
              stroke="url(#vm-logo-ribbon-grad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0 2px 6px rgba(139, 92, 246, 0.35))"
              }}
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