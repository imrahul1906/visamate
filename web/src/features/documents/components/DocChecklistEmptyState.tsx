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
import Badge from "@/components/shared/Badge";
import {
  StepItem,
  STEPS,
  ONLINE_STEPS,
  TIMELINE_STEPS,
  MockState,
} from "./DocChecklistEmptyStateData";
import { DocChecklistEmptyStateStyles } from "./DocChecklistEmptyStateStyles";



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

  // Derive dynamic progress colors matching DocChecklistSidebar.tsx
  const getProgressColors = (pct: number) => {
    if (pct === 0) {
      return {
        bar: "linear-gradient(90deg, var(--vm-blue), var(--vm-indigo-light))",
        dotColor: "var(--vm-blue)",
        bg: "var(--vm-blue-bg)",
        border: "var(--vm-blue-border)",
        text: "var(--vm-blue)",
      };
    }
    if (pct < 100) {
      return {
        bar: "linear-gradient(90deg, var(--vm-amber), var(--vm-amber))",
        dotColor: "var(--vm-amber)",
        bg: "var(--vm-amber-bg)",
        border: "var(--vm-amber-border)",
        text: "var(--vm-amber)",
      };
    }
    return {
      bar: "linear-gradient(90deg, var(--vm-green), var(--vm-green))",
      dotColor: "var(--vm-green)",
      bg: "var(--vm-green-bg)",
      border: "var(--vm-green-border)",
      text: "var(--vm-green)",
    };
  };

  const progressColors = getProgressColors(mockState.progress);
  const uploadCount = mockState.docs.filter(d => d.uploaded).length;
  const readyCount = mockState.docs.filter(d => d.checked).length;
  const activeDoc = mockState.activeDocIndex >= 0 ? mockState.docs[mockState.activeDocIndex] : null;

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
          <div className="vm-empty-mockup-col" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "rgba(16, 16, 24, 0.98)",
              border: "1px solid var(--vm-border)",
              borderRadius: 16,
              boxShadow: "none",
              overflow: "hidden",
              position: "relative",
              width: 510,
              height: 350,
              flexShrink: 0,
              transition: "all 0.5s ease",
            }}>

              {/* ── Mock Click Ripples ── */}
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="vm-click-ripple"
                  style={{ left: ripple.x, top: ripple.y }}
                />
              ))}

              {/* ── Mock Premium Neon Cursor ── */}
              <div
                style={{
                  position: "absolute",
                  top: cursor.y,
                  left: cursor.x,
                  opacity: cursor.opacity,
                  transition: `left ${cursor.duration}ms cubic-bezier(0.23, 1, 0.32, 1), top ${cursor.duration}ms cubic-bezier(0.23, 1, 0.32, 1), opacity 400ms ease`,
                  pointerEvents: "none",
                  zIndex: 100,
                  willChange: "left, top, opacity",
                }}
              >
                {/* Pulsing halo exactly at cursor tip (0, 0) */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "rgba(99, 102, 241, 0.25)",
                  border: "1px solid rgba(99, 102, 241, 0.5)",
                  boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)",
                  transform: "translate(-50%, -50%)",
                  animation: "pulseRing 2s infinite",
                }} />

                {/* Gradient Arrow starting at (0, 0) */}
                <svg
                  width="16" height="20" viewBox="0 0 18 22" fill="none"
                  style={{
                    filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))",
                    transform: "rotate(-10deg)",
                    transformOrigin: "top left",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 0L18 9L10.5 12L15.5 22L12 22L7 13L0 18V0Z"
                    fill="url(#cursorGradient)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* ── Mock Browser Window Header Bar ── */}
              <div style={{
                height: 32,
                background: "rgba(16, 16, 24, 0.8)",
                borderBottom: "1px solid var(--vm-trans-white-08)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                position: "relative",
                zIndex: 10,
              }}>
                {/* Window Dots */}
                <div style={{ display: "flex", gap: 5.5, flexShrink: 0 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#27c93f" }} />
                </div>

                {/* Mock Address bar */}
                <div style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  width: "48%", height: 18, borderRadius: 5,
                  background: "var(--vm-trans-white-06)",
                  border: "1px solid var(--vm-trans-white-10)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: font.sans, fontSize: 9.5, color: "var(--vm-trans-white-45)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                    visamate.io/docs
                  </div>
                </div>
              </div>

              {/* ── Mock Website Body Content ── */}
              <div style={{
                height: "calc(100% - 32px)",
                background: "var(--vm-bg)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>

                {/* 1. Mock VisaSummaryBar Strip */}
                <div style={{
                  height: 24,
                  background: "var(--vm-surface)",
                  borderBottom: "1px solid var(--vm-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  {/* Left: Breadcrumbs */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <span style={{
                      fontSize: 8, fontWeight: 600, color: "var(--vm-trans-white-85)",
                      background: "var(--vm-trans-white-05)", border: "1px solid var(--vm-trans-white-12)",
                      padding: "2px 6px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      🌏 {countryName}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 600, color: "var(--vm-trans-white-85)",
                      background: "var(--vm-trans-white-05)", border: "1px solid var(--vm-trans-white-12)",
                      padding: "2px 6px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      📋 {visaTypeName}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 600, color: "var(--vm-trans-white-85)",
                      background: "var(--vm-trans-white-05)", border: "1px solid var(--vm-trans-white-12)",
                      padding: "2px 6px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      📍 Delhi
                    </span>
                  </div>
                  {/* Right: Overview Trigger */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    background: "var(--vm-tile-money-bg)", border: "1px solid var(--vm-tile-money-border)",
                    borderRadius: 10, padding: "2px 6px", fontSize: 8.5, fontWeight: 700,
                    color: "var(--vm-tile-money-val)", fontFamily: font.sans,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--vm-tile-money-val)" }} />
                    Full visa overview
                  </div>
                </div>

                {/* 2. Mock two-panel Dashboard */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                  {/* Left Checklist Sidebar is ALWAYS visible */}
                  <div style={{
                    width: "38%", borderRight: "1px solid var(--vm-border)",
                    background: "var(--vm-surface2)", display: "flex", flexDirection: "column",
                  }}>
                    {/* Sidebar Header (Matches ChecklistHeaderStrip) */}
                    <div style={{
                      padding: "8px 10px 8px",
                      borderBottom: `1px solid ${progressColors.border}`,
                      background: progressColors.bg,
                      transition: "all 0.4s ease",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: progressColors.dotColor,
                            boxShadow: `0 0 6px ${progressColors.dotColor}`,
                          }} />
                          <span style={{
                            fontSize: 8.5, fontWeight: 700, color: progressColors.text,
                            textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans,
                          }}>
                            Checklist
                          </span>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, color: progressColors.text, fontFamily: font.sans }}>
                          {readyCount}/3 ready
                        </span>
                      </div>

                      {/* Main Checklist Progress Bar */}
                      <div style={{ height: 3.5, background: "var(--vm-trans-white-07)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: mockState.progress === 0 ? "100%" : `${mockState.progress}%`,
                          background: progressColors.bar, opacity: mockState.progress === 0 ? 0.35 : 1,
                          transition: "width 400ms ease, background 400ms ease",
                        }} />
                      </div>

                      {/* Conditional ZIP button area under progress bar (Matches DocChecklistSidebar.tsx) */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 5,
                        marginTop: 6,
                        height: 18,
                        paddingTop: 6,
                        borderTop: "1px solid var(--vm-border)",
                        opacity: uploadCount > 0 ? 1 : 0,
                        visibility: uploadCount > 0 ? "visible" : "hidden",
                        transition: "opacity 300ms ease, visibility 300ms ease",
                      }}>
                        {/* mini progress line */}
                        <div style={{ height: 2, flex: 1, background: "var(--vm-trans-white-07)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${(uploadCount / 2) * 100}%`,
                            background: "linear-gradient(90deg, var(--vm-green-dark), var(--vm-green))",
                            transition: "width 400ms ease",
                          }} />
                        </div>
                        <span style={{ fontSize: 7.5, fontWeight: 600, color: "var(--vm-green)", fontFamily: font.sans, whiteSpace: "nowrap" }}>
                          {uploadCount}/2 uploaded
                        </span>
                        {/* Mock ZIP Button (Matches Row 3 ZIP button) */}
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 3,
                          background: "var(--vm-green-bg)", color: "var(--vm-green)",
                          border: "1px solid var(--vm-green-border)",
                          borderRadius: 4, padding: "2px 5px",
                          fontSize: 7.5, fontWeight: 700, fontFamily: font.sans,
                          boxShadow: mockState.zipClicked ? "0 0 8px rgba(74, 222, 128, 0.4)" : "none",
                          transform: mockState.zipClicked ? "scale(0.95)" : "none",
                          transition: "all 0.2s",
                        }}>
                          <svg width="6" height="6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          ZIP
                        </div>
                      </div>
                    </div>

                    {/* Doc items list */}
                    <div style={{ flex: 1, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 6, overflowY: "hidden" }}>
                      {/* Category label block */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "2px 0 2px" }}>
                        <span style={{
                          fontSize: 7.5, fontWeight: 700, color: "var(--vm-indigo-light)",
                          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans,
                        }}>
                          Identity & Travel
                        </span>
                        <div style={{ flex: 1, height: 1, background: "var(--vm-indigo-light)", opacity: 0.15 }} />
                      </div>

                      {/* Mock rows generated dynamically */}
                      {mockState.docs.map((doc, idx) => {
                        const isSelected = mockState.activeDocIndex === idx;
                        const isDone = doc.checked;
                        const isUploaded = doc.uploaded;

                        return (
                          <div key={idx} className={`mock-doc-row${isSelected ? " active" : ""}${isDone ? " done" : ""}`}>
                            {/* Mock Checkbox */}
                            <div className={`mock-checkbox-btn${isDone ? " checked" : ""}`}>
                              {isDone && (
                                <svg width="7" height="7" fill="none" stroke="white" strokeWidth="3.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <span style={{
                              fontSize: 9.5, fontWeight: 500, flex: 1, minWidth: 0,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              color: isDone ? "var(--vm-muted)" : "var(--vm-text)",
                              textDecoration: isDone ? "line-through" : "none",
                              fontFamily: font.sans,
                            }}>
                              {doc.name}
                            </span>
                            {/* Badge */}
                            <Badge
                              variant={
                                isUploaded ? "uploaded"
                                  : doc.badge === "Form" ? "form"
                                    : "uploadable"
                              }
                              style={{ transform: "scale(0.8)", transformOrigin: "right center" }}
                            />
                            <span style={{ fontSize: 8.5, color: "var(--vm-muted)" }}>›</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Detail Panel OR Submission Guide State */}
                  <div style={{ width: "62%", background: "var(--vm-surface)", display: "flex", flexDirection: "column" }}>
                    {mockState.showGuide ? (
                      /* ── FINAL STATE: Submission Guide Simulation ── */
                      <div className="vm-file-drop-anim" style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                        padding: 16, height: "100%", width: "100%", textAlign: "center",
                        overflowY: "auto",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, background: "rgba(74, 222, 128, 0.15)",
                          border: "1.5px solid var(--vm-green)", display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 8, boxShadow: "0 0 16px rgba(74, 222, 128, 0.2)",
                        }}>
                          🎯
                        </div>
                        <h4 style={{
                          fontSize: 12, fontWeight: 700, color: T.text, margin: 0, fontFamily: font.sans,
                        }}>
                          Ready to Apply
                        </h4>
                        <p style={{
                          fontSize: 9.5, color: T.muted, margin: "4px 0 10px", fontFamily: font.sans,
                          lineHeight: 1.4, maxWidth: 220,
                        }}>
                          All required documents for your folder are checked. Keep these in mind before you submit:
                        </p>

                        {/* Important Notes list */}
                        <div style={{
                          width: "100%", display: "flex", flexDirection: "column", gap: 5, textAlign: "left",
                        }}>
                          {/* Section label */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                            <div style={{ height: 1, width: 12, background: "rgba(52,211,153,0.4)" }} />
                            <span style={{ fontSize: 7.5, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font.sans }}>
                              Important Notes
                            </span>
                            <div style={{ flex: 1, height: 1, background: "rgba(52,211,153,0.15)" }} />
                          </div>

                          <div style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            background: T.surface2, border: `1px solid ${T.border}`,
                            borderLeft: "2.5px solid rgba(52,211,153,0.5)", borderRadius: "0 6px 6px 0",
                            padding: "6px 8px",
                          }}>
                            <span style={{ fontSize: 10, flexShrink: 0 }}>📄</span>
                            <span style={{ fontSize: 9, color: T.text, fontFamily: font.sans, lineHeight: 1.4 }}>
                              Print out the compiled document PDF on A4 white paper.
                            </span>
                          </div>

                          <div style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            background: T.surface2, border: `1px solid ${T.border}`,
                            borderLeft: "2.5px solid rgba(52,211,153,0.5)", borderRadius: "0 6px 6px 0",
                            padding: "6px 8px",
                          }}>
                            <span style={{ fontSize: 10, flexShrink: 0 }}>🏢</span>
                            <span style={{ fontSize: 9, color: T.text, fontFamily: font.sans, lineHeight: 1.4 }}>
                              Submit package at Japan VFS Visa Application Center.
                            </span>
                          </div>

                          <div style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            background: T.surface2, border: `1px solid ${T.border}`,
                            borderLeft: "2.5px solid rgba(52,211,153,0.5)", borderRadius: "0 6px 6px 0",
                            padding: "6px 8px",
                          }}>
                            <span style={{ fontSize: 10, flexShrink: 0 }}>🛂</span>
                            <span style={{ fontSize: 9, color: T.text, fontFamily: font.sans, lineHeight: 1.4 }}>
                              Bring original passport + visa fee demand draft.
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : activeDoc ? (
                      /* Document view panel active */
                      <>
                        {/* Drawer Header replica (Matches DocDetailPanel.tsx) */}
                        <div style={{ flexShrink: 0, padding: "8px 10px 0", background: "var(--vm-surface2)" }}>
                          <div className="vm-doc-identity-header" style={{
                            position: "relative", borderRadius: 8,
                            border: "1px solid var(--vm-border)",
                            background: "var(--vm-trans-white-02)",
                            overflow: "hidden", padding: "6px 8px",
                          }}>
                            {/* Dot grid background texture */}
                            <div style={{
                              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                              backgroundImage: "radial-gradient(var(--vm-trans-white-05) 1px, transparent 1px)",
                              backgroundSize: "10px 10px",
                            }} />
                            {/* Radial glow */}
                            <div style={{
                              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                              background: "radial-gradient(ellipse 55% 120% at 0% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                            }} />
                            {/* Content */}
                            <div style={{ position: "relative", zIndex: 1 }}>
                              <div style={{ fontSize: 7, fontWeight: 700, color: "var(--vm-indigo-light)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: font.sans }}>
                                Document Focus
                              </div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-text)", fontFamily: font.sans, marginTop: 1 }}>
                                {activeDoc.name}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Body view (Matches DocDetailPanel detail fields) */}
                        <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ fontSize: 9.5, color: "var(--vm-trans-white-65)", fontFamily: font.sans, lineHeight: 1.4 }}>
                            {mockState.activeDocIndex === 0
                              ? "Official government application form containing personal details and travel history."
                              : mockState.activeDocIndex === 1
                                ? "Scan of applicant's primary passport page containing personal photo and details."
                                : "Confirmed round-trip ticket reservations showing transit dates."}
                          </div>

                          {/* Render guidelines or Upload Slot */}
                          {mockState.activeDocIndex === 0 ? (
                            /* Guidelines form mockup */
                            <div style={{
                              background: "var(--vm-trans-white-03)",
                              border: "1px solid var(--vm-border)",
                              borderRadius: 8,
                              padding: "8px 10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                              flex: 1,
                            }}>
                              <div style={{ fontSize: 8, fontWeight: 700, color: "var(--vm-indigo-light)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: font.sans }}>
                                Submission Instructions
                              </div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 8.5, color: "var(--vm-trans-white-85)" }}>
                                <span style={{ color: "var(--vm-indigo-light)" }}>•</span> Must be filled out online or in clear black/blue ink.
                              </div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 8.5, color: "var(--vm-trans-white-85)" }}>
                                <span style={{ color: "var(--vm-indigo-light)" }}>•</span> Print on single-sided A4 sheets and sign in original.
                              </div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 8.5, color: "var(--vm-trans-white-85)" }}>
                                <span style={{ color: "var(--vm-indigo-light)" }}>•</span> Date on form must match other visa documents.
                              </div>
                            </div>
                          ) : (
                            /* Upload Slot mockup */
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                              {activeDoc.uploaded ? (
                                <div className="vm-file-drop-anim" style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginTop: 6,
                                  paddingTop: 6,
                                  borderTop: "1px solid var(--vm-border)",
                                }}>
                                  {/* Green file icon */}
                                  <div style={{
                                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                    background: "var(--vm-green-bg)",
                                    border: "1px solid var(--vm-green-border)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <svg width="12" height="12" fill="none" stroke="#4ade80" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                  </div>

                                  {/* File details */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                      fontSize: 10, fontWeight: 700, margin: "0 0 1px",
                                      color: "var(--vm-green-dark)", fontFamily: font.sans,
                                    }}>
                                      ✓ File ready to submit
                                    </p>
                                    <p style={{
                                      fontSize: 8.5, margin: 0, fontFamily: font.sans,
                                      color: "var(--vm-trans-white-45)",
                                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>
                                      {mockState.activeDocIndex === 1 ? "passport_copy.pdf" : "flight_reservations.pdf"}
                                      <span style={{ marginLeft: 4, opacity: 0.6 }}>
                                        · {mockState.activeDocIndex === 1 ? "142 KB" : "85 KB"}
                                      </span>
                                    </p>
                                  </div>

                                  {/* Remove button */}
                                  <div style={{
                                    flexShrink: 0,
                                    border: "1px solid var(--vm-red-border)",
                                    background: "var(--vm-trans-white-02)",
                                    borderRadius: 5,
                                    padding: "3px 8px",
                                    fontSize: 8.5,
                                    fontWeight: 600,
                                    fontFamily: font.sans,
                                    color: "var(--vm-trans-white-55)",
                                  }}>
                                    Remove
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    border: "1px dashed var(--vm-trans-white-15)",
                                    background: "var(--vm-trans-white-02)",
                                    position: "relative",
                                    overflow: "hidden",
                                    marginTop: 6,
                                    paddingTop: 6,
                                    borderTop: "1px solid var(--vm-border)",
                                  }}>
                                    {/* Upload icon */}
                                    <div style={{
                                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      background: "var(--vm-purple-bg-muted)",
                                      border: "1px solid var(--vm-purple-border-soft)",
                                    }}>
                                      <svg width="12" height="12" fill="none" stroke="var(--vm-indigo)" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                      </svg>
                                    </div>

                                    {/* Label block */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{
                                        fontSize: 10, fontWeight: 700, margin: "0 0 1px",
                                        fontFamily: font.sans,
                                        color: "var(--vm-text)",
                                      }}>
                                        Got a digital copy? Attach it
                                      </p>
                                      <p style={{
                                        fontSize: 8.5, margin: 0,
                                        fontFamily: font.sans,
                                        color: "var(--vm-trans-white-45)",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                      }}>
                                        Optional (only used to help validate format & size) · Drag & drop or click
                                      </p>
                                    </div>

                                    {/* Browse button */}
                                    <div style={{
                                      flexShrink: 0,
                                      padding: "3px 8px",
                                      borderRadius: 5,
                                      fontSize: 8.5,
                                      fontWeight: 700,
                                      fontFamily: font.sans,
                                      background: "var(--vm-purple-bg-muted)",
                                      border: "1px solid var(--vm-purple-border-soft)",
                                      color: "var(--vm-indigo)",
                                    }}>
                                      Browse
                                    </div>
                                  </div>

                                  {/* Lock banner */}
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    marginTop: 4,
                                    opacity: 0.5,
                                  }}>
                                    <svg width="8" height="8" fill="none" stroke="var(--vm-trans-white-65)" strokeWidth={2.2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <span style={{ fontSize: 7.5, color: "var(--vm-trans-white-55)", fontFamily: font.sans }}>
                                      In-browser processing · Zero server storage · Your data stays local
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                        </div>
                      </>
                    ) : (
                      /* Idle State Preview Panel */
                      <div style={{
                        flex: 1, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 6,
                        margin: 12, border: "1px dashed var(--vm-border)", borderRadius: 10,
                        background: "var(--vm-surface2)", opacity: 0.5,
                      }}>
                        <span style={{ fontSize: 18 }}>📋</span>
                        <span style={{ fontSize: 9.5, color: "var(--vm-trans-white-45)", fontFamily: font.sans }}>
                          Select document to preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
