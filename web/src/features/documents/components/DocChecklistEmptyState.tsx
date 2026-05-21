"use client";

// ─────────────────────────────────────────────────────────────
// DocChecklistEmptyState
// Drop-in replacement for the right-panel idle state.
// Matches the UploadSlot animation vocabulary exactly:
//   pulseRing, shimmer, floatUp, iconBounce → all reused here.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { T, font } from "@/lib/theme";

const STEPS: { icon: React.ReactNode; label: string; sub: string; color: string; glow: string; bgHover: string }[] = [
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
    label: "Select a document",
    sub: "Tap any item on the left to see what's needed",
    color: T.indigoLight,
    glow: T.indigoGlow,
    bgHover: "rgba(99,102,241,0.07)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Mark items done",
    sub: "Check off docs as you collect them",
    color: T.green,
    glow: T.greenBorder,
    bgHover: T.greenBg,
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
      </svg>
    ),
    label: "Upload your files",
    sub: "Attach digital copies to build your folder",
    color: T.amber,
    glow: T.amberBorder,
    bgHover: T.amberBg,
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    label: "Download as ZIP",
    sub: "Export everything in one click when ready",
    color: T.blue,
    glow: T.blueBorder,
    bgHover: T.blueBg,
  },
];

export function DocChecklistEmptyState({
  totalDocs,
  requiredTotal,
  visaTypeName,
  countryName,
}: {
  totalDocs: number;
  requiredTotal: number;
  visaTypeName: string;
  countryName: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 32px", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>



      {/* ── Ambient background orbs ───────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "20%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          animation: "orb-drift-a 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "15%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)",
          animation: "orb-drift-b 12s ease-in-out infinite",
        }} />
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
        }} />
      </div>

      {/* ── Hero icon ─────────────────────────────────────────── */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.2,0.64,1)",
        marginBottom: 22,
        position: "relative",
      }}>
        {/* Outer glow ring */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulseRing 2.8s ease-out infinite",
          position: "relative",
        }}>
          {/* Shimmer sweep */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 20,
            background: "linear-gradient(105deg, transparent 30%, rgba(165,180,252,0.07) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.2s linear infinite",
          }} />
          <svg
            width="28" height="28" fill="none"
            stroke={T.indigoLight} strokeWidth={1.5} viewBox="0 0 24 24"
            style={{ animation: "iconFloat 3.2s ease-in-out infinite" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>

        {/* Floating badge — doc count */}
        <div style={{
          position: "absolute", top: -6, right: -10,
          background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(129,140,248,0.9))",
          border: "1px solid rgba(165,180,252,0.3)",
          borderRadius: 999,
          padding: "2px 7px",
          fontSize: 10, fontWeight: 700,
          color: "#fff", fontFamily: font.sans,
          letterSpacing: "0.03em",
          animation: "badge-pulse 3s ease-in-out infinite",
          boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
        }}>
          {totalDocs}
        </div>
      </div>

      {/* ── Heading ───────────────────────────────────────────── */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 520ms 60ms ease, transform 520ms 60ms cubic-bezier(0.34,1.2,0.64,1)",
        marginBottom: 8,
      }}>
        <h2 style={{
          fontFamily: font.serif,
          fontSize: 20, fontWeight: 400,
          color: T.text,
          margin: 0, lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}>
          Your {visaTypeName} Checklist
        </h2>
      </div>

      {/* ── Sub-copy + pill badges ─────────────────────────────── */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 540ms 120ms ease, transform 540ms 120ms cubic-bezier(0.34,1.2,0.64,1)",
        marginBottom: 28,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <p style={{
          fontSize: 13, color: T.muted,
          margin: 0, lineHeight: 1.7, maxWidth: 300,
          fontFamily: font.sans,
        }}>
          Everything you need for {countryName}
        </p>

        {/* Inline stat pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <Pill color={T.indigoLight} bg={T.indigoGlow} border="rgba(99,102,241,0.22)">
            {requiredTotal} required
          </Pill>
          <Pill color={T.muted} bg="rgba(255,255,255,0.04)" border={T.border}>
            {totalDocs - requiredTotal} optional
          </Pill>
        </div>
      </div>

      {/* ── Step cards ────────────────────────────────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 8,
        width: "100%", maxWidth: 320,
        textAlign: "left",
      }}>
        {STEPS.map((step, i) => {
          const isHovered = hoveredStep === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                opacity: mounted ? 1 : 0,
                animation: mounted
                  ? `stepReveal 380ms cubic-bezier(0.34,1.2,0.64,1) ${140 + i * 70}ms both`
                  : "none",
                display: "flex", alignItems: "center", gap: 13,
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
                background: isHovered
                  ? step.bgHover
                  : "rgba(255,255,255,0.03)",
                border: isHovered
                  ? `1px solid ${step.color}44`
                  : `1px solid ${T.border}`,
                boxShadow: isHovered
                  ? `0 4px 16px ${step.glow}`
                  : "none",
              }}
            >
              {/* Shimmer on hover */}
              {isHovered && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s linear infinite",
                }} />
              )}

              {/* Step icon bubble */}
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 200ms ease",
                background: isHovered ? `${step.glow}` : "rgba(255,255,255,0.05)",
                border: isHovered
                  ? `1px solid ${step.color}55`
                  : `1px solid ${T.border2}`,
                color: isHovered ? step.color : "rgba(255,255,255,0.3)",
              }}>
                {step.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 12.5, fontWeight: 700,
                  margin: "0 0 2px",
                  fontFamily: font.sans,
                  color: isHovered ? T.text : T.muted2,
                  transition: "color 200ms ease",
                  letterSpacing: "-0.005em",
                }}>
                  {step.label}
                </p>
                <p style={{
                  fontSize: 11, margin: 0,
                  fontFamily: font.sans,
                  color: isHovered ? T.muted : "rgba(255,255,255,0.28)",
                  transition: "color 200ms ease",
                  lineHeight: 1.4,
                }}>
                  {step.sub}
                </p>
              </div>

              {/* Step number */}
              <div style={{
                flexShrink: 0,
                width: 20, height: 20, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                fontFamily: font.sans,
                transition: "all 200ms ease",
                background: isHovered ? `${step.color}22` : "rgba(255,255,255,0.04)",
                border: isHovered ? `1px solid ${step.color}44` : `1px solid ${T.border}`,
                color: isHovered ? step.color : "rgba(255,255,255,0.2)",
              }}>
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom hint ───────────────────────────────────────── */}
      <div style={{
        marginTop: 24,
        opacity: mounted ? 0.4 : 0,
        transition: "opacity 600ms 500ms ease",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <svg width="11" height="11" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM5.25 10.5a7.5 7.5 0 0114.97-.699" />
        </svg>
        <span style={{
          fontSize: 10.5, fontFamily: font.sans,
          color: "rgba(255,255,255,0.5)",
        }}>
          Select any document on the left to get started
        </span>
      </div>
    </div>
  );
}

// ── Small inline pill ─────────────────────────────────────────
function Pill({
  children,
  color,
  bg,
  border,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 9px", borderRadius: 999,
      fontSize: 10.5, fontWeight: 600,
      fontFamily: font.sans,
      letterSpacing: "0.02em",
      background: bg,
      border: `1px solid ${border}`,
      color,
    }}>
      {children}
    </span>
  );
}
