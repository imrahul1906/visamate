"use client";

/**
 * WizardAccordion — Unified Split-Screen Command Center
 * ======================================================
 * Left panel  : sticky accordion wizard (collapsible)
 * Divider     : draggable resize handle
 * Right panel : SmartRightPanel (Journey Map experience)
 *               → Step 0: Animated globe + destination cards (JourneySpark)
 *               → Step 1: Country brief with stats + tips  (CountryBrief)
 *               → Step 2: Doc-radar animated rings preview (DocRadar)
 *               → Step 3: Progressive checklist             (ProgressiveList)
 *               → All done: Full DocumentsContent
 */

import React, {
  useState, useRef, useEffect, useCallback,
} from "react";
import DocumentsContent from "@/app/documents/DocumentsContent";
import SmartRightPanel  from "@/components/wizard/SmartRightPanel";

import StepCountry   from "@/components/wizard/steps/StepCountry";
import StepVisaType  from "@/components/wizard/steps/StepVisaType";
import StepLocation  from "@/components/wizard/steps/StepLocation";
import StepDetails   from "@/components/wizard/steps/StepDetails";
import { getAllCountries, type CountryCatalogEntry } from "@/lib/data/repository";

// ─────────────────────────────────────────────────────────────
// Session storage
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "visaguide_wizard_selection";

interface Selection {
  country: string | null;
  countryName: string | null;
  visaType: string | null;
  visaTypeName: string | null;
  location: string | null;
  sponsorship: string | null;
  profile: string | null;
}

const DEFAULT_SELECTION: Selection = {
  country: null, countryName: null,
  visaType: null, visaTypeName: null,
  location: null, sponsorship: null, profile: null,
};

function loadSelection(): Selection {
  try {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return DEFAULT_SELECTION;
    return { ...DEFAULT_SELECTION, ...JSON.parse(raw) };
  } catch { return DEFAULT_SELECTION; }
}

function saveSelection(sel: Selection) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sel)); } catch {}
}


// ─────────────────────────────────────────────────────────────
// Label maps
// ─────────────────────────────────────────────────────────────
const sponsorshipLabels: Record<string, string> = { self: "Self-Sponsored", sponsored: "Sponsored" };
const profileLabels: Record<string, string>     = { employed: "Employed", student: "Student", "self-employed": "Self-Employed" };

// ─────────────────────────────────────────────────────────────
// Animated collapsible body
// ─────────────────────────────────────────────────────────────
function AnimatedBody({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH]     = useState(0);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (!innerRef.current) return;
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (innerRef.current) setMaxH(innerRef.current.scrollHeight);
      }));
    } else {
      setMaxH(0);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !innerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (innerRef.current && isOpen) setMaxH(innerRef.current.scrollHeight);
    });
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <div style={{ maxHeight: maxH, overflow: "hidden", transition: "max-height 400ms cubic-bezier(0.4,0,0.2,1)" }}>
      <div
        ref={innerRef}
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 300ms ease 60ms, transform 300ms ease 60ms",
        }}
      >
        {visible && children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Accordion card
// ─────────────────────────────────────────────────────────────
type CardId = "country" | "visaType" | "location" | "details";

function AccordionCard({
  step, title, subtitle, isOpen, isDone, isLocked,
  summary, onEdit, onToggle, children,
}: {
  step: number; title: string; subtitle: string;
  isOpen: boolean; isDone: boolean; isLocked: boolean;
  summary?: string; onEdit?: () => void; onToggle?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      borderRadius: 12,
      border: isOpen ? "1.5px solid #c7d2fe" : "1.5px solid #e5e7eb",
      boxShadow: isOpen ? "0 4px 20px rgba(99,102,241,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      background: isLocked ? "#fafafa" : "#fff",
      opacity: isLocked ? 0.45 : 1,
      transition: "box-shadow 300ms ease, border-color 300ms ease, opacity 300ms ease",
      overflow: "hidden",
    }}>
      <div
        onClick={() => { if (!isLocked) onToggle?.(); }}
        style={{
          padding: "13px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 54, cursor: isLocked ? "default" : "pointer", userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            background: isDone ? "#22c55e" : isOpen ? "#6366f1" : "#e5e7eb",
            color: isDone || isOpen ? "#fff" : "#9ca3af",
            transition: "background 300ms ease",
          }}>
            {isDone
              ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              : step}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontSize: 11.5, marginTop: 1, lineHeight: 1.3 }}>
              {isDone && !isOpen && summary
                ? <span style={{ color: "#6366f1", fontWeight: 500 }}>{summary}</span>
                : !isDone && !isOpen
                  ? <span style={{ color: "#9ca3af" }}>{subtitle}</span>
                  : <span style={{ opacity: 0 }}>·</span>
              }
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
          {isDone && !isOpen && (
            <button
              onClick={e => { e.stopPropagation(); onEdit?.(); }}
              style={{
                fontSize: 11, fontWeight: 600, color: "#6366f1",
                padding: "4px 10px", borderRadius: 6, border: "none",
                background: "transparent", cursor: "pointer",
                transition: "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#eef2ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >Edit</button>
          )}
          <div style={{ color: isOpen ? "#6366f1" : "#d1d5db", transition: "color 300ms ease" }}>
            <svg
              width="15" height="15" fill="none" stroke="currentColor"
              strokeWidth={2} viewBox="0 0 24 24"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 350ms cubic-bezier(0.4,0,0.2,1)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
      <AnimatedBody isOpen={isOpen}>
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "18px 16px 20px" }}>
          {children}
        </div>
      </AnimatedBody>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Collapsed icon rail
// ─────────────────────────────────────────────────────────────
function CollapsedRail({
  steps, completedSteps, onExpand,
}: {
  steps: { id: CardId; icon: string }[];
  completedSteps: Set<CardId>;
  onExpand: () => void;
}) {
  return (
    <div style={{ width: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 0" }}>
      <button
        onClick={onExpand}
        title="Expand wizard"
        style={{
          width: 36, height: 36, borderRadius: 10, border: "1.5px solid #e5e7eb",
          background: "#fff", cursor: "pointer", marginBottom: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6366f1", transition: "all 150ms ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      {steps.map((s, i) => (
        <div key={s.id} title={s.id} style={{
          width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: completedSteps.has(s.id) ? "#eef2ff" : "#f9fafb",
          border: completedSteps.has(s.id) ? "1.5px solid #c7d2fe" : "1.5px solid #e5e7eb",
          transition: "all 200ms ease",
        }}>
          {completedSteps.has(s.id)
            ? <svg width="14" height="14" fill="none" stroke="#6366f1" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>{i + 1}</span>
          }
        </div>
      ))}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// Draggable divider
// ─────────────────────────────────────────────────────────────
function DragDivider({
  onDrag,
  isDragging,
  setIsDragging,
}: {
  onDrag: (dx: number) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}) {
  const startX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startX.current = e.clientX;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      onDrag(e.clientX - startX.current);
      startX.current = e.clientX;
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging, onDrag, setIsDragging]);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        width: isDragging ? 4 : 3,
        flexShrink: 0,
        background: isDragging ? "#6366f1" : "#e5e7eb",
        cursor: "col-resize",
        transition: "background 150ms ease, width 150ms ease",
        position: "relative",
        zIndex: 10,
        // Widen the hit area invisibly
        boxShadow: "4px 0 0 transparent, -4px 0 0 transparent",
      }}
      title="Drag to resize"
    >
      {/* Visual dots */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column", gap: 3,
        opacity: isDragging ? 0 : 0.35,
        transition: "opacity 150ms",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#6366f1" }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wizard steps config
// ─────────────────────────────────────────────────────────────
const WIZARD_STEPS: { id: CardId; title: string; subtitle: string; icon: string }[] = [
  { id: "country",  title: "Select Destination Country",  subtitle: "Where are you planning to go?",              icon: "🌍" },
  { id: "visaType", title: "Select Visa Type",            subtitle: "What type of visa do you need?",             icon: "📄" },
  { id: "location", title: "Where will you apply from?",  subtitle: "City where you'll submit your application",  icon: "📍" },
  { id: "details",  title: "Tell us about your trip",     subtitle: "Sponsorship & employment profile",            icon: "👤" },
];

const LEFT_MIN = 380;
const LEFT_MAX = 680;
const LEFT_DEFAULT = 540;

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function WizardAccordion() {
  const [allCountries, setAllCountries] = useState<CountryCatalogEntry[]>([]);
  const [selection, setSelectionRaw]   = useState<Selection>(DEFAULT_SELECTION);
  const [hydrated, setHydrated]        = useState(false);
  const [openCard, setOpenCard]        = useState<CardId | null>("country");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [leftWidth, setLeftWidth]      = useState(LEFT_DEFAULT);
  const [dividerDragging, setDividerDragging] = useState(false);
  const isEditingRef = useRef(false);

  // Hydrate from session storage
  useEffect(() => {
    const saved = loadSelection();
    setSelectionRaw(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const saved = loadSelection();
    const allComplete = WIZARD_STEPS.every(s => {
      if (s.id === "country")  return !!saved.country;
      if (s.id === "visaType") return !!saved.visaType;
      if (s.id === "location") return !!saved.location;
      if (s.id === "details")  return !!saved.sponsorship && !!saved.profile;
      return false;
    });
    if (allComplete) {
      setOpenCard(null);
      setLeftCollapsed(true);
    } else {
      const first = WIZARD_STEPS.find(s => {
        if (s.id === "country")  return !saved.country;
        if (s.id === "visaType") return !saved.visaType;
        if (s.id === "location") return !saved.location;
        if (s.id === "details")  return !saved.sponsorship || !saved.profile;
        return false;
      });
      setOpenCard(first?.id ?? "country");
    }
    getAllCountries().then(setAllCountries);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const setSelection = useCallback((updater: (prev: Selection) => Selection) => {
    setSelectionRaw(prev => {
      const next = updater(prev);
      saveSelection(next);
      return next;
    });
  }, []);

  const isComplete = useCallback((id: CardId): boolean => {
    if (id === "country")  return !!selection.country;
    if (id === "visaType") return !!selection.visaType;
    if (id === "location") return !!selection.location;
    if (id === "details")  return !!selection.sponsorship && !!selection.profile;
    return false;
  }, [selection]);

  const isLocked = useCallback((id: CardId): boolean => {
    const order: CardId[] = ["country", "visaType", "location", "details"];
    const i = order.indexOf(id);
    return i > 0 && !isComplete(order[i - 1]);
  }, [isComplete]);

  const allDone = WIZARD_STEPS.every(s => isComplete(s.id));
  const completedCount = WIZARD_STEPS.filter(s => isComplete(s.id)).length;

  const collapsedSummary = (id: CardId): string => {
    if (id === "country"  && selection.countryName)  return selection.countryName;
    if (id === "visaType" && selection.visaTypeName)  return selection.visaTypeName;
    if (id === "location" && selection.location)      return selection.location;
    if (id === "details"  && selection.sponsorship)
      return `${sponsorshipLabels[selection.sponsorship] ?? selection.sponsorship} · ${profileLabels[selection.profile ?? ""] ?? selection.profile ?? ""}`;
    return "";
  };

  const handleToggle = (id: CardId) => {
    if (isLocked(id)) return;
    isEditingRef.current = openCard !== id && allDone;
    setOpenCard(prev => prev === id ? null : id);
  };

  const handleEdit = (id: CardId) => {
    if (!isLocked(id)) {
      isEditingRef.current = allDone;
      setOpenCard(id);
      setLeftCollapsed(false);
    }
  };

  const advance = (next: CardId | null) => {
    if (isEditingRef.current) {
      isEditingRef.current = false;
      setTimeout(() => {
        setOpenCard(null);
        if (WIZARD_STEPS.every(s => isComplete(s.id))) setTimeout(() => setLeftCollapsed(true), 600);
      }, 300);
    } else {
      setTimeout(() => {
        setOpenCard(next);
        if (next === null) setTimeout(() => setLeftCollapsed(true), 600);
      }, 300);
    }
  };

  // Draggable divider handler
  const handleDividerDrag = useCallback((dx: number) => {
    setLeftWidth(w => Math.min(LEFT_MAX, Math.max(LEFT_MIN, w + dx)));
  }, []);

  if (!hydrated) return null;

  return (
    <div style={{
      height: "calc(100vh - 56px)",
      display: "flex",
      background: "#F2F0EB",
      overflow: "hidden",
      userSelect: dividerDragging ? "none" : "auto",
      cursor: dividerDragging ? "col-resize" : "auto",
    }}>
      {/* ─────────── LEFT PANEL ─────────── */}
      <div style={{
        width: leftCollapsed ? 56 : leftWidth,
        minWidth: leftCollapsed ? 56 : leftWidth,
        flexShrink: 0,
        background: "#f9fafb",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        transition: leftCollapsed
          ? "width 380ms cubic-bezier(0.4,0,0.2,1), min-width 380ms cubic-bezier(0.4,0,0.2,1)"
          : dividerDragging ? "none" : "width 380ms cubic-bezier(0.4,0,0.2,1), min-width 380ms cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Collapsed icon rail */}
        {leftCollapsed && (
          <div style={{ opacity: 1, transition: "opacity 200ms ease 200ms", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
            <CollapsedRail
              steps={WIZARD_STEPS}
              completedSteps={new Set(WIZARD_STEPS.filter(s => isComplete(s.id)).map(s => s.id))}
              onExpand={() => setLeftCollapsed(false)}
            />
          </div>
        )}

        {/* Full wizard */}
        {!leftCollapsed && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 14px 32px", opacity: 1, transition: "opacity 200ms ease" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Visa Wizard</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{completedCount} of 4 steps completed</div>
              </div>
              <button
                onClick={() => setLeftCollapsed(true)}
                title="Collapse wizard"
                style={{
                  width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e5e7eb",
                  background: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#9ca3af", transition: "all 150ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#6366f1"; e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "#eef2ff"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Progress pills */}
            <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
              {WIZARD_STEPS.map(s => (
                <div key={s.id} style={{
                  height: 5, borderRadius: 3, flex: isComplete(s.id) ? 3 : 1,
                  background: isComplete(s.id) ? "#6366f1" : openCard === s.id ? "#a5b4fc" : "#e5e7eb",
                  transition: "flex 400ms ease, background 400ms ease",
                }} />
              ))}
            </div>

            {/* Accordion cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WIZARD_STEPS.map((step, idx) => (
                <AccordionCard
                  key={step.id}
                  step={idx + 1}
                  title={step.title}
                  subtitle={step.subtitle}
                  isOpen={openCard === step.id}
                  isDone={isComplete(step.id)}
                  isLocked={isLocked(step.id)}
                  summary={collapsedSummary(step.id)}
                  onEdit={() => handleEdit(step.id)}
                  onToggle={() => handleToggle(step.id)}
                >
                  {step.id === "country" && (
                    <StepCountry
                      allCountries={allCountries}
                      selectedCountry={selection.country}
                      onSelect={(code: string, name: string) => {
                        setSelection(s => ({ ...s, country: code, countryName: name, visaType: null, visaTypeName: null, location: null }));
                        if (code) advance("visaType");
                      }}
                      compact
                    />
                  )}
                  {step.id === "visaType" && (
                    <StepVisaType
                      countryCode={selection.country}
                      selectedVisa={selection.visaType}
                      onSelect={(visa: string, name: string) => {
                        setSelection(s => ({ ...s, visaType: visa, visaTypeName: name }));
                        if (visa) advance("location");
                      }}
                      compact
                    />
                  )}
                  {step.id === "location" && (
                    <StepLocation
                      countryCode={selection.country}
                      selectedLocation={selection.location}
                      onSelect={(loc: string) => {
                        setSelection(s => ({ ...s, location: loc }));
                        if (loc) advance("details");
                      }}
                      compact
                    />
                  )}
                  {step.id === "details" && (
                    <StepDetails
                      sponsorship={selection.sponsorship}
                      profile={selection.profile}
                      onSelect={(sponsorship: string, profile: string) => {
                        setSelection(s => ({ ...s, sponsorship, profile }));
                        if (sponsorship && profile) advance(null);
                      }}
                      compact
                    />
                  )}
                </AccordionCard>
              ))}

              {/* All-done summary strip */}
              {allDone && openCard === null && (
                <div style={{
                  marginTop: 4, padding: "14px 16px",
                  background: "linear-gradient(135deg, #eef2ff 0%, #fff 100%)",
                  border: "1.5px solid #c7d2fe", borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(99,102,241,0.1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="13" height="13" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1f2937" }}>All set!</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Your checklist is live →</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      { label: "Destination", value: selection.countryName ?? "" },
                      { label: "Visa type",   value: selection.visaTypeName ?? "" },
                      { label: "From",        value: selection.location ?? "" },
                      { label: "Profile",     value: `${sponsorshipLabels[selection.sponsorship ?? ""] ?? ""} · ${profileLabels[selection.profile ?? ""] ?? ""}` },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                        <span style={{ color: "#9ca3af" }}>{item.label}</span>
                        <span style={{ color: "#374151", fontWeight: 500 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─────────── DRAGGABLE DIVIDER ─────────── */}
      {!leftCollapsed && (
        <DragDivider
          onDrag={handleDividerDrag}
          isDragging={dividerDragging}
          setIsDragging={setDividerDragging}
        />
      )}

      {/* ─────────── RIGHT PANEL ─────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#F2F0EB",
        minWidth: 0,
      }}>
        {allDone ? (
          // ── All steps done → real DocumentsContent with props (no URL nav) ──
          <DocumentsContent
            embedded
            country={selection.country ?? ""}
            countryName={selection.countryName ?? ""}
            visaType={selection.visaType ?? ""}
            visaTypeName={selection.visaTypeName ?? ""}
            location={selection.location ?? ""}
            locationName={selection.location ?? ""}
            sponsorship={selection.sponsorship ?? ""}
            profile={selection.profile ?? ""}
          />
        ) : (
          // ── In-progress → Journey Map smart panel ──
          <SmartRightPanel selection={selection} completedCount={completedCount} />
        )}
      </div>
    </div>
  );
}