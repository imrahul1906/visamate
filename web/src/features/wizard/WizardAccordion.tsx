// visamate/web/src/features/wizard/WizardAccordion.tsx

"use client"
import { useState, useEffect, useRef } from "react";
import StepCountry from "./steps/StepCountry";
import StepVisaType from "./steps/StepVisaType";
import StepLocation from "./steps/StepLocation";
import StepDetails from "./steps/StepDetails";
import DocumentsContent from "../documents/DocumentsContent";
import FlightAnimation from "./FlightAnimation";
import { useApplicant } from "@/lib/context/ApplicantContext";
import { getAllCountries, type CountryCatalogEntry } from "@/lib/data/repository";
import type { WizardSelections } from "@/types/wizard";

// ─── Static data ─────────────────────────────────────────────────────────────

const TRUST = [
  { color: "#4ade80", label: "Embassy-verified" },
  { color: "#a78bfa", label: "Updated May 2026" },
  { color: "#60a5fa", label: "AI-powered" },
];

const STEP_LABELS = ["Country", "Visa type", "Location", "Details"];

// ─── WizardCard ───────────────────────────────────────────────────────────────

function WizardCard({ onShowDocuments }: { onShowDocuments: (s: WizardSelections) => void }) {
  const { update } = useApplicant();
  const [countries, setCountries] = useState<CountryCatalogEntry[]>([]);

  useEffect(() => {
    getAllCountries().then(setCountries).catch(err => {
      console.error("[WizardAccordion] Failed to load country data:", err);
    });
  }, []);

  const [activeStep, setActiveStep]                   = useState(0);
  const [, setDisplayStep]                 = useState(0);
  const [animState, setAnimState]                     = useState<"idle" | "exit" | "enter">("idle");
  const [direction, setDirection]                     = useState<1 | -1>(1);
  const animLock                                      = useRef(false);
  const [selectedCountry, setSelectedCountry]         = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [selectedVisa, setSelectedVisa]               = useState<string | null>(null);
  const [selectedVisaName, setSelectedVisaName]       = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation]       = useState<string | null>(null);
  const [sponsorship, setSponsorship]                 = useState<string | null>(null);
  const [profile, setProfile]                         = useState<string | null>(null);

  // ── Flight state ──────────────────────────────────────────────────────────
  // "idle"      → wizard steps shown normally
  // "animating" → flight animation plays; wizard content fades out behind it
  // "landed"    → flight animation frozen on last frame; user has scrolled to docs
  const [flightState, setFlightState]             = useState<"idle" | "animating" | "landed">("idle");
  const [pendingSelections, setPendingSelections] = useState<WizardSelections | null>(null);

  const goToStep = (next: number) => {
    if (animLock.current || next === activeStep) return;
    const dir = next > activeStep ? 1 : -1;
    setDirection(dir);
    setAnimState("exit");
    animLock.current = true;
    setTimeout(() => {
      setActiveStep(next);
      setDisplayStep(next);
      setAnimState("enter");
      setTimeout(() => { setAnimState("idle"); animLock.current = false; }, 320);
    }, 220);
  };

  const canContinue =
    activeStep === 0 ? !!selectedCountry :
    activeStep === 1 ? !!selectedVisa :
    activeStep === 2 ? !!selectedLocation :
    activeStep === 3 ? !!(sponsorship && profile) :
    true;

  const continueLabels = [
    "Continue → Choose visa type",
    "Continue → Select location",
    "Continue → Trip details",
    "Show my documents",
  ];

  const handleCountrySelect = (code: string | null, name: string | null) => {
    setSelectedCountry(code);
    setSelectedCountryName(name);
    setSelectedVisa(null);
    setSelectedVisaName(null);
    setSelectedLocation(null);
    setSponsorship(null);
    setProfile(null);
    update({
      country: code || "",
      visaType: "",
      visaTypeName: "",
      vfsCenter: "",
      sponsorshipType: null,
      applicantProfile: null,
    });
  };

  const handleVisaSelect = (code: string | null, name: string | null) => {
    setSelectedVisa(code);
    setSelectedVisaName(name);
    setSelectedLocation(null);
    setSponsorship(null);
    setProfile(null);
    update({
      visaType: code || "",
      visaTypeName: name || "",
      vfsCenter: "",
      sponsorshipType: null,
      applicantProfile: null,
    });
  };

  const handleDetailsSelect = (sp: string | null, pr: string | null) => {
    setSponsorship(sp);
    setProfile(pr);
  };

  const breadcrumbs = [selectedCountryName, selectedVisaName, selectedLocation]
    .slice(0, activeStep).filter(Boolean);

  const handleContinue = () => {
    if (!canContinue) return;
    if (activeStep === 3) {
      const selections: WizardSelections = {
        country:      selectedCountry     ?? "",
        countryName:  selectedCountryName ?? "",
        visaType:     selectedVisa        ?? "",
        visaTypeName: selectedVisaName    ?? "",
        location:     selectedLocation    ?? "",
        locationName: selectedLocation    ?? "",
        sponsorship:  sponsorship         ?? "SELF",
        profile:      profile             ?? "",
      };
      setPendingSelections(selections);
      setFlightState("animating");
    } else {
      goToStep(Math.min(activeStep + 1, STEP_LABELS.length - 1));
    }
  };

  const handleFlightComplete = () => {
    // Freeze the animation on its last frame and scroll to docs —
    // the card stays visible as a completed-state artifact
    setFlightState("landed");
    if (pendingSelections) onShowDocuments(pendingSelections);
  };

  // True whenever the flight map should be visible (playing or frozen on last frame)
  const showFlight = flightState === "animating" || flightState === "landed";

  return (
    <>
      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .wizard-card { animation: cardFloat 6s ease-in-out infinite; }
        .wizard-card:hover { animation-play-state: paused; }
        /* Pause the float while the flight animation plays */
        .wizard-card.is-flying { animation-play-state: paused; }

        @keyframes stepExitForward   { from { opacity:1; transform:translateX(0) scale(1); }     to { opacity:0; transform:translateX(-28px) scale(0.97); } }
        @keyframes stepExitBackward  { from { opacity:1; transform:translateX(0) scale(1); }     to { opacity:0; transform:translateX(28px)  scale(0.97); } }
        @keyframes stepEnterForward  { from { opacity:0; transform:translateX(32px)  scale(0.97); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes stepEnterBackward { from { opacity:0; transform:translateX(-32px) scale(0.97); } to { opacity:1; transform:translateX(0) scale(1); } }
        .step-exit-forward   { animation: stepExitForward   0.22s cubic-bezier(0.4,0,1,1)     forwards; }
        .step-exit-backward  { animation: stepExitBackward  0.22s cubic-bezier(0.4,0,1,1)     forwards; }
        .step-enter-forward  { animation: stepEnterForward  0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .step-enter-backward { animation: stepEnterBackward 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* Flight map fades in from a subtle scale */
        @keyframes flightFadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        .flight-enter { animation: flightFadeIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }

        .wizard-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className={`wizard-card${showFlight ? " is-flying" : ""}`}
        style={{
          height: 500,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",

          // Card surface morphs when flight is active — dark with purple glow
          background: showFlight
            ? "rgba(6,3,18,0.95)"
            : "rgba(255,255,255,0.035)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",

          // Top border glows purple on flight
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderTop: showFlight
            ? "0.5px solid rgba(108,92,231,0.4)"
            : "0.5px solid rgba(255,255,255,0.18)",

          borderRadius: 22,
          padding: "20px 20px 16px",

          // Deeper purple glow shadow during flight
          boxShadow: showFlight
            ? "0 8px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(108,92,231,0.3) inset, 0 32px 80px rgba(108,92,231,0.2)"
            : "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(108,92,231,0.12) inset, 0 32px 64px rgba(108,92,231,0.08)",

          transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

          {/* ── Header: always visible ────────────────────────────────────────── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 14, flexShrink: 0,
          }}>
            <div>
              {/* Sub-label: step counter → completion message on flight */}
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
                {showFlight ? "✓ All steps complete" : `Step ${activeStep + 1} of ${STEP_LABELS.length}`}
              </span>
              {/* Title: current step → route label on flight */}
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, marginTop: 1 }}>
                {showFlight
                  ? `India → ${pendingSelections?.countryName}`
                  : STEP_LABELS[activeStep] === "Country"
                    ? "Select destination"
                    : `Select ${STEP_LABELS[activeStep].toLowerCase()}`}
              </div>
            </div>

            {/* Progress dots: all green on flight, normal colours during wizard */}
            <div style={{ display: "flex", gap: 5 }}>
              {STEP_LABELS.map((_, i) => (
                <div key={i} style={{
                  width: showFlight ? 18 : i === activeStep ? 22 : 18,
                  height: 4, borderRadius: 2,
                  background: showFlight
                    ? "#4ade80"
                    : i < activeStep   ? "#4ade80"
                    : i === activeStep ? "#6c5ce7"
                    : "rgba(255,255,255,0.12)",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>

          {/* ── Breadcrumbs: only visible when not showing flight map ─────────── */}
          {!showFlight && breadcrumbs.length > 0 && (
            <div style={{ minHeight: 28, marginBottom: 10, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {breadcrumbs.map((label, i) => (
                  <div key={i} onClick={() => goToStep(i)} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(108,92,231,0.1)",
                    border: "0.5px solid rgba(108,92,231,0.3)",
                    borderRadius: 20, padding: "4px 10px 4px 8px", cursor: "pointer",
                  }}>
                    <svg width="10" height="10" fill="none" stroke="#4ade80" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span style={{ color: "#a89cef", fontSize: 11 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Content area: flight map OR wizard step (both always in DOM) ──── */}
          <div style={{
            flex: 1, minHeight: 0, marginBottom: 14,
            position: "relative", overflow: "hidden",
          }}>

            {/* Flight animation — rendered in-flow, fills the content slot */}
            {showFlight && pendingSelections && (
              <div
                className={flightState === "animating" ? "flight-enter" : undefined}
                style={{ position: "absolute", inset: 0 }}
              >
                <FlightAnimation
                  inline
                  countryCode={pendingSelections.country}
                  countryName={pendingSelections.countryName}
                  originLocationCode={pendingSelections.location}
                  // No-op once landed so a re-render can't double-fire onComplete
                  onComplete={flightState === "animating" ? handleFlightComplete : () => {}}
                />
              </div>
            )}

            {/* Wizard step content — never unmounted; fades out behind the flight map */}
            <div style={{
              position: "absolute", inset: 0,
              overflowY: "auto", overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              // Hidden (not removed) while flight plays — preserves all step state
              opacity: showFlight ? 0 : 1,
              pointerEvents: showFlight ? "none" : "auto",
              transition: "opacity 0.25s ease",
            }}>
              <div
                className={
                  animState === "exit"
                    ? (direction === 1 ? "step-exit-forward"  : "step-exit-backward")
                    : animState === "enter"
                    ? (direction === 1 ? "step-enter-forward" : "step-enter-backward")
                    : ""
                }
                style={{ height: "100%" }}
              >
                <div className="wizard-scroll" style={{ height: "100%" }}>
                  {activeStep === 0 && (
                    <StepCountry allCountries={countries} selectedCountry={selectedCountry} onSelect={handleCountrySelect} compact />
                  )}
                  {activeStep === 1 && (
                    <StepVisaType countryCode={selectedCountry} selectedVisa={selectedVisa} onSelect={handleVisaSelect} compact />
                  )}
                  {activeStep === 2 && (
                    <StepLocation countryCode={selectedCountry} selectedLocation={selectedLocation} onSelect={setSelectedLocation} compact />
                  )}
                  {activeStep === 3 && (
                    <StepDetails sponsorship={sponsorship} profile={profile} onSelect={handleDetailsSelect} compact />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA: always pinned to bottom; morphs to "Edit selections" on flight ── */}
          <div style={{ flexShrink: 0 }}>
            <button
              onClick={
                showFlight
                  // Dismiss flight, restore wizard at step 3
                  ? () => { setFlightState("idle"); setPendingSelections(null); goToStep(3); }
                  : handleContinue
              }
              style={{
                width: "100%",
                // Muted purple ghost button on flight; gradient/solid on normal steps
                background: showFlight
                  ? "rgba(108,92,231,0.15)"
                  : canContinue
                    ? activeStep === 3
                      ? "linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%)"
                      : "#6c5ce7"
                    : "rgba(255,255,255,0.06)",
                color: showFlight
                  ? "#a89cef"
                  : canContinue ? "#fff" : "rgba(255,255,255,0.2)",
                border: showFlight
                  ? "0.5px solid rgba(108,92,231,0.35)"
                  : "none",
                borderRadius: 10, padding: "11px",
                fontSize: 13, fontWeight: 500,
                cursor: showFlight || canContinue ? "pointer" : "not-allowed",
                transition: "all 0.3s",
                boxShadow: !showFlight && canContinue && activeStep === 3
                  ? "0 4px 20px rgba(108,92,231,0.4)"
                  : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {showFlight ? (
                // Flight mode: back-arrow + "Edit selections"
                <>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Edit selections
                </>
              ) : (
                // Normal wizard mode
                <>
                  {activeStep === 3 && canContinue && (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75m-7.5 6h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v12A2.25 2.25 0 004.5 21z" />
                    </svg>
                  )}
                  {continueLabels[activeStep] ?? "Continue"}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onShowDocuments }: { onShowDocuments: (s: WizardSelections) => void }) {
  return (
    <section style={{
      background: "#0a0718", minHeight: "100vh", padding: "0 32px",
      display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "radial-gradient(circle at 70% 40%, rgba(108,92,231,0.12) 0%, transparent 60%), " +
          "radial-gradient(circle at 20% 80%, rgba(108,92,231,0.06) 0%, transparent 50%)",
      }} />
      <div className="hero-grid" style={{
        maxWidth: 1100, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56,
        alignItems: "center", paddingTop: 80, position: "relative",
      }}>
        {/* Left copy */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(108,92,231,0.15)", border: "0.5px solid rgba(108,92,231,0.38)",
            color: "#a89cef", fontSize: 11, padding: "4px 12px", borderRadius: 20, marginBottom: 24,
          }}>
            <div style={{ width: 5, height: 5, background: "#6c5ce7", borderRadius: "50%" }} />
            Visa Document Intelligence
          </div>
          <h1 style={{
            color: "#fff", fontSize: "clamp(32px, 4vw, 50px)",
            fontWeight: 500, lineHeight: 1.15, margin: "0 0 18px", letterSpacing: "-0.03em",
          }}>
            Your personalised<br />visa checklist,<br />
            <span style={{ color: "#a89cef" }}>in 4 steps.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 14, lineHeight: 1.7, margin: "0 0 30px", maxWidth: 420 }}>
            Accurate requirements sourced from official embassy data — no guesswork, no missed documents.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {TRUST.map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: wizard card */}
        <div><WizardCard onShowDocuments={onShowDocuments} /></div>
      </div>
    </section>
  );
}

// ─── DocumentsSection ─────────────────────────────────────────────────────────

function DocumentsSection({ sectionRef, visible, selections }: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  selections: WizardSelections;
}) {
  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0d0b1e",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        padding: "72px 0 80px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(56px)",
        transition: "opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <DocumentsContent
        embedded
        country={selections.country}
        countryName={selections.countryName}
        visaType={selections.visaType}
        visaTypeName={selections.visaTypeName}
        location={selections.location}
        locationName={selections.locationName}
        sponsorship={selections.sponsorship}
        profile={selections.profile}
      />
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function VisaMateLanding() {
  const [docsVisible, setDocsVisible]           = useState(false);
  const [wizardSelections, setWizardSelections] = useState<WizardSelections | null>(null);
  const docsSectionRef                          = useRef<HTMLDivElement>(null);

  const scrollToDocs = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = docsSectionRef.current;
      if (!target) return;
      const startY   = window.scrollY;
      const targetY  = target.getBoundingClientRect().top + window.scrollY;
      const distance = targetY - startY;
      const duration = 900;
      let startTime: number | null = null;
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        window.scrollTo(0, startY + distance * easeOutCubic(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }));
  };

  const handleShowDocuments = (selections: WizardSelections) => {
    setWizardSelections(selections);
    setDocsVisible(true);
    scrollToDocs();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <Hero onShowDocuments={handleShowDocuments} />
      {docsVisible && wizardSelections && (
        <DocumentsSection sectionRef={docsSectionRef} visible={docsVisible} selections={wizardSelections} />
      )}
    </div>
  );
}