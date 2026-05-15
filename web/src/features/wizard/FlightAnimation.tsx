// visamate/web/src/features/wizard/FlightAnimation.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const COUNTRY_COORDS: Record<string, { x: number; y: number; label: string; flag: string }> = {
  IN: { x: 620, y: 220, label: "India", flag: "🇮🇳" },
  JP: { x: 790, y: 175, label: "Japan", flag: "🇯🇵" },
  CN: { x: 745, y: 195, label: "China", flag: "🇨🇳" },
  SG: { x: 730, y: 270, label: "Singapore", flag: "🇸🇬" },
  TH: { x: 710, y: 245, label: "Thailand", flag: "🇹🇭" },
  AE: { x: 575, y: 225, label: "UAE", flag: "🇦🇪" },
  SA: { x: 555, y: 235, label: "Saudi Arabia", flag: "🇸🇦" },
  QA: { x: 565, y: 228, label: "Qatar", flag: "🇶🇦" },
  MY: { x: 720, y: 265, label: "Malaysia", flag: "🇲🇾" },
  ID: { x: 740, y: 285, label: "Indonesia", flag: "🇮🇩" },
  PH: { x: 760, y: 255, label: "Philippines", flag: "🇵🇭" },
  KR: { x: 775, y: 180, label: "South Korea", flag: "🇰🇷" },
  NP: { x: 638, y: 210, label: "Nepal", flag: "🇳🇵" },
  LK: { x: 632, y: 255, label: "Sri Lanka", flag: "🇱🇰" },
  BD: { x: 658, y: 215, label: "Bangladesh", flag: "🇧🇩" },
  PK: { x: 610, y: 205, label: "Pakistan", flag: "🇵🇰" },
  VN: { x: 728, y: 240, label: "Vietnam", flag: "🇻🇳" },
  KH: { x: 720, y: 250, label: "Cambodia", flag: "🇰🇭" },
  MM: { x: 700, y: 230, label: "Myanmar", flag: "🇲🇲" },
  GB: { x: 430, y: 140, label: "United Kingdom", flag: "🇬🇧" },
  DE: { x: 465, y: 148, label: "Germany", flag: "🇩🇪" },
  FR: { x: 450, y: 158, label: "France", flag: "🇫🇷" },
  IT: { x: 470, y: 168, label: "Italy", flag: "🇮🇹" },
  ES: { x: 440, y: 170, label: "Spain", flag: "🇪🇸" },
  NL: { x: 455, y: 143, label: "Netherlands", flag: "🇳🇱" },
  CH: { x: 462, y: 156, label: "Switzerland", flag: "🇨🇭" },
  SE: { x: 475, y: 128, label: "Sweden", flag: "🇸🇪" },
  NO: { x: 465, y: 122, label: "Norway", flag: "🇳🇴" },
  PT: { x: 433, y: 170, label: "Portugal", flag: "🇵🇹" },
  GR: { x: 490, y: 172, label: "Greece", flag: "🇬🇷" },
  AT: { x: 472, y: 154, label: "Austria", flag: "🇦🇹" },
  BE: { x: 453, y: 146, label: "Belgium", flag: "🇧🇪" },
  PL: { x: 482, y: 143, label: "Poland", flag: "🇵🇱" },
  CZ: { x: 474, y: 148, label: "Czech Republic", flag: "🇨🇿" },
  HU: { x: 480, y: 155, label: "Hungary", flag: "🇭🇺" },
  RO: { x: 492, y: 158, label: "Romania", flag: "🇷🇴" },
  DK: { x: 465, y: 135, label: "Denmark", flag: "🇩🇰" },
  FI: { x: 487, y: 122, label: "Finland", flag: "🇫🇮" },
  US: { x: 190, y: 185, label: "United States", flag: "🇺🇸" },
  CA: { x: 175, y: 160, label: "Canada", flag: "🇨🇦" },
  MX: { x: 165, y: 230, label: "Mexico", flag: "🇲🇽" },
  BR: { x: 265, y: 305, label: "Brazil", flag: "🇧🇷" },
  AR: { x: 250, y: 360, label: "Argentina", flag: "🇦🇷" },
  ZA: { x: 510, y: 345, label: "South Africa", flag: "🇿🇦" },
  NG: { x: 465, y: 270, label: "Nigeria", flag: "🇳🇬" },
  EG: { x: 510, y: 205, label: "Egypt", flag: "🇪🇬" },
  KE: { x: 535, y: 285, label: "Kenya", flag: "🇰🇪" },
  ET: { x: 535, y: 268, label: "Ethiopia", flag: "🇪🇹" },
  GH: { x: 450, y: 268, label: "Ghana", flag: "🇬🇭" },
  MA: { x: 440, y: 195, label: "Morocco", flag: "🇲🇦" },
  AU: { x: 790, y: 345, label: "Australia", flag: "🇦🇺" },
  NZ: { x: 860, y: 385, label: "New Zealand", flag: "🇳🇿" },
};

const INDIA = COUNTRY_COORDS["IN"];

// ─── High-quality Natural Earth-inspired continent outlines ───────────────────
// ViewBox: 80 95 860 315
const CONTINENT_PATHS = [
  // ── North America ──────────────────────────────────────────────────────────
  // Alaska
  `M 88 152 C 90 145 95 138 103 132 C 110 126 120 120 132 116
   C 144 112 158 109 174 108 C 190 107 206 109 220 114
   C 234 119 245 127 252 138 C 258 148 260 160 257 173
   C 254 186 247 198 238 210 C 229 221 218 231 206 240
   C 195 249 184 256 174 261 C 164 266 156 267 149 263
   C 143 259 139 251 135 242 C 131 232 127 221 121 212
   C 115 203 108 195 103 186 C 97 177 92 167 88 157 Z`,
  // Baja California
  `M 148 232 C 152 226 157 222 162 224 C 166 226 167 234 165 244
   C 163 253 158 260 153 258 C 148 256 145 246 148 232 Z`,
  // Central America / Yucatan
  `M 174 261 C 180 256 188 253 196 255 C 203 257 207 263 205 271
   C 204 278 199 283 193 282 C 187 281 181 275 177 268 Z`,
  // Cuba
  `M 196 224 C 202 220 210 219 216 222 C 220 225 220 230 215 233
   C 209 236 201 234 197 230 Z`,
  // ── South America ──────────────────────────────────────────────────────────
  `M 205 271 C 211 264 220 259 231 257 C 243 255 255 259 265 266
   C 274 273 281 283 285 295 C 289 308 290 323 287 338
   C 284 353 278 368 270 381 C 262 393 252 401 241 403
   C 230 404 220 398 212 388 C 204 378 199 364 196 349
   C 193 334 193 318 195 303 C 197 288 201 279 205 271 Z`,
  // ── Europe ────────────────────────────────────────────────────────────────
  // Iberian Peninsula
  `M 424 163 C 430 156 440 152 450 153 C 460 154 466 161 464 170
   C 462 178 454 183 444 182 C 434 181 425 174 424 163 Z`,
  // Italy boot
  `M 466 159 C 472 154 480 155 485 161 C 490 167 491 176 488 185
   C 486 193 481 198 476 197 C 471 196 467 189 465 180
   C 463 170 463 164 466 159 Z`,
  // Main Europe body (UK to Poland, includes France, Germany, Scandinavia base)
  `M 416 130 C 424 120 438 114 454 112 C 470 110 487 114 502 120
   C 516 126 526 135 528 146 C 530 156 524 165 514 170
   C 505 175 494 175 485 172 C 476 169 470 162 464 162
   C 458 162 451 166 444 170 C 437 174 429 175 422 171
   C 415 167 412 155 414 143 Z`,
  // Scandinavian Peninsula
  `M 454 112 C 460 100 470 92 482 90 C 493 88 503 94 508 104
   C 513 114 510 126 502 133 C 494 140 484 142 476 138
   C 468 134 460 124 454 112 Z`,
  // UK & Ireland blob
  `M 415 126 C 420 116 430 110 440 112 C 450 114 456 123 453 133
   C 450 142 440 148 430 147 C 420 146 412 137 415 126 Z`,
  // ── Africa ────────────────────────────────────────────────────────────────
  `M 428 188 C 438 179 452 174 468 173 C 484 172 500 177 514 185
   C 528 193 539 205 545 220 C 551 235 552 252 549 268
   C 546 284 540 299 533 313 C 526 327 519 340 513 351
   C 507 362 501 370 494 371 C 487 372 480 365 473 354
   C 466 343 460 329 454 314 C 448 299 443 283 438 267
   C 433 251 429 234 427 218 C 425 202 426 194 428 188 Z`,
  // Horn of Africa
  `M 549 256 C 556 249 565 247 572 251 C 578 255 579 264 574 271
   C 569 277 560 278 553 274 C 546 270 545 262 549 256 Z`,
  // Madagascar
  `M 545 290 C 550 282 558 279 565 283 C 572 287 573 298 569 309
   C 565 319 556 324 549 319 C 542 314 540 301 545 290 Z`,
  // ── Asia main body ────────────────────────────────────────────────────────
  `M 514 130 C 534 120 558 113 585 109 C 612 105 640 106 668 110
   C 695 114 720 121 742 130 C 763 139 780 150 791 163
   C 801 175 803 189 797 202 C 791 214 778 222 763 226
   C 748 230 732 228 718 220 C 705 213 696 200 684 196
   C 672 192 659 196 646 196 C 633 196 620 192 610 200
   C 600 208 594 222 584 228 C 574 234 562 234 550 228
   C 538 222 528 210 520 198 C 512 186 508 173 508 160
   C 508 148 510 138 514 130 Z`,
  // Caspian/Aral region bump (fills gap between Europe and Asia)
  `M 528 162 C 534 155 542 152 550 155 C 558 158 561 166 558 175
   C 555 183 547 187 539 184 C 531 181 525 172 528 162 Z`,
  // Indian Subcontinent peninsula
  `M 600 216 C 610 210 622 208 632 212 C 642 216 648 226 647 238
   C 646 250 639 261 630 267 C 621 272 611 269 605 260
   C 599 251 598 238 600 226 Z`,
  // Sri Lanka
  `M 629 264 C 634 260 640 261 643 267 C 646 273 643 280 637 282
   C 631 283 626 278 626 272 Z`,
  // Arabian Peninsula
  `M 548 228 C 556 218 568 213 580 216 C 592 219 599 230 597 244
   C 595 257 585 267 573 268 C 561 269 550 260 547 247 Z`,
  // Indochina Peninsula
  `M 698 208 C 710 202 724 202 734 210 C 744 218 747 231 744 244
   C 741 256 732 265 721 267 C 710 269 700 262 696 250
   C 692 238 694 222 698 208 Z`,
  // Malay Peninsula
  `M 716 262 C 720 256 727 254 732 258 C 737 262 736 272 731 278
   C 726 283 719 281 716 275 Z`,
  // Sumatra
  `M 700 272 C 712 264 726 264 736 271 C 746 278 749 290 744 300
   C 739 309 727 313 714 309 C 701 305 696 293 700 280 Z`,
  // Java
  `M 724 296 C 733 290 744 289 752 295 C 760 301 760 312 752 318
   C 744 323 733 320 726 313 Z`,
  // Borneo
  `M 742 250 C 752 243 766 243 775 251 C 784 259 784 272 777 281
   C 770 289 756 291 746 284 C 736 277 736 263 742 250 Z`,
  // Philippines (Luzon)
  `M 758 238 C 765 231 774 230 780 236 C 786 242 784 252 777 257
   C 770 262 761 259 757 252 Z`,
  // Korea peninsula
  `M 769 177 C 775 170 784 168 790 173 C 796 178 796 188 790 194
   C 784 199 774 198 769 192 Z`,
  // Japan - Honshu (more elongated, correct NE orientation)
  `M 785 166 C 793 159 804 157 812 163 C 820 169 820 180 813 187
   C 806 193 795 193 788 187 C 781 181 780 172 785 166 Z`,
  // Japan - Kyushu
  `M 789 186 C 794 182 800 182 804 187 C 807 192 805 199 799 201
   C 793 203 788 199 787 193 Z`,
  // Taiwan
  `M 764 210 C 769 205 776 205 780 211 C 784 217 781 225 775 228
   C 769 230 762 225 762 219 Z`,
  // ── Australia ─────────────────────────────────────────────────────────────
  `M 756 322 C 768 308 786 300 808 298 C 830 296 852 302 866 315
   C 879 328 882 346 876 362 C 870 377 857 388 840 393
   C 823 397 804 393 788 382 C 772 371 760 354 756 338 Z`,
  // Cape York stub
  `M 826 298 C 832 288 840 284 847 288 C 853 292 852 303 845 310
   C 838 316 829 314 826 305 Z`,
  // New Zealand North Island
  `M 858 372 C 864 365 873 364 879 370 C 884 376 882 386 875 391
   C 868 395 860 392 857 385 Z`,
  // New Zealand South Island
  `M 857 388 C 863 383 870 383 875 390 C 879 397 876 406 869 409
   C 862 411 855 406 854 399 Z`,
  // ── Greenland ─────────────────────────────────────────────────────────────
  `M 330 82 C 346 72 366 68 386 70 C 406 72 420 82 424 96
   C 428 110 418 124 402 130 C 386 136 366 134 350 126
   C 334 118 326 104 330 88 Z`,
  // Iceland
  `M 390 112 C 396 106 405 105 411 110 C 417 115 415 124 408 128
   C 401 131 393 127 390 120 Z`,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getQuadraticControlPoint(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const arcHeight = Math.min(len * 0.3, 120);
  const px = -dy / len;
  const py = dx / len;
  const sign = py > 0 ? -1 : 1;
  return { cx: mx + sign * px * arcHeight, cy: my + sign * py * arcHeight };
}

function pointOnQuadratic(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) {
  const mt = 1 - t;
  const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
  const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
  const tx2 = 2 * (mt * (cx - x1) + t * (x2 - cx));
  const ty2 = 2 * (mt * (cy - y1) + t * (y2 - cy));
  return { x, y, angle: Math.atan2(ty2, tx2) * (180 / Math.PI) };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FlightAnimationProps {
  inline?: boolean;
  countryCode: string;
  countryName: string;
  onComplete: () => void;
}

export default function FlightAnimation({ inline = false, countryCode, countryName, onComplete }: FlightAnimationProps) {
  const dest = COUNTRY_COORDS[countryCode.toUpperCase()] ?? { x: 500, y: 200, label: countryName, flag: "🏳️" };
  const { cx, cy } = getQuadraticControlPoint(INDIA.x, INDIA.y, dest.x, dest.y);

  const [progress, setProgress] = useState(0);
  const [trailProgress, setTrailProgress] = useState(0);
  const [phase, setPhase] = useState<"flying" | "landing">("flying");
  // FIX 1: flagVisible tracks the "pop" animation — separate from the flag being rendered
  const [flagVisible, setFlagVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const DURATION = 1900;

  useEffect(() => {
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased);
      setTrailProgress(Math.max(0, eased - 0.06));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("landing");
        // FIX 1: trigger flag pop animation before calling onComplete
        // so the user actually sees it briefly before the wizard advances
        setTimeout(() => {
          setFlagVisible(true);
        }, 150);
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 900); // give 750ms for the flag to be seen before completing
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plane = pointOnQuadratic(INDIA.x, INDIA.y, cx, cy, dest.x, dest.y, progress);
  const arcPath = `M ${INDIA.x} ${INDIA.y} Q ${cx} ${cy} ${dest.x} ${dest.y}`;
  const dxLen = dest.x - INDIA.x;
  const dyLen = dest.y - INDIA.y;
  const approxLen = Math.sqrt(dxLen * dxLen + dyLen * dyLen) * 1.3;

  // FIX 1: compute a smooth opacity for the destination flag based on flight progress
  // It starts appearing at 50% progress, fully visible by 80%
  const destFlagProgressOpacity = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));

  const mapContent = (
    <>
      <style>{`
        @keyframes flagAppear {
          0%   { opacity: 0; transform: scale(0.4) translateY(8px); }
          55%  { opacity: 1; transform: scale(1.4) translateY(-4px); }
          75%  { transform: scale(0.9) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes destPulse {
          0%   { r: 6; opacity: 0.9; }
          100% { r: 26; opacity: 0; }
        }
      `}</style>

      {/* ── Route label (inline only) ── */}
      {inline && (
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 500,
          flexShrink: 0,
          marginBottom: 6,
        }}>
          🇮🇳 India &nbsp;→&nbsp; {dest.flag} {dest.label || countryName}
        </div>
      )}

      {/* ── World map SVG ── */}
      <svg
        viewBox="80 95 860 315"
        style={{ width: "100%", flex: 1, minHeight: 0, overflow: "visible" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Continent fills + strokes */}
        {CONTINENT_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(255,255,255,0.055)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={0.85}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Country dots */}
        {Object.entries(COUNTRY_COORDS).map(([code, c]) =>
          code !== "IN" && code !== countryCode.toUpperCase() ? (
            <circle key={code} cx={c.x} cy={c.y} r={2} fill="rgba(255,255,255,0.15)" />
          ) : null
        )}

        {/* Trail arc */}
        <path
          d={arcPath} fill="none"
          stroke="rgba(108,92,231,0.18)" strokeWidth={1.5}
          strokeDasharray={`${approxLen}`}
          strokeDashoffset={approxLen * (1 - trailProgress)}
          strokeLinecap="round"
        />

        {/* Main flight arc */}
        <path
          d={arcPath} fill="none"
          stroke="rgba(108,92,231,0.85)" strokeWidth={2.2}
          strokeDasharray={`${approxLen}`}
          strokeDashoffset={approxLen * (1 - progress)}
          strokeLinecap="round"
        />

        {/* India origin dot */}
        <circle cx={INDIA.x} cy={INDIA.y} r={5.5} fill="#6c5ce7" opacity={0.95} />
        <circle cx={INDIA.x} cy={INDIA.y} r={2.5} fill="#fff" />
        <text x={INDIA.x} y={INDIA.y + 13} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9} fontFamily="DM Sans, Inter, sans-serif">India</text>

        {/* India flag pin — always visible */}
        <foreignObject x={INDIA.x - 10} y={INDIA.y - 32} width={20} height={20} style={{ overflow: "visible" }}>
          <div style={{ fontSize: 14, lineHeight: 1, textAlign: "center", userSelect: "none" }}>
            🇮🇳
          </div>
        </foreignObject>

        {/* Destination dot */}
        {phase === "landing" ? (
          <>
            {/* Ripple ring */}
            <circle cx={dest.x} cy={dest.y} r={6} fill="none" stroke="rgba(108,92,231,0.6)" strokeWidth={1.5}>
              <animate attributeName="r" values="6;26" dur="0.65s" fill="freeze" />
              <animate attributeName="opacity" values="0.9;0" dur="0.65s" fill="freeze" />
            </circle>
            <circle cx={dest.x} cy={dest.y} r={6} fill="#6c5ce7" />
            <circle cx={dest.x} cy={dest.y} r={3} fill="#fff" />
          </>
        ) : (
          <circle cx={dest.x} cy={dest.y} r={3} fill="rgba(108,92,231,0.4)" />
        )}

        {/* Destination label fades in near end */}
        {progress > 0.65 && (
          <text
            x={dest.x} y={dest.y + 15}
            textAnchor="middle"
            fill="rgba(168,156,239,0.9)"
            fontSize={10} fontWeight="500"
            fontFamily="DM Sans, Inter, sans-serif"
            opacity={Math.min(1, (progress - 0.65) / 0.25)}
          >
            {dest.label || countryName}
          </text>
        )}

        {/* Plane (hidden after landing) */}
        {phase === "flying" && (
          <g transform={`translate(${plane.x}, ${plane.y}) rotate(${plane.angle})`}>
            <polygon points="-8,0 2,-4 8,0 2,3" fill="#fff" opacity={0.95} />
            <polygon points="-4,0 -8,4 -6,0 -8,-4" fill="rgba(255,255,255,0.5)" />
          </g>
        )}

        {/* FIX 1: Destination flag
            - During flight: fades in smoothly as plane approaches (opacity driven by progress)
            - On landing: pops with spring animation for delight
            - Uses an SVG <text> fallback for the emoji so it always renders reliably,
              with a foreignObject layered on top for browsers that support it */}
        
        {/* SVG text emoji fallback — always renders */}
        <text
          x={dest.x}
          y={dest.y - 20}
          textAnchor="middle"
          fontSize={16}
          opacity={flagVisible ? 1 : destFlagProgressOpacity * 0.7}
          style={{
            transition: "opacity 0.3s",
            userSelect: "none",
            fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
          }}
        >
          {dest.flag}
        </text>

        {/* foreignObject overlay for the pop animation on landing */}
        {flagVisible && (
          <foreignObject x={dest.x - 16} y={dest.y - 44} width={32} height={32} style={{ overflow: "visible" }}>
            <div style={{
              fontSize: 20,
              lineHeight: 1,
              textAlign: "center",
              userSelect: "none",
              filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.8))",
              animation: "flagAppear 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}>
              {dest.flag}
            </div>
          </foreignObject>
        )}
      </svg>
    </>
  );

  // ── Inline variant ──────────────────────────────────────────────────────────
  if (inline) {
    return (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        opacity: 1,
      }}>
        {mapContent}
      </div>
    );
  }

  // ── Full-screen fallback ────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(8,5,22,0.97)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ width: "90vw", maxWidth: 900, display: "flex", flexDirection: "column", gap: 8 }}>
        {mapContent}
      </div>
    </div>
  );
}