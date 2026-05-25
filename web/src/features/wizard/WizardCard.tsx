// visamate/web/src/features/wizard/WizardCard.tsx

"use client"
import { useState, useEffect, useRef } from "react";
import StepCountry from "./steps/StepCountry";
import StepVisaType from "./steps/StepVisaType";
import StepLocation from "./steps/StepLocation";
import StepDetails from "./steps/StepDetails";
import FlightAnimation from "./FlightAnimation";
import { useApplicant } from "@/lib/context/ApplicantContext";
import { getAllCountries, type CountryCatalogEntry } from "@/lib/data/repository";
import type { WizardSelections } from "@/types/wizard";
import type { ApplicantData } from "@/types/applicant";
import { storage, STORAGE_KEYS } from "@/lib/utils/storage";

interface StoredCardState {
  activeStep: number;
  flightState: "idle" | "animating" | "landed";
  pendingSelections: WizardSelections | null;
}

const STEP_LABELS = ["Country", "Visa type", "Location", "Details"];

export default function WizardCard({
  onShowDocuments,
  onEditSelections,
}: {
  onShowDocuments: (s: WizardSelections) => void;
  onEditSelections?: () => void;
}) {
  const { ctx, update, reset } = useApplicant();
  const [countries, setCountries] = useState<CountryCatalogEntry[]>([]);
  const [isOnlineVisa, setIsOnlineVisa] = useState(false);

  useEffect(() => {
    getAllCountries().then(setCountries).catch(err => {
      console.error("[WizardCard] Failed to load country data:", err);
    });
  }, []);

  const [activeStep, setActiveStep]                   = useState(0);
  const [, setDisplayStep]                            = useState(0);
  const [animState, setAnimState]                     = useState<"idle" | "exit" | "enter">("idle");
  const [direction, setDirection]                     = useState<1 | -1>(1);
  const animLock                                      = useRef(false);
  const [selectedCountry, setSelectedCountry]         = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [selectedVisa, setSelectedVisa]               = useState<string | null>(null);
  const [selectedVisaName, setSelectedVisaName]       = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation]       = useState<string | null>(null);

  // ── Flight state ──────────────────────────────────────────────────────────
  // "idle"      → wizard steps shown normally
  // "animating" → flight animation plays; wizard content fades out behind it
  // "landed"    → flight animation frozen on last frame; user has scrolled to docs
  const [flightState, setFlightState]             = useState<"idle" | "animating" | "landed">("idle");
  const [pendingSelections, setPendingSelections] = useState<WizardSelections | null>(null);
  const [showResumePrompt, setShowResumePrompt]   = useState(false);
  const [resumeCountryName, setResumeCountryName] = useState<string>("");
  const [resumeVisaTypeName, setResumeVisaTypeName] = useState<string>("");
  const isLoadedRef = useRef(false);

  // Check if there is saved progress to offer resume
  useEffect(() => {
    const storedCtx = storage.get<Partial<ApplicantData> | null>(STORAGE_KEYS.APPLICANT_DATA, null);
    let hasSavedData = false;
    let savedCountry = "";
    let savedVisaTypeName = "";
    if (storedCtx) {
      if (storedCtx.country) {
        hasSavedData = true;
        savedCountry = storedCtx.country;
        savedVisaTypeName = storedCtx.visaTypeName || "";
      }
    }

    if (hasSavedData) {
      setResumeVisaTypeName(savedVisaTypeName);
      getAllCountries().then(list => {
        const match = list.find(c => c.code === savedCountry);
        if (match) {
          setResumeCountryName(match.name);
        } else {
          setResumeCountryName(savedCountry);
        }
      }).catch(() => {
        setResumeCountryName(savedCountry);
      });
      setShowResumePrompt(true);
    } else {
      isLoadedRef.current = true;
    }
  }, []);

  const handleResume = async () => {
    try {
      const storedCard = storage.get<Partial<StoredCardState> | null>(STORAGE_KEYS.CARD_STATE, null);
      let loadedActiveStep = 0;
      let loadedFlightState: "idle" | "animating" | "landed" = "idle";
      let loadedPendingSelections = null;

      if (storedCard) {
        if (storedCard.activeStep !== undefined) loadedActiveStep = storedCard.activeStep;
        if (storedCard.flightState !== undefined) {
          // Keep the animating state on resume so that the flight animation actually plays
          // and triggers the callback at the end, rather than scrolling to documents immediately.
          loadedFlightState = storedCard.flightState;
        }
        if (storedCard.pendingSelections !== undefined) loadedPendingSelections = storedCard.pendingSelections;
      }

      const storedCtx = storage.get<Partial<ApplicantData> | null>(STORAGE_KEYS.APPLICANT_DATA, null);
      if (storedCtx) {
        let restoredCountry = storedCtx.country || "";
        let restoredCountryName = storedCtx.countryName || "";

        if (restoredCountry) {
          try {
            const list = await getAllCountries();
            let match = list.find(c => c.code === restoredCountry);
            if (match) {
              restoredCountryName = match.name;
            } else {
              match = list.find(c => c.name.toLowerCase() === restoredCountry.toLowerCase());
              if (match) {
                restoredCountry = match.code;
                restoredCountryName = match.name;
              }
            }
          } catch (err) {
            console.error("[handleResume] Failed to resolve country name/code:", err);
          }
          setSelectedCountry(restoredCountry);
          setSelectedCountryName(restoredCountryName);

          // Sync back to context
          update({
            country: restoredCountry,
            countryName: restoredCountryName,
          });
        }

        if (storedCtx.visaType) {
          setSelectedVisa(storedCtx.visaType);
          setSelectedVisaName(storedCtx.visaTypeName || "");
          if (restoredCountry) {
            try {
              const { getVisaType } = await import("@/lib/data/repository");
              const vt = await getVisaType(restoredCountry, storedCtx.visaType);
              const isOnline = vt?.process?.default?.applicationMode === "ONLINE";
              setIsOnlineVisa(isOnline);
            } catch (err) {
              console.error("[handleResume] Failed to check online status:", err);
            }
          }
        }
        if (storedCtx.vfsCenter) setSelectedLocation(storedCtx.vfsCenter);
      }

      setActiveStep(loadedActiveStep);
      setDisplayStep(loadedActiveStep);
      setFlightState(loadedFlightState);
      setPendingSelections(loadedPendingSelections);

      // Only scroll/show documents immediately if they were already fully "landed" in the previous session
      if (loadedFlightState === "landed" && loadedPendingSelections) {
        onShowDocuments(loadedPendingSelections);
      }
    } catch (e) {
      console.error("Failed to load wizard card state from localStorage", e);
    } finally {
      isLoadedRef.current = true;
      setShowResumePrompt(false);
    }
  };

  const handleStartFresh = () => {
    reset(); // Clear context and localStorage (calls storage.clearSession())
    
    // Reset wizard card states to defaults
    setActiveStep(0);
    setDisplayStep(0);
    setFlightState("idle");
    setPendingSelections(null);
    setSelectedCountry(null);
    setSelectedCountryName(null);
    setSelectedVisa(null);
    setSelectedVisaName(null);
    setSelectedLocation(null);
    setIsOnlineVisa(false);

    setShowResumePrompt(false);
    isLoadedRef.current = true;
    storage.remove(STORAGE_KEYS.CARD_STATE);
    onEditSelections?.();
  };

  // Set country name once countries list is loaded and selectedCountry is resolved
  useEffect(() => {
    if (selectedCountry && countries.length > 0 && !selectedCountryName) {
      const countryObj = countries.find(c => c.code === selectedCountry);
      if (countryObj) {
        setSelectedCountryName(countryObj.name);
      }
    }
  }, [selectedCountry, countries, selectedCountryName]);

  // Save wizard state to localStorage on changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    storage.set(STORAGE_KEYS.CARD_STATE, {
      activeStep,
      flightState,
      pendingSelections,
    });
  }, [activeStep, flightState, pendingSelections]);

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

  const steps = isOnlineVisa ? ["Country", "Visa type"] : ["Country", "Visa type", "Location", "Details"];

  const canContinue =
    activeStep === 0 ? !!selectedCountry :
    activeStep === 1 ? !!selectedVisa :
    activeStep === 2 ? !!selectedLocation :
    activeStep === 3 ? !!(ctx.sponsorshipType && ctx.applicantProfile) :
    true;

  const continueLabels = isOnlineVisa
    ? ["Continue → Choose visa type", "Show my documents"]
    : [
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
    setIsOnlineVisa(false);
    update({
      country: code || "",
      countryName: name || "",
      visaType: "",
      visaTypeName: "",
      vfsCenter: "",
      sponsorshipType: null,
      applicantProfile: null,
    });
    setShowResumePrompt(false);
    isLoadedRef.current = true;
    storage.set(STORAGE_KEYS.CARD_STATE, {
      activeStep: 0,
      flightState: "idle",
      pendingSelections: null,
    });
  };

  const handleVisaSelect = async (code: string | null, name: string | null) => {
    setSelectedVisa(code);
    setSelectedVisaName(name);
    setSelectedLocation(null);
    update({
      visaType: code || "",
      visaTypeName: name || "",
      vfsCenter: "",
      sponsorshipType: null,
      applicantProfile: null,
    });

    if (code && selectedCountry) {
      try {
        const { getVisaType } = await import("@/lib/data/repository");
        const vt = await getVisaType(selectedCountry, code);
        const isOnline = vt?.process?.default?.applicationMode === "ONLINE";
        setIsOnlineVisa(isOnline);
        if (isOnline) {
          setSelectedLocation("ONLINE");
          update({ vfsCenter: "ONLINE" });
        }
      } catch (err) {
        console.error("[handleVisaSelect] Failed to determine if visa is online:", err);
        setIsOnlineVisa(false);
      }
    } else {
      setIsOnlineVisa(false);
    }
  };

  const breadcrumbs = [selectedCountryName, selectedVisaName, selectedLocation]
    .slice(0, activeStep).filter(Boolean);

  const handleContinue = () => {
    if (!canContinue) return;
    const maxStep = steps.length - 1;
    if (activeStep === maxStep) {
      const selections: WizardSelections = {
        country:      selectedCountry     ?? "",
        countryName:  selectedCountryName ?? "",
        visaType:     selectedVisa        ?? "",
        visaTypeName: selectedVisaName    ?? "",
        location:     isOnlineVisa ? "ONLINE" : (selectedLocation ?? ""),
        locationName: isOnlineVisa ? "Online Submission" : (selectedLocation ?? ""),
        sponsorship:  isOnlineVisa ? "SELF" : (ctx.sponsorshipType ?? "SELF"),
        profile:      isOnlineVisa ? "EMPLOYED" : (ctx.applicantProfile ?? ""),
      };
      setPendingSelections(selections);
      setFlightState("animating");
    } else {
      goToStep(Math.min(activeStep + 1, maxStep));
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

        .wizard-scroll::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        .wizard-scroll { scrollbar-width: none !important; -ms-overflow-style: none !important; }
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
                {showFlight ? "✓ All steps complete" : `Step ${activeStep + 1} of ${steps.length}`}
              </span>
              {/* Title: current step → route label on flight */}
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, marginTop: 1 }}>
                {showFlight
                  ? `India → ${pendingSelections?.countryName}`
                  : steps[activeStep] === "Country"
                    ? "Select destination"
                    : `Select ${steps[activeStep].toLowerCase()}`}
              </div>
            </div>

            {/* Progress dots: all green on flight, normal colours during wizard */}
            <div style={{ display: "flex", gap: 5 }}>
              {steps.map((_, i) => (
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
                  isLanded={flightState === "landed"}
                  // No-op once landed so a re-render can't double-fire onComplete
                  onComplete={flightState === "animating" ? handleFlightComplete : () => {}}
                />
              </div>
            )}

            {/* Wizard step content — never unmounted; fades out behind the flight map */}
            <div
              className="vm-scroll-hidden"
              style={{
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
              }}
            >
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
                     <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
                        <div
                          style={{
                            background: "rgba(108, 92, 231, 0.1)",
                            border: showResumePrompt ? "1px solid rgba(108, 92, 231, 0.25)" : "1px solid transparent",
                            borderRadius: 12,
                            padding: showResumePrompt ? "10px 14px" : "0px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            flexShrink: 0,
                            boxShadow: showResumePrompt ? "0 4px 15px rgba(0, 0, 0, 0.2)" : "none",
                            backdropFilter: showResumePrompt ? "blur(8px)" : "none",
                            opacity: showResumePrompt ? 1 : 0,
                            maxHeight: showResumePrompt ? 100 : 0,
                            overflow: "hidden",
                            marginBottom: showResumePrompt ? 10 : 0,
                            pointerEvents: showResumePrompt ? "auto" : "none",
                            transition: "all 0.35s ease-in-out",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <div style={{ flexShrink: 0 }}>
                              <svg width="16" height="16" fill="none" stroke="#a89cef" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                            </div>
                            <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 11, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Resume application to <strong>{resumeCountryName || "destination"}</strong>?
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button
                              onClick={handleResume}
                              style={{
                                background: "#6c5ce7",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontSize: 10,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#5b4ad4"}
                              onMouseLeave={e => e.currentTarget.style.background = "#6c5ce7"}
                            >
                              Resume
                            </button>
                            <button
                              onClick={handleStartFresh}
                              style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                color: "rgba(255, 255, 255, 0.6)",
                                border: "0.5px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: 6,
                                padding: "4px 8px",
                                fontSize: 10,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                              }}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                       <div style={{ flex: 1, minHeight: 0 }}>
                         <StepCountry allCountries={countries} selectedCountry={selectedCountry} onSelect={handleCountrySelect} compact />
                       </div>
                     </div>
                  )}
                  {activeStep === 1 && (
                    <StepVisaType countryCode={selectedCountry} selectedVisa={selectedVisa} onSelect={handleVisaSelect} compact />
                  )}
                  {activeStep === 2 && (
                    <StepLocation countryCode={selectedCountry} selectedLocation={selectedLocation} onSelect={setSelectedLocation} compact />
                  )}
                  {activeStep === 3 && (
                    <StepDetails compact />
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
                  // Dismiss flight, restore wizard at the last step
                  ? () => {
                      setFlightState("idle");
                      setPendingSelections(null);
                      goToStep(isOnlineVisa ? 1 : 3);
                      onEditSelections?.();
                    }
                  : handleContinue
              }
              style={{
                width: "100%",
                // Muted purple ghost button on flight; gradient/solid on normal steps
                background: showFlight
                  ? "rgba(108,92,231,0.15)"
                  : canContinue
                    ? activeStep === (steps.length - 1)
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
                boxShadow: !showFlight && canContinue && activeStep === (steps.length - 1)
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
                  {activeStep === (steps.length - 1) && canContinue && (
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
