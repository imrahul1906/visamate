"use client";

// web\src\features\documents\PhotoSpecWidget.tsx

interface PhotoSpec {
  widthMm: number;
  heightMm: number;
  background?: string;
  colorFormat?: string;
  faceVisibilityPercent?: string;
  quality?: string;
  maxAgeMonths?: number;
}

export default function PhotoSpecWidget({
  color,
  photoSpec,
}: {
  color: string;
  photoSpec?: PhotoSpec;
}) {
  // Fall back to standard passport photo dimensions if no spec provided
  const widthMm = photoSpec?.widthMm ?? 35;
  const heightMm = photoSpec?.heightMm ?? 45;
  const background = photoSpec?.background ?? "Plain white";
  const faceVisibility = photoSpec?.faceVisibilityPercent ?? "70–80";
  const quality = photoSpec?.quality ?? "Good quality paper";
  const maxAgeMonths = photoSpec?.maxAgeMonths ?? 6;

  const SCALE = 4.5;
  // widthMm drives the horizontal axis (W), heightMm drives the vertical axis (H)
  const W = Math.round(widthMm * SCALE);
  const H = Math.round(heightMm * SCALE);

  const faceTop = Math.round(0.12 * H);
  const faceBottom = Math.round(0.88 * H);
  const faceLeft = Math.round(0.15 * W);
  const faceRight = Math.round(0.85 * W);

  return (
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${color}18`, background: `${color}05` }}>
      <p style={{ fontSize: 11, fontWeight: 700, color, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Photo Specifications — {heightMm} × {widthMm} mm
      </p>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexShrink: 0, marginBottom: 28, marginRight: 52 }}>
          <div style={{
            width: W, height: H,
            border: `2px solid ${color}`,
            background: "#f0f4ff",
            position: "relative",
            borderRadius: 3,
            overflow: "visible",
          }}>
            {/* Face zone ellipse */}
            <div style={{
              position: "absolute",
              top: faceTop, left: faceLeft,
              width: faceRight - faceLeft,
              height: faceBottom - faceTop,
              border: `1.5px dashed ${color}aa`,
              borderRadius: "50%",
              background: `${color}08`,
            }} />

            {/* Bottom width label */}
            <div style={{
              position: "absolute", bottom: -26, left: 0, width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
            }}>
              <div style={{ height: 1, flex: 1, background: color }} />
              <span style={{ fontSize: 9, fontWeight: 700, color, whiteSpace: "nowrap" }}>{widthMm} mm</span>
              <div style={{ height: 1, flex: 1, background: color }} />
            </div>

            {/* Right height label */}
            <div style={{
              position: "absolute", right: -48, top: 0, height: "100%",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
            }}>
              <div style={{ width: 1, flex: 1, background: color }} />
              <span style={{
                fontSize: 9, fontWeight: 700, color, whiteSpace: "nowrap",
                writingMode: "vertical-rl", transform: "rotate(180deg)",
              }}>{heightMm} mm</span>
              <div style={{ width: 1, flex: 1, background: color }} />
            </div>

            {/* Face zone label */}
            <div style={{
              position: "absolute",
              top: faceTop + (faceBottom - faceTop) / 2 - 8,
              left: 0, width: "100%",
              textAlign: "center",
              fontSize: 8, fontWeight: 700, color, opacity: 0.7,
            }}>
              face zone<br />{faceVisibility}%
            </div>
          </div>
        </div>

        {/* Spec list */}
        <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.8, flex: 1, minWidth: 160 }}>
          {[
            ["Size", `${heightMm} mm (H) × ${widthMm} mm (W)`],
            ["Background", background],
            ["Face coverage", `${faceVisibility}% of frame`],
            ["Format", `Colour, ${quality.toLowerCase()}`],
            ["Max age", `Taken within last ${maxAgeMonths} months`],
            ["Gaze", "Straight forward, eyes open"],
            ["Glasses", "Not recommended"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 6 }}>
              <span style={{ fontWeight: 600, color, minWidth: 110, flexShrink: 0 }}>{k}:</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 20, background: "#fef3c7", border: "1px solid #fcd34d",
        borderRadius: 8, padding: "8px 12px",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <span style={{ fontSize: 16 }}>📌</span>
        <span style={{ fontSize: 11, color: "#92400e", fontWeight: 500 }}>
          Physical print required — digital upload not accepted for this item.
        </span>
      </div>
    </div>
  );
}