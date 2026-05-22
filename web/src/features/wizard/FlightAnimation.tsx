// visamate/web/src/features/wizard/FlightAnimation.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { COUNTRY_PATHS, COUNTRY_CENTERS } from "./MapData";

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const MAP_MIN_X = 30.767;
const MAP_MIN_Y = 241.591;
const MAP_WIDTH = 784.077;
const MAP_HEIGHT = 458.627;
const MAP_ASPECT = MAP_WIDTH / MAP_HEIGHT;

// Precise VFS origin hub coordinate locations in India
const ORIGIN_COORDS: Record<string, { x: number; y: number }> = {
  DELHI: { x: 594.3, y: 454.8 },
  MUMBAI: { x: 584.8, y: 480.3 },
  BENGALURU: { x: 595.2, y: 496.6 },
  CHENNAI: { x: 601.1, y: 496.3 },
  KOLKATA: { x: 618.9, y: 470.9 },
  HYDERABAD: { x: 597.1, y: 484.8 },
};

// Precise target country capital/major hub coordinates
const DESTINATION_CENTERS: Record<string, { x: number; y: number }> = {
  JP: { x: 725.0, y: 418.0 },       // Tokyo
  KR: { x: 698.0, y: 413.0 },       // Seoul
  US: { x: 236.0, y: 395.0 },       // Washington D.C.
  AU: { x: 795.0, y: 705.0 },       // Sydney / Canberra
  GB: { x: 413.0, y: 404.0 },       // London
  SG: { x: 650.0, y: 520.0 },       // Singapore
};

const DURATION_MS = 1500; // faster animation to reach destination quickly

const STATUS_STEPS = [
  "Scanning visa requirements…",
  "Verifying entry conditions…",
  "Compiling document checklist…",
  "Reviewing consulate rules…",
  "Personalising your guide…",
];

// ─────────────────────────────────────────────────────────
// Math helpers
// ─────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Great-circle control point: arcs NORTH (upward on Mercator) */
function getArcControlPoint(
  x1: number, y1: number,
  x2: number, y2: number
): { cx: number; cy: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular direction — always bow NORTH (negative y on SVG)
  const perpX = -dy / dist;
  const perpY = dx / dist;

  // Arc height proportional to distance, clamped for short routes
  const arcHeight = Math.min(dist * 0.28, 160);

  // Always make sure it bows upward (northward = lower y on SVG)
  const bow = perpY > 0 ? -arcHeight : arcHeight;

  return {
    cx: mx + perpX * Math.abs(bow) * 0.1,
    cy: my + bow,
  };
}

function pointOnQuadratic(
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number,
  t: number
): { x: number; y: number; angle: number } {
  const mt = 1 - t;
  const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
  const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
  const tx = 2 * (mt * (cx - x1) + t * (x2 - cx));
  const ty = 2 * (mt * (cy - y1) + t * (y2 - cy));
  return { x, y, angle: Math.atan2(ty, tx) * (180 / Math.PI) };
}

function getFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0))
    );
  } catch {
    return "🏳️";
  }
}

/** Approximate quadratic bezier arc length via 20-sample integration */
function approxArcLength(
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number
): number {
  const N = 20;
  let len = 0;
  let px = x1, py = y1;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const pt = pointOnQuadratic(x1, y1, cx, cy, x2, y2, t);
    const dx = pt.x - px;
    const dy = pt.y - py;
    len += Math.sqrt(dx * dx + dy * dy);
    px = pt.x;
    py = pt.y;
  }
  return len;
}

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface FlightAnimationProps {
  inline?: boolean;
  countryCode: string;
  countryName: string;
  onComplete: () => void;
  originLocationCode?: string;
  isLanded?: boolean;
}

// ─────────────────────────────────────────────────────────
// Particle trail system
// ─────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  age: number; // 0 = fresh, 1 = dead
  lifetime: number;
  size: number;
  opacity: number;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function FlightAnimation({
  inline = false,
  countryCode,
  countryName,
  onComplete,
  originLocationCode,
  isLanded = false,
}: FlightAnimationProps) {
  const targetCode = countryCode.toUpperCase() === "UK" ? "GB" : countryCode.toUpperCase();
  const destFlag = useMemo(() => getFlagEmoji(targetCode), [targetCode]);

  // ── Origin: selected VFS center or fallback to Delhi ──
  const originX = useMemo(() => {
    if (originLocationCode && ORIGIN_COORDS[originLocationCode.toUpperCase()]) {
      return ORIGIN_COORDS[originLocationCode.toUpperCase()].x;
    }
    return ORIGIN_COORDS.DELHI.x;
  }, [originLocationCode]);

  const originY = useMemo(() => {
    if (originLocationCode && ORIGIN_COORDS[originLocationCode.toUpperCase()]) {
      return ORIGIN_COORDS[originLocationCode.toUpperCase()].y;
    }
    return ORIGIN_COORDS.DELHI.y;
  }, [originLocationCode]);

  const originName = useMemo(() => {
    if (originLocationCode) {
      const code = originLocationCode.toLowerCase();
      return code.charAt(0).toUpperCase() + code.slice(1);
    }
    return "India";
  }, [originLocationCode]);

  // ── Destination center ──
  const destCenter = COUNTRY_CENTERS[targetCode] ?? { x: 400, y: 350, w: 10, h: 10 };
  const destX = useMemo(() => {
    if (DESTINATION_CENTERS[targetCode]) {
      return DESTINATION_CENTERS[targetCode].x;
    }
    return destCenter.x + destCenter.w / 2;
  }, [targetCode, destCenter]);

  const destY = useMemo(() => {
    if (DESTINATION_CENTERS[targetCode]) {
      return DESTINATION_CENTERS[targetCode].y;
    }
    return destCenter.y + destCenter.h / 2;
  }, [targetCode, destCenter]);

  // ── Arc control point ──
  const { cx: arcCx, cy: arcCy } = useMemo(
    () => getArcControlPoint(originX, originY, destX, destY),
    [originX, originY, destX, destY]
  );

  // ── Arc length for dash animation ──
  const arcLength = useMemo(
    () => approxArcLength(originX, originY, arcCx, arcCy, destX, destY),
    [originX, originY, arcCx, arcCy, destX, destY]
  );

  // ── Animation state ──
  const [progress, setProgress] = useState(isLanded ? 1 : 0);
  const [phase, setPhase] = useState<"flying" | "arrived">(isLanded ? "arrived" : "flying");
  const [statusIdx, setStatusIdx] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const particleIdRef = useRef(0);
  const lastParticleTimeRef = useRef(0);

  // ── Camera viewport: computed once from route bbox ──
  const routeViewBox = useMemo(() => {
    const xMin = Math.min(originX, destX, arcCx);
    const xMax = Math.max(originX, destX, arcCx);
    const yMin = Math.min(originY, destY, arcCy);
    const yMax = Math.max(originY, destY, arcCy);

    const padX = Math.max(100, (xMax - xMin) * 0.32);
    const padY = Math.max(80, (yMax - yMin) * 0.32);

    let vx = xMin - padX;
    let vy = yMin - padY;
    let vw = (xMax - xMin) + padX * 2;
    let vh = (yMax - yMin) + padY * 2;

    // Enforce map aspect ratio
    const aspect = vw / vh;
    if (aspect > MAP_ASPECT) {
      const extra = vw / MAP_ASPECT - vh;
      vy -= extra / 2;
      vh = vw / MAP_ASPECT;
    } else {
      const extra = vh * MAP_ASPECT - vw;
      vx -= extra / 2;
      vw = vh * MAP_ASPECT;
    }

    // Clamp to map bounds
    vw = Math.min(MAP_WIDTH, vw);
    vh = Math.min(MAP_HEIGHT, vh);
    vx = Math.max(MAP_MIN_X, Math.min(MAP_MIN_X + MAP_WIDTH - vw, vx));
    vy = Math.max(MAP_MIN_Y, Math.min(MAP_MIN_Y + MAP_HEIGHT - vh, vy));

    return { vx, vy, vw, vh };
  }, [originX, originY, destX, destY, arcCx, arcCy]);

  // ── Animate ──
  useEffect(() => {
    if (isLanded) {
      setProgress(1);
      setPhase("arrived");
      return;
    }

    // Status message cycling
    const statusInterval = setInterval(() => {
      setStatusIdx((i) => Math.min(i + 1, STATUS_STEPS.length - 1));
    }, DURATION_MS / STATUS_STEPS.length);

    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const raw = Math.min((now - startRef.current) / DURATION_MS, 1);
      const eased = easeInOutCubic(raw);
      setProgress(eased);

      // Spawn particles along the trail (only while flying and past 2%)
      if (raw > 0.02 && raw < 0.98) {
        const timeSinceLast = now - lastParticleTimeRef.current;
        if (timeSinceLast > 18) { // ~50 particles/sec for faster animation
          lastParticleTimeRef.current = now;
          const pt = pointOnQuadratic(originX, originY, arcCx, arcCy, destX, destY, eased);
          const newParticle: Particle = {
            id: particleIdRef.current++,
            x: pt.x + (Math.random() - 0.5) * 4,
            y: pt.y + (Math.random() - 0.5) * 4,
            age: 0,
            lifetime: 0.6 + Math.random() * 0.8,
            size: 1 + Math.random() * 2.5,
            opacity: 0.6 + Math.random() * 0.4,
          };
          setParticles((prev) => {
            // Cull dead particles
            const alive = prev.filter((p) => p.age < p.lifetime);
            return [...alive, newParticle];
          });
        }
      }

      // Age particles
      setParticles((prev) =>
        prev.map((p) => ({ ...p, age: p.age + 0.016 })).filter((p) => p.age < p.lifetime)
      );

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("arrived");

        const t1 = setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 450);
        timeoutRefs.current.push(t1);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearInterval(statusInterval);
      timeoutRefs.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived values ──
  const plane = useMemo(
    () => pointOnQuadratic(originX, originY, arcCx, arcCy, destX, destY, progress),
    [progress, originX, originY, arcCx, arcCy, destX, destY]
  );

  const arcPath = `M ${originX} ${originY} Q ${arcCx} ${arcCy} ${destX} ${destY}`;

  // Camera pans VERY subtly toward the plane
  const cameraViewport = useMemo(() => {
    const { vx, vy, vw, vh } = routeViewBox;
    const centerX = vx + vw / 2;
    const centerY = vy + vh / 2;
    const nudgeX = (plane.x - centerX) * 0.06;
    const nudgeY = (plane.y - centerY) * 0.06;
    const nx = Math.max(MAP_MIN_X, Math.min(MAP_MIN_X + MAP_WIDTH - vw, vx + nudgeX));
    const ny = Math.max(MAP_MIN_Y, Math.min(MAP_MIN_Y + MAP_HEIGHT - vh, vy + nudgeY));
    return { nx, ny, vw, vh };
  }, [routeViewBox, plane.x, plane.y]);

  const cameraViewBox = `${cameraViewport.nx} ${cameraViewport.ny} ${cameraViewport.vw} ${cameraViewport.vh}`;

  // Source badge is always visible from the start
  const sourceBadgeOpacity = 1;

  // Destination badge fades in when plane approaches destination and remains visible on arrival
  const destBadgeOpacity = phase === "arrived" ? 1 : Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  // Position HTML badges exactly over SVG coordinates
  const getHtmlBadgeStyle = (x: number, y: number, opacity: number) => {
    const { nx, ny, vw, vh } = cameraViewport;
    const left = ((x - nx) / vw) * 100;
    const top = ((y - ny) / vh) * 100;
    return {
      position: "absolute" as const,
      left: `${left}%`,
      top: `${top}%`,
      transform: "translate(-50%, -100%) translateY(-12px)",
      opacity,
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: "none" as const,
      zIndex: 10,
    };
  };

  // Glow halo intensifies as plane approaches
  const destGlowIntensity = Math.max(0, progress - 0.5) / 0.5;

  // ── SVG map ──
  const mapSvg = (
    <svg
      viewBox={cameraViewBox}
      style={{ width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Ocean */}
        <radialGradient id="fa-oceanGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#0d1f3c" />
          <stop offset="100%" stopColor="#060d1a" />
        </radialGradient>

        {/* Land */}
        <linearGradient id="fa-landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16304f" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#0f2238" stopOpacity={0.95} />
        </linearGradient>

        {/* Engine exhaust trail gradient */}
        <linearGradient id="fa-engineTrailGrad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
        </linearGradient>

        {/* Flight path gradient — blue → gold */}
        <linearGradient
          id="fa-pathGrad"
          gradientUnits="userSpaceOnUse"
          x1={originX} y1={originY}
          x2={destX} y2={destY}
        >
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.95} />
        </linearGradient>

        {/* Ghost path (undrawn route) */}
        <linearGradient
          id="fa-ghostGrad"
          gradientUnits="userSpaceOnUse"
          x1={originX} y1={originY}
          x2={destX} y2={destY}
        >
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.12} />
        </linearGradient>

        {/* Plane glow */}
        <filter id="fa-planeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Path glow */}
        <filter id="fa-pathGlow" x="-15%" y="-80%" width="130%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Burst glow for destination */}
        <filter id="fa-burstGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Latitude grid pattern */}
        <pattern id="fa-grid" x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">
          <path d="M50 0 L0 0 0 36" fill="none" stroke="rgba(255,255,255,0.028)" strokeWidth={0.5} />
        </pattern>

        {/* Plane halo (radial, follows plane) */}
        <radialGradient id="fa-planeHalo" cx={plane.x} cy={plane.y} r="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
        </radialGradient>

        {/* Destination aura */}
        <radialGradient id="fa-destAura" cx={destX} cy={destY} r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3 * destGlowIntensity} />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity={0.08 * destGlowIntensity} />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
        </radialGradient>

        {/* Origin aura */}
        <radialGradient id="fa-originAura" cx={originX} cy={originY} r="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
        </radialGradient>

        {/* Clip to map bounds */}
        <clipPath id="fa-mapClip">
          <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT} />
        </clipPath>
      </defs>

      {/* ── Ocean fill ── */}
      <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT}
        fill="url(#fa-oceanGrad)" />

      {/* ── Geo grid ── */}
      <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT}
        fill="url(#fa-grid)" />

      {/* ── All background countries ── */}
      <g id="fa-bg-countries" clipPath="url(#fa-mapClip)">
        {Object.entries(COUNTRY_PATHS).map(([code, paths]) => {
          return (paths as string[]).map((d: string, idx: number) => (
            <path
              key={`${code}-${idx}`}
              d={d}
              fill="url(#fa-landGrad)"
              stroke="rgba(100, 160, 255, 0.14)"
              strokeWidth={0.5}
            />
          ));
        })}
      </g>

      {/* ── Origin aura glow ── */}
      <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT}
        fill="url(#fa-originAura)" pointerEvents="none" />

      {/* ── Destination country aura ── */}
      <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT}
        fill="url(#fa-destAura)" pointerEvents="none" />

      {/* ── Particle trail (behind path) ── */}
      <g id="fa-particles" clipPath="url(#fa-mapClip)">
        {particles.map((p) => {
          const lifeRatio = p.age / p.lifetime;
          const alpha = p.opacity * (1 - lifeRatio * lifeRatio);
          const size = p.size * (1 - lifeRatio * 0.6);
          const t = 0.3 + lifeRatio * 0.5; // particle color along gradient
          // Interpolate blue → purple → gold
          const r = Math.round(96 + (251 - 96) * t);
          const g = Math.round(165 + (191 - 165) * t * 0.2);
          const b = Math.round(250 + (36 - 250) * t);
          return (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={size}
              fill={`rgba(${r},${g},${b},${alpha})`}
            />
          );
        })}
      </g>

      {/* ── Ghost arc (entire route, dim) ── */}
      <path
        d={arcPath}
        fill="none"
        stroke="url(#fa-ghostGrad)"
        strokeWidth={1.5}
        strokeDasharray="6 6"
        clipPath="url(#fa-mapClip)"
      />

      {/* ── Animated flight path (draws as plane moves) ── */}
      <path
        d={arcPath}
        fill="none"
        stroke="url(#fa-pathGrad)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={arcLength * (1 - progress)}
        filter="url(#fa-pathGlow)"
        clipPath="url(#fa-mapClip)"
      />

      {/* ── Plane halo ── */}
      {phase === "flying" && (
        <rect x={MAP_MIN_X} y={MAP_MIN_Y} width={MAP_WIDTH} height={MAP_HEIGHT}
          fill="url(#fa-planeHalo)" pointerEvents="none" />
      )}

      {/* ── Origin dot (India) ── */}
      <g>
        <circle cx={originX} cy={originY} r={12} fill="rgba(59,130,246,0.08)">
          <animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={originX} cy={originY} r={5} fill="rgba(96,165,250,0.25)" />
        <circle cx={originX} cy={originY} r={3.2} fill="#60a5fa" />
        <circle cx={originX} cy={originY} r={1.5} fill="#ffffff" />
      </g>

      {/* ── Destination dot ── */}
      {phase === "arrived" ? (
        // Arrived: multi-ring burst
        <g>
          <circle cx={destX} cy={destY} r={4} fill="#fbbf24" filter="url(#fa-burstGlow)" />
          <circle cx={destX} cy={destY} r={4} fill="none" stroke="#fbbf24" strokeWidth={1.5}>
            <animate attributeName="r" values="4;48" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={destX} cy={destY} r={4} fill="none" stroke="#fbbf24" strokeWidth={1}>
            <animate attributeName="r" values="4;28" dur="1.8s" begin="0.45s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="1.8s" begin="0.45s" repeatCount="indefinite" />
          </circle>
          <circle cx={destX} cy={destY} r={4} fill="none" stroke="#f59e0b" strokeWidth={0.8}>
            <animate attributeName="r" values="4;18" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx={destX} cy={destY} r={5} fill="#fbbf24" />
          <circle cx={destX} cy={destY} r={2.5} fill="#ffffff" />
        </g>
      ) : (
        // Flying: subtle warm dot
        <g opacity={destGlowIntensity * 0.6 + 0.2}>
          <circle cx={destX} cy={destY} r={8} fill="rgba(251,191,36,0.08)" />
          <circle cx={destX} cy={destY} r={3.5} fill="rgba(251,191,36,0.35)" />
          <circle cx={destX} cy={destY} r={2} fill="#fbbf24" opacity={0.7} />
        </g>
      )}

      {/* ── Airplane ── */}
      {phase === "flying" && (
        <g
          transform={`translate(${plane.x}, ${plane.y}) rotate(${plane.angle})`}
          filter="url(#fa-planeGlow)"
        >
          {/* Engine exhaust — blue-white haze behind plane */}
          <ellipse
            cx={-14} cy={0}
            rx={16} ry={5}
            fill="url(#fa-engineTrailGrad)"
            opacity={0.35}
          />
          {/* Wingtip glow sparks */}
          <circle cx={-3} cy={-9} r={1.5} fill="#a78bfa" opacity={0.7} />
          <circle cx={-3} cy={9} r={1.5} fill="#a78bfa" opacity={0.7} />

          {/* Aircraft body — clean, accurate silhouette (top-down view, nose right) */}
          {/* Fuselage */}
          <ellipse cx={2} cy={0} rx={11} ry={2.2} fill="#f0f8ff" />
          {/* Nose cone */}
          <ellipse cx={12} cy={0} rx={2.5} ry={1.5} fill="#e2eeff" />
          {/* Main wings */}
          <path
            d="M 3,0 L 0,-12 L -2,-12 L -1,-0.5 L -1,0.5 L -2,12 L 0,12 Z"
            fill="#dbeafe"
            opacity={0.95}
          />
          {/* Horizontal stabilizer (tail wing) */}
          <path
            d="M -7,0 L -8.5,-5.5 L -9.5,-5.5 L -9,0 L -9,0.2 L -9.5,5.5 L -8.5,5.5 Z"
            fill="#bfdbfe"
            opacity={0.9}
          />
          {/* Vertical stabilizer */}
          <path
            d="M -7,0 L -9.5,-3 L -10,-2 L -9.5,0 Z"
            fill="#93c5fd"
            opacity={0.8}
          />
          {/* Engine nacelles */}
          <ellipse cx={0.5} cy={-8} rx={3} ry={1.2} fill="#dbeafe" opacity={0.85} />
          <ellipse cx={0.5} cy={8} rx={3} ry={1.2} fill="#dbeafe" opacity={0.85} />
          {/* Cockpit glint */}
          <ellipse cx={10} cy={-0.3} rx={1.5} ry={0.7} fill="#bfdbfe" opacity={0.6} />
        </g>
      )}

    </svg>
  );

  // ── Full layout ──
  const content = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#060c1a",
        borderRadius: inline ? 18 : 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: inline ? "1px solid rgba(255,255,255,0.08)" : "none",
        boxShadow: inline ? "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" : "none",
      }}
    >
      <style>{`
        @keyframes fa-originPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.4); }
        }
        @keyframes fa-fadeSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fa-statusIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fa-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fa-arrivedGlow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* ── Map fills entire space ── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {mapSvg}

        {/* ── HTML Glassmorphic Badges Overlay ── */}
        {sourceBadgeOpacity > 0 && (
          <div
            style={{
              ...getHtmlBadgeStyle(originX, originY, sourceBadgeOpacity),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(5, 12, 25, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              boxShadow: "0 4px 16px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              borderRadius: "14px",
              padding: "4px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "12px", lineHeight: 1 }}>🇮🇳</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {originName.toUpperCase()}
            </span>
          </div>
        )}

        {destBadgeOpacity > 0 && (
          <div
            style={{
              ...getHtmlBadgeStyle(destX, destY, destBadgeOpacity),
              transform: `translate(-50%, -100%) translateY(${-12 - (1 - destBadgeOpacity) * 6}px)`,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(5, 12, 25, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(251, 191, 36, 0.4)",
              boxShadow: "0 4px 16px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              borderRadius: "14px",
              padding: "4px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "12px", lineHeight: 1 }}>{destFlag}</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {countryName.toUpperCase()}
            </span>
          </div>
        )}


        {/* ── Arrived overlay ── */}
        {phase === "arrived" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
              animation: "fa-arrivedGlow 1.8s ease infinite",
            }}
          />
        )}
      </div>

      {/* ── Bottom status bar ── */}
      <div
        style={{
          padding: "12px 18px 16px",
          background: "linear-gradient(to top, rgba(4,8,18,1) 0%, rgba(6,12,26,0.7) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: 3,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${Math.round(progress * 100)}%`,
              height: "100%",
              background: phase === "arrived"
                ? "linear-gradient(to right, #34d399, #10b981)"
                : "linear-gradient(to right, #3b82f6, #a78bfa, #fbbf24)",
              borderRadius: 2,
              transition: "width 80ms linear, background 0.8s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            {phase === "flying" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "fa-shimmer 1.4s linear infinite",
                }}
              />
            )}
          </div>
        </div>

        {/* Status + percentage */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            key={statusIdx}
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.48)",
              fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: "0.01em",
              animation: "fa-statusIn 0.4s ease both",
            }}
          >
            {phase === "arrived"
              ? `✓ Your ${countryName} visa guide is ready`
              : STATUS_STEPS[statusIdx]}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: phase === "arrived" ? "#34d399" : "rgba(255,255,255,0.55)",
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              letterSpacing: "0.06em",
              transition: "color 0.6s ease",
            }}
          >
            {phase === "arrived" ? "DONE" : `${Math.round(progress * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(3, 7, 18, 0.98)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{ width: "90vw", maxWidth: 900, height: "80vh", maxHeight: 580 }}>
        {content}
      </div>
    </div>
  );
}