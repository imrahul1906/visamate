"use client";

// ─────────────────────────────────────────────────────────────
// DocChecklistEmptyState
// Perfect visual replica of the actual Visamate dashboard.
// Left Column: Interactive textual onboarding steps.
// Right Column: A mockup Safari browser window running a looping,
// CSS/JS-driven interactive dashboard animation demonstrating the app flow.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { T, font } from "@/lib/theme";
import {
  StepItem,
  STEPS,
  ONLINE_STEPS,
  TIMELINE_STEPS,
  MockState,
} from "./DocChecklistEmptyStateData";
import { DocChecklistEmptyStateStyles } from "./DocChecklistEmptyStateStyles";
import { DocChecklistMockBrowser } from "./DocChecklistMockBrowser";

export function DocChecklistEmptyState({
  totalDocs,
  requiredTotal,
  visaTypeName,
  countryName,
  isOnline = false,
}: {
  totalDocs: number;
  requiredTotal: number;
  visaTypeName: string;
  countryName: string;
  isOnline?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // ── Animation Loop State Machine ──────────────────────────────
  const [cursor, setCursor] = useState({ x: "75%", y: "45%", opacity: 1, duration: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: string; y: string }[]>([]);
  const [activeTextStep, setActiveTextStep] = useState<number | null>(null);

  const [mockState, setMockState] = useState<MockState>({
    activeDocIndex: -1,
    docs: [
      { name: "Visa Application Form", badge: "Form", checked: false, uploaded: false },
      { name: "Passport Copy", badge: "Upload", checked: false, uploaded: false },
      { name: "Flight Reservations", badge: "Upload", checked: false, uploaded: false },
    ],
    showGuide: false,
    zipClicked: false,
    progress: 0,
  });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let active = true;
    let currentTimeout: NodeJS.Timeout | null = null;
    let rippleTimeout: NodeJS.Timeout | null = null;
    let stepIndex = 0;

    const runStep = () => {
      if (!active) return;
      const step = TIMELINE_STEPS[stepIndex];

      // 1. Move cursor and update active text card highlight
      setCursor({
        x: step.targetX,
        y: step.targetY,
        opacity: step.opacity,
        duration: step.duration,
      });
      setActiveTextStep(step.activeTextStep);

      // 2. Wait for cursor travel duration
      currentTimeout = setTimeout(() => {
        if (!active) return;

        // Apply state updates
        if (step.stateUpdate) {
          setMockState(step.stateUpdate);
        }

        // Trigger click ripple
        if (step.click) {
          const id = Date.now();
          setRipples((r) => [...r, { id, x: step.targetX, y: step.targetY }]);
          rippleTimeout = setTimeout(() => {
            if (active) {
              setRipples((r) => r.filter((item) => item.id !== id));
            }
          }, 600);
        }

        // 3. Wait for hold time before moving to next step
        currentTimeout = setTimeout(() => {
          if (!active) return;
          stepIndex = (stepIndex + 1) % TIMELINE_STEPS.length;
          runStep();
        }, step.holdTime);

      }, step.duration);
    };

    runStep();

    return () => {
      active = false;
      if (currentTimeout) clearTimeout(currentTimeout);
      if (rippleTimeout) clearTimeout(rippleTimeout);
    };
  }, []);

  const steps = isOnline ? ONLINE_STEPS : STEPS;

  return (
    <div className="vm-scroll-hidden" style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 24px",
      position: "relative", overflowY: "auto", overflowX: "hidden",
    }}>
      <DocChecklistEmptyStateStyles />

      {/* ── Ambient background orbs ───────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "20%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          animation: "orbDriftA 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "15%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)",
          animation: "orbDriftB 14s ease-in-out infinite",
        }} />
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(var(--vm-trans-white-08) 1px, transparent 1px),
            linear-gradient(90deg, var(--vm-trans-white-08) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
        }} />
      </div>

      {/* ── Main Layout Container ── */}
      <div className="vm-empty-container">

        {/* ── Title block at the top ── */}
        <div className="vm-empty-header" style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 500ms ease",
        }}>
          {/* Hero Icon */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.2,0.64,1)",
            marginBottom: 18,
            position: "relative",
          }}>
            {/* Outer glow ring */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulseRing 2.8s ease-out infinite",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: 18,
                background: "linear-gradient(105deg, transparent 30%, rgba(165,180,252,0.07) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.2s linear infinite",
              }} />
              <svg
                width="24" height="24" fill="none"
                stroke={T.indigoLight} strokeWidth={1.5} viewBox="0 0 24 24"
                style={{ animation: "iconFloat 3.2s ease-in-out infinite" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            {/* Floating badge — doc count */}
            <div style={{
              position: "absolute", top: -4, right: -8,
              background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(129,140,248,0.95))",
              border: "1px solid rgba(165,180,252,0.3)",
              borderRadius: 999,
              padding: "2px 7px",
              fontSize: 10, fontWeight: 700,
              color: "#fff", fontFamily: font.sans,
              boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
            }}>
              {totalDocs}
            </div>
          </div>

          {/* Heading */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 520ms 60ms ease, transform 520ms 60ms cubic-bezier(0.34,1.2,0.64,1)",
            marginBottom: 6,
          }}>
            <h2 className="vm-checklist-heading" style={{
              fontFamily: font.serif,
              fontSize: 22, fontWeight: 400,
              color: T.text,
              margin: 0, lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}>
              Your {visaTypeName} Checklist
            </h2>
          </div>

          {/* Subtitle */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 540ms 120ms ease, transform 540ms 120ms cubic-bezier(0.34,1.2,0.64,1)",
            marginBottom: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <p style={{
              fontSize: 13, color: T.muted,
              margin: "0 0 4px", lineHeight: 1.6, maxWidth: 350,
              fontFamily: font.sans,
            }}>
              Everything you need for {countryName}
            </p>
            {/* Stat Pills */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <Pill color="var(--vm-indigo)" bg="var(--vm-indigo-glow)" border="var(--vm-border2)">
                {requiredTotal} required
              </Pill>
              <Pill color="var(--vm-muted)" bg="var(--vm-trans-white-04)" border="var(--vm-border)">
                {totalDocs - requiredTotal} optional
              </Pill>
            </div>
          </div>
        </div>

        {/* ── Two Columns Row ── */}
        <div className="vm-empty-body-grid">

          {/* Left Column: Onboarding Steps */}
          <div className="vm-empty-text-col">
            <div style={{
              display: "flex", flexDirection: "column", gap: 8,
              width: "100%", textAlign: "left",
            }}>
              {steps.map((step, i) => {
                const isActive = activeTextStep === i;
                const isHovered = hoveredStep === i || isActive;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredStep(i)}
                    onMouseLeave={() => setHoveredStep(null)}
                    style={{
                      opacity: mounted ? 1 : 0,
                      animation: mounted
                        ? `stepReveal 380ms cubic-bezier(0.34,1.2,0.64,1) ${140 + i * 60}ms both`
                        : "none",
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      cursor: "default",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                      background: isHovered
                        ? step.bgHover
                        : "var(--vm-card-bg)",
                      border: isHovered
                        ? `1px solid ${step.borderHover}`
                        : `1px solid var(--vm-border)`,
                      boxShadow: isHovered
                        ? `0 4px 16px ${step.glow}`
                        : "none",
                      transform: isHovered ? "translateY(-1px)" : "none",
                    }}
                  >
                    {/* Step icon bubble */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 200ms ease",
                      background: isHovered ? step.glow : "var(--vm-trans-white-05)",
                      border: isHovered
                        ? `1px solid ${step.borderHover}`
                        : `1px solid var(--vm-border2)`,
                      color: isHovered ? step.color : "var(--vm-trans-white-35)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                        {step.icon}
                      </div>
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 700,
                        margin: "0 0 2px",
                        fontFamily: font.sans,
                        color: isHovered ? "var(--vm-indigo-mid)" : "var(--vm-text)",
                        transition: "color 200ms ease",
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        fontSize: 10.5, margin: 0,
                        fontFamily: font.sans,
                        color: isHovered ? "var(--vm-text)" : "var(--vm-trans-white-65)",
                        transition: "color 200ms ease",
                        lineHeight: 1.35,
                      }}>
                        {step.sub}
                      </p>
                    </div>
                    {/* Step Number */}
                    <div style={{
                      flexShrink: 0,
                      width: 18, height: 18, borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9.5, fontWeight: 700,
                      fontFamily: font.sans,
                      background: isHovered ? step.glow : "var(--vm-trans-white-04)",
                      border: isHovered ? `1px solid ${step.borderHover}` : `1px solid var(--vm-border)`,
                      color: isHovered ? step.color : "var(--vm-trans-white-45)",
                    }}>
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Browser Mockup */}
          <DocChecklistMockBrowser
            mockState={mockState}
            cursor={cursor}
            ripples={ripples}
            countryName={countryName}
            visaTypeName={visaTypeName}
          />

        </div>

      </div>

      {/* ── Bottom hint ── */}
      <div style={{
        marginTop: 24,
        opacity: mounted ? 0.45 : 0,
        transition: "opacity 600ms 500ms ease",
        display: "flex", alignItems: "center", gap: 6,
        position: "relative", zIndex: 1,
      }}>
        <svg width="11" height="11" fill="none" stroke="var(--vm-trans-white-55)" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM5.25 10.5a7.5 7.5 0 0114.97-.699" />
        </svg>
        <span style={{
          fontSize: 10.5, fontFamily: font.sans,
          color: "var(--vm-trans-white-55)",
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
