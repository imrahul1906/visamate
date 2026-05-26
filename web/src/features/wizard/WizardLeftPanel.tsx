// src/features/wizard/WizardLeftPanel.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { T } from "@/lib/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "idle"
  | "interacting"
  | "selected"
  | "advancing"
  | "entering";

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { index: 0, title: "Select destination",        demoType: "country"  as const },
  { index: 1, title: "Select visa type",           demoType: "visa"     as const },
  { index: 2, title: "Where will you apply from?", demoType: "location" as const },
  { index: 3, title: "Tell us about your trip",    demoType: "details"  as const },
];

const TOTAL_STEPS = STEPS.length;

// ─── Demo data ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", supported: true  },
  { code: "GB", name: "United Kingdom",        flag: "🇬🇧", supported: true  },
  { code: "US", name: "United States",         flag: "🇺🇸", supported: false },
  { code: "DE", name: "Germany",               flag: "🇩🇪", supported: false },
];

const VISA_TYPES = [
  { code: "TOURIST",  name: "Tourist Visa",  desc: "Tourism, sightseeing, visiting family" },
  { code: "BUSINESS", name: "Business Visa", desc: "Meetings, conferences, trade"          },
  { code: "TRANSIT",  name: "Transit Visa",  desc: "Passing through the country"           },
];

const LOCATIONS = [
  { code: "DEL", city: "New Delhi",  center: "VFS Global – Connaught Place" },
  { code: "MUM", city: "Mumbai",     center: "VFS Global – BKC"             },
  { code: "BLR", city: "Bengaluru",  center: "VFS Global – Whitefield"      },
  { code: "HYD", city: "Hyderabad",  center: "VFS Global – Banjara Hills"   },
];

const SPONSORSHIP = [
  { id: "self",      label: "Self-sponsored"       },
  { id: "sponsored", label: "Sponsored by someone" },
];

const PROFILES = [
  { id: "employed",      label: "Employed"      },
  { id: "student",       label: "Student"       },
  { id: "self-employed", label: "Self-Employed" },
];

// ─── Timing (ms) ──────────────────────────────────────────────────────────────

const T_IDLE_BEFORE   = 900;
const T_CURSOR_TRAVEL = 700;
const T_CLICK_HOLD    = 250;
const T_SELECTED_HOLD = 1100;
const T_ADVANCE       = 400;
const T_ENTER         = 500;
const T_LOOP_PAUSE    = 1400;

// ─── Colours ──────────────────────────────────────────────────────────────────

const PURPLE      = T.purple;
const PURPLE_SOFT = "rgba(108,92,231,0.15)";
const PURPLE_RING = "rgba(108,92,231,0.35)";
const WHITE_85    = "rgba(255,255,255,0.85)";
const WHITE_55    = T.muted2;
const WHITE_35    = T.muted;
const WHITE_18    = "rgba(255,255,255,0.18)";
const WHITE_10    = T.border2;
const WHITE_07    = T.border;
const WHITE_04    = "rgba(255,255,255,0.04)";
const GREEN       = T.green;

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes wlp-cursor-click {
    0%   { transform: scale(1);    opacity: 1;   }
    40%  { transform: scale(0.82); opacity: 0.9; }
    100% { transform: scale(1);    opacity: 1;   }
  }
  @keyframes wlp-ripple {
    0%   { transform: scale(0.6); opacity: 0.7; }
    100% { transform: scale(2.4); opacity: 0;   }
  }
  @keyframes wlp-check-draw {
    0%   { stroke-dashoffset: 20; }
    100% { stroke-dashoffset: 0;  }
  }
  @keyframes wlp-slide-in-right {
    from { opacity: 0; transform: translateX(18px) scale(0.98); }
    to   { opacity: 1; transform: translateX(0)    scale(1);    }
  }
  @keyframes wlp-fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes wlp-pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(108,92,231,0.45); }
    70%  { box-shadow: 0 0 0 8px rgba(108,92,231,0);    }
    100% { box-shadow: 0 0 0 0   rgba(108,92,231,0);    }
  }
  @keyframes wlp-badge-pop {
    0%   { transform: scale(0.5); opacity: 0;  }
    60%  { transform: scale(1.15);             }
    100% { transform: scale(1);   opacity: 1;  }
  }
  @keyframes wlp-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
`;

// ─── FIXED CONTENT HEIGHT ─────────────────────────────────────────────────────
// Sized to the tallest step (Country: search bar + 4 rows ≈ 228px).
// All other steps render inside this fixed box — no layout shift.
const CONTENT_H = 155;

// ─── Demo panels ─────────────────────────────────────────────────────────────

function DemoCountry({ selectedIdx, hoverIdx, phase }: {
  selectedIdx: number | null; hoverIdx: number | null; phase: Phase;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: WHITE_07, border: `0.5px solid ${WHITE_10}`,
        borderRadius: 8, padding: "7px 10px", marginBottom: 4,
      }}>
        <svg width="10" height="10" fill="none" stroke={WHITE_35} strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
        </svg>
        <span style={{ color: WHITE_35, fontSize: 11, letterSpacing: "0.01em" }}>Search country…</span>
      </div>
      {COUNTRIES.map((c, i) => {
        const isSel = selectedIdx === i;
        const isHov = hoverIdx === i && !isSel;
        return (
          <div key={c.code} style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "6px 9px", borderRadius: 8,
            border: isSel ? `1px solid ${PURPLE}` : isHov ? `1px solid ${PURPLE_RING}` : `0.5px solid ${WHITE_07}`,
            background: isSel ? PURPLE_SOFT : isHov ? WHITE_04 : "transparent",
            opacity: !c.supported ? 0.38 : 1,
            transition: "all 0.2s",
            animation: isSel && phase === "selected" ? "wlp-pulse-ring 0.6s ease-out" : "none",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: WHITE_07, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 15, flexShrink: 0,
            }}>{c.flag}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: isSel ? "#fff" : WHITE_85, fontSize: 11,
                fontWeight: isSel ? 600 : 400,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{c.name}</div>
              {!c.supported && (
                <div style={{ color: WHITE_35, fontSize: 9, marginTop: 1 }}>Coming soon</div>
              )}
            </div>
            <div style={{ width: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isSel ? (
                <div style={{ width: 15, height: 15, background: PURPLE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="7" height="7" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="20" strokeDashoffset="0" viewBox="0 0 24 24"
                    style={{ animation: "wlp-check-draw 0.25s ease-out forwards" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              ) : c.supported ? (
                <svg width="9" height="9" fill="none" stroke={WHITE_35} strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DemoVisa({ selectedIdx, hoverIdx, phase }: {
  selectedIdx: number | null; hoverIdx: number | null; phase: Phase;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {VISA_TYPES.map((v, i) => {
        const isSel = selectedIdx === i;
        const isHov = hoverIdx === i && !isSel;
        return (
          <div key={v.code} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 11px", borderRadius: 9,
            border: isSel ? `1px solid ${PURPLE}` : isHov ? `1px solid ${PURPLE_RING}` : `0.5px solid ${WHITE_07}`,
            background: isSel ? PURPLE_SOFT : isHov ? WHITE_04 : "transparent",
            transition: "all 0.2s",
            animation: isSel && phase === "selected" ? "wlp-pulse-ring 0.6s ease-out" : "none",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: isSel ? "rgba(108,92,231,0.22)" : WHITE_07,
              border: `0.5px solid ${isSel ? PURPLE_RING : WHITE_10}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isSel ? "#a89cef" : WHITE_55, flexShrink: 0, transition: "all 0.2s",
            }}>
              {v.code === "TOURIST"  && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253"/></svg>}
              {v.code === "BUSINESS" && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>}
              {v.code === "TRANSIT"  && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: isSel ? "#fff" : WHITE_85, fontSize: 11, fontWeight: isSel ? 600 : 400 }}>{v.name}</div>
              <div style={{ color: WHITE_35, fontSize: 9.5, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.desc}</div>
            </div>
            {isSel && (
              <div style={{ width: 15, height: 15, background: PURPLE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="7" height="7" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"
                  style={{ animation: "wlp-check-draw 0.25s ease-out forwards" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DemoLocation({ selectedIdx, hoverIdx, phase }: {
  selectedIdx: number | null; hoverIdx: number | null; phase: Phase;
}) {
  const CITY_COLORS = ["#1a1040", "#0d2a3d", "#0f2d20", "#2d1a0d"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {LOCATIONS.map((loc, i) => {
        const isSel = selectedIdx === i;
        const isHov = hoverIdx === i && !isSel;
        return (
          <div key={loc.code} style={{
            borderRadius: 9, overflow: "hidden",
            border: isSel ? `1px solid ${PURPLE}` : isHov ? `1px solid ${PURPLE_RING}` : `0.5px solid ${WHITE_10}`,
            background: "rgba(255,255,255,0.03)",
            transition: "all 0.2s",
            animation: isSel && phase === "selected" ? "wlp-pulse-ring 0.6s ease-out" : "none",
          }}>
            <div style={{ position: "relative", height: 62, background: CITY_COLORS[i], overflow: "hidden" }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: "10px 10px",
              }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              {isSel && (
                <div style={{
                  position: "absolute", top: 5, right: 5,
                  width: 15, height: 15, background: PURPLE, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "wlp-badge-pop 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
                }}>
                  <svg width="7" height="7" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <div style={{ position: "absolute", bottom: 5, left: 7 }}>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>{loc.city}</span>
              </div>
            </div>
            <div style={{ padding: "5px 8px 7px" }}>
              <div style={{ fontSize: 8.5, color: "#a89cef", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.center}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DemoDetails({ selectedSponsor, selectedProfile, hoverTarget, phase }: {
  selectedSponsor: string | null; selectedProfile: string | null;
  hoverTarget: string | null; phase: Phase;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ color: WHITE_35, fontSize: 9, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>Trip sponsorship</div>
        <div style={{ display: "flex", gap: 6 }}>
          {SPONSORSHIP.map(s => {
            const isSel = selectedSponsor === s.id;
            const isHov = hoverTarget === `sponsor-${s.id}` && !isSel;
            return (
              <div key={s.id} style={{
                flex: 1, padding: "8px", borderRadius: 8, textAlign: "center",
                border: isSel ? `1px solid ${PURPLE}` : isHov ? `1px solid ${PURPLE_RING}` : `0.5px solid ${WHITE_10}`,
                background: isSel ? PURPLE_SOFT : isHov ? WHITE_04 : "transparent",
                color: isSel ? "#fff" : WHITE_55, fontSize: 10.5, fontWeight: isSel ? 500 : 400,
                transition: "all 0.2s",
                animation: isSel && phase === "selected" ? "wlp-pulse-ring 0.6s ease-out" : "none",
              }}>{s.label}</div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ color: WHITE_35, fontSize: 9, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>Your profile</div>
        <div style={{ display: "flex", gap: 6 }}>
          {PROFILES.map(p => {
            const isSel = selectedProfile === p.id;
            const isHov = hoverTarget === `profile-${p.id}` && !isSel;
            return (
              <div key={p.id} style={{
                flex: 1, padding: "8px 5px", borderRadius: 8, textAlign: "center",
                border: isSel ? `1px solid ${PURPLE}` : isHov ? `1px solid ${PURPLE_RING}` : `0.5px solid ${WHITE_10}`,
                background: isSel ? PURPLE_SOFT : isHov ? WHITE_04 : "transparent",
                color: isSel ? "#fff" : WHITE_55, fontSize: 10.5, fontWeight: isSel ? 500 : 400,
                transition: "all 0.2s",
                animation: isSel && phase === "selected" ? "wlp-pulse-ring 0.6s ease-out" : "none",
              }}>{p.label}</div>
            );
          })}
        </div>
      </div>
      {/* Status row — always rendered to hold space */}
      <div style={{ height: 16 }}>
        {(!selectedSponsor || !selectedProfile) ? (
          <div style={{ color: WHITE_35, fontSize: 10 }}>Select both options above to continue</div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: GREEN, fontSize: 10, animation: "wlp-fade-up 0.3s ease-out" }}>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Ready — showing your documents
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function Cursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      pointerEvents: "none", zIndex: 20,
      transform: "translate(0px, 0px)",
      transition: "left 0.7s cubic-bezier(0.22,1,0.36,1), top 0.7s cubic-bezier(0.22,1,0.36,1)",
    }}>
      {clicking && (
        <div style={{
          position: "absolute", width: 22, height: 22, borderRadius: "50%",
          background: "rgba(108,92,231,0.3)", top: -3, left: -3,
          animation: "wlp-ripple 0.5s ease-out forwards",
        }} />
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))", animation: clicking ? "wlp-cursor-click 0.3s ease-out" : "none" }}>
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 00-.85.36z" />
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WizardLeftPanel() {
  const [stepIdx, setStepIdx]   = useState(0);
  const [phase, setPhase]       = useState<Phase>("idle");
  const [entering, setEntering] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

  const [cursorX, setCursorX]   = useState(80);
  const [cursorY, setCursorY]   = useState(120);
  const [clicking, setClicking] = useState(false);

  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number | null>(null);
  const [hoverCountryIdx, setHoverCountryIdx]       = useState<number | null>(null);
  const [selectedVisaIdx, setSelectedVisaIdx]       = useState<number | null>(null);
  const [hoverVisaIdx, setHoverVisaIdx]             = useState<number | null>(null);
  const [selectedLocIdx, setSelectedLocIdx]         = useState<number | null>(null);
  const [hoverLocIdx, setHoverLocIdx]               = useState<number | null>(null);
  const [selectedSponsor, setSelectedSponsor]       = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile]       = useState<string | null>(null);
  const [hoverTarget, setHoverTarget]               = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const advanceStepRef = useRef<(fromIdx: number) => void>(() => {});

  const schedule = useCallback((fn: () => void, delay: number) => {
    timerRef.current = setTimeout(fn, delay);
  }, []);

  const CURSOR_TARGETS: Record<number, { x: number; y: number }[]> = {
    // Coordinates are relative to the content zone top-left (0,0)
    // Step 0: search bar ~36px tall, then row0 = 6px pad + half(28px) = ~52px
    0: [{ x: 130, y: 52 }, { x: 130, y: 52 }],
    // Step 1: visa row0 = 10px pad + half(30px) = ~25px
    1: [{ x: 130, y: 25 }, { x: 130, y: 25 }],
    // Step 2: top-left location card, image center ~31px, left half center ~68px
    2: [{ x: 68, y: 31 }, { x: 68, y: 31 }],
    // Step 3: sponsor label 16px + chip half 17px = ~33; profile starts ~85px + 16px label + 17px = ~118
    3: [
      { x: 75, y: 33  }, { x: 75, y: 33  },
      { x: 75, y: 118 }, { x: 75, y: 118 },
    ],
  };

  const runStep = useCallback((idx: number) => {
    setStepIdx(idx);
    setPhase("idle");
    setEntering(true);
    setTimeout(() => setEntering(false), T_ENTER);

    if (idx === 0) { setSelectedCountryIdx(null); setHoverCountryIdx(null); }
    if (idx === 1) { setSelectedVisaIdx(null);    setHoverVisaIdx(null);    }
    if (idx === 2) { setSelectedLocIdx(null);     setHoverLocIdx(null);     }
    if (idx === 3) { setSelectedSponsor(null); setSelectedProfile(null); setHoverTarget(null); }

    schedule(() => {
      const targets = CURSOR_TARGETS[idx];
      if (!targets) return;
      setPhase("interacting");

      if (idx === 0) {
        setCursorX(targets[0].x); setCursorY(targets[0].y);
        setHoverCountryIdx(0);
        schedule(() => {
          setClicking(true);
          schedule(() => {
            setClicking(false); setSelectedCountryIdx(0); setHoverCountryIdx(null);
            setPhase("selected");
            schedule(() => advanceStepRef.current(idx), T_SELECTED_HOLD);
          }, T_CLICK_HOLD);
        }, T_CURSOR_TRAVEL);
      }

      if (idx === 1) {
        setCursorX(targets[0].x); setCursorY(targets[0].y);
        setHoverVisaIdx(0);
        schedule(() => {
          setClicking(true);
          schedule(() => {
            setClicking(false); setSelectedVisaIdx(0); setHoverVisaIdx(null);
            setPhase("selected");
            schedule(() => advanceStepRef.current(idx), T_SELECTED_HOLD);
          }, T_CLICK_HOLD);
        }, T_CURSOR_TRAVEL);
      }

      if (idx === 2) {
        setCursorX(targets[0].x); setCursorY(targets[0].y);
        setHoverLocIdx(0);
        schedule(() => {
          setClicking(true);
          schedule(() => {
            setClicking(false); setSelectedLocIdx(0); setHoverLocIdx(null);
            setPhase("selected");
            schedule(() => advanceStepRef.current(idx), T_SELECTED_HOLD);
          }, T_CLICK_HOLD);
        }, T_CURSOR_TRAVEL);
      }

      if (idx === 3) {
        setCursorX(targets[0].x); setCursorY(targets[0].y);
        setHoverTarget("sponsor-self");
        schedule(() => {
          setClicking(true);
          schedule(() => {
            setClicking(false); setSelectedSponsor("self"); setHoverTarget(null);
            schedule(() => {
              setCursorX(targets[2].x); setCursorY(targets[2].y);
              setHoverTarget("profile-employed");
              schedule(() => {
                setClicking(true);
                schedule(() => {
                  setClicking(false); setSelectedProfile("employed"); setHoverTarget(null);
                  setPhase("selected");
                  schedule(() => advanceStepRef.current(idx), T_SELECTED_HOLD);
                }, T_CLICK_HOLD);
              }, T_CURSOR_TRAVEL);
            }, 500);
          }, T_CLICK_HOLD);
        }, T_CURSOR_TRAVEL);
      }
    }, T_IDLE_BEFORE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  const advanceStep = useCallback((fromIdx: number) => {
    setPhase("advancing");
    setCompletedSteps(prev => {
      const next = [...prev]; next[fromIdx] = true; return next;
    });
    schedule(() => {
      const nextIdx = (fromIdx + 1) % TOTAL_STEPS;
      if (nextIdx === 0) {
        schedule(() => { setCompletedSteps([false, false, false, false]); runStep(0); }, T_LOOP_PAUSE);
      } else {
        runStep(nextIdx);
      }
    }, T_ADVANCE + 200);
  }, [schedule, runStep]);

  useEffect(() => {
    advanceStepRef.current = advanceStep;
  }, [advanceStep]);

  useEffect(() => {
    const init = setTimeout(() => runStep(0), 600);
    return () => { clearTimeout(init); if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[stepIdx];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 460 }}>

        {/* ── Static text block ── */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(108,92,231,0.1)",
            border: "0.5px solid rgba(108,92,231,0.25)",
            color: "rgba(168,156,239,0.78)", fontSize: 9.5,
            letterSpacing: "0.05em", fontWeight: 500,
            padding: "4px 11px 4px 9px",
            borderRadius: 20, marginBottom: 16,
          }}>
            <div style={{
              width: 5, height: 5, background: PURPLE, borderRadius: "50%",
              boxShadow: "0 0 6px rgba(108,92,231,0.8)",
              animation: "wlp-blink 2.4s ease-in-out infinite",
            }} />
            Embassy-verified · Zero Server Storage
          </div>

          <h1 style={{
            color: "#fff",
            fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.038em",
          }}>
            Your visa checklist,<br />
            <span style={{
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #b8aef5 0%, #7c6fcd 55%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}>in 4 steps.</span>
          </h1>

          <p style={{
            marginTop: 12,
            color: WHITE_55,
            fontSize: 14.5,
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
            fontWeight: 400,
            maxWidth: 400,
            margin: "12px 0 0",
          }}>
            Answer a few questions and get your document checklist.
          </p>
        </div>

        {/* ── Animated preview card — FIXED HEIGHT ── */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
            borderLeft: "0.5px solid rgba(255,255,255,0.08)",
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            borderTop: "0.5px solid rgba(255,255,255,0.14)",
            borderRadius: 20,
            padding: "14px 16px 16px",
            overflow: "hidden",
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.18), " +
              "0 12px 40px rgba(0,0,0,0.42), " +
              "0 0 0 0.5px rgba(108,92,231,0.08) inset, " +
              "0 32px 64px rgba(108,92,231,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: "absolute", width: 240, height: 240,
            background: "radial-gradient(circle, rgba(108,92,231,0.07) 0%, transparent 70%)",
            top: -80, right: -50, pointerEvents: "none",
          }} />

          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                Step {stepIdx + 1} of {TOTAL_STEPS}
              </div>
              <div style={{
                color: WHITE_85, fontSize: 12.5, fontWeight: 500, marginTop: 3,
                letterSpacing: "-0.01em",
                transition: "opacity 0.3s",
                opacity: entering ? 0 : 1,
              }}>
                {step.title}
              </div>
            </div>

            {/* Step progress pips */}
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 3, borderRadius: 2,
                  width: i === stepIdx ? 20 : 12,
                  background: completedSteps[i] ? GREEN : i === stepIdx ? PURPLE : WHITE_18,
                  transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: i === stepIdx ? "0 0 6px rgba(108,92,231,0.5)" : "none",
                }} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "0.5px", background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

          {/* ── FIXED-HEIGHT content zone ── */}
          <div style={{ height: CONTENT_H, overflow: "hidden", position: "relative" }}>
            <div
              key={`step-${stepIdx}`}
              style={{
                animation: entering
                  ? "wlp-slide-in-right 0.42s cubic-bezier(0.22,1,0.36,1) forwards"
                  : "none",
              }}
            >
              {stepIdx === 0 && <DemoCountry  selectedIdx={selectedCountryIdx} hoverIdx={hoverCountryIdx} phase={phase} />}
              {stepIdx === 1 && <DemoVisa     selectedIdx={selectedVisaIdx}    hoverIdx={hoverVisaIdx}    phase={phase} />}
              {stepIdx === 2 && <DemoLocation selectedIdx={selectedLocIdx}     hoverIdx={hoverLocIdx}     phase={phase} />}
              {stepIdx === 3 && (
                <DemoDetails
                  selectedSponsor={selectedSponsor}
                  selectedProfile={selectedProfile}
                  hoverTarget={hoverTarget}
                  phase={phase}
                />
              )}
            </div>

            {/* Cursor lives inside the fixed zone */}
            <Cursor x={cursorX} y={cursorY} clicking={clicking} />
          </div>

          {/* Continue bar — always rendered, opacity+translate toggled */}
          <div style={{
            marginTop: 16,
            background: "linear-gradient(135deg, #6c5ce7 0%, #8b7cf8 100%)",
            borderRadius: 10, padding: "10px 14px",
            textAlign: "center",
            color: "#fff", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.01em",
            opacity: phase === "selected" ? 1 : 0,
            transform: phase === "selected" ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
            pointerEvents: "none",
            boxShadow: phase === "selected" ? "0 4px 16px rgba(108,92,231,0.35)" : "none",
          }}>
            {stepIdx < 3
              ? `Continue → ${["Choose visa type", "Select location", "Trip details", ""][stepIdx]}`
              : "Show my documents →"}
          </div>
        </div>
      </div>
    </>
  );
}