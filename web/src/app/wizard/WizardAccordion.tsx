"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepCountry from "../../components/wizard/steps/StepCountry";
import StepVisaType from "../../components/wizard/steps/StepVisaType";
import StepLocation from "../../components/wizard/steps/StepLocation";
import StepDetails from "../../components/wizard/steps/StepDetails";

// ─────────────────────────────────────────────────────────────
// Animated collapsible body
// ─────────────────────────────────────────────────────────────
function AnimatedBody({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (!innerRef.current) return;
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (innerRef.current) setMaxH(innerRef.current.scrollHeight);
        });
      });
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
          transform: isOpen ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 320ms ease 60ms, transform 320ms ease 60ms",
        }}
      >
        {visible && children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Selection {
  country: string | null;
  countryName: string | null;
  visaType: string | null;
  visaTypeName: string | null;
  location: string | null;
  sponsorship: string | null;
  profile: string | null;
}

// ─────────────────────────────────────────────────────────────
// Summary chip
// ─────────────────────────────────────────────────────────────
function SummaryChip({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-gray-400 leading-none mb-0.5 uppercase tracking-wide">{label}</div>
        <div className="text-sm font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Accordion card
// ─────────────────────────────────────────────────────────────
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
      borderRadius: 14,
      border: isOpen ? "1.5px solid #c7d2fe" : "1.5px solid #e5e7eb",
      boxShadow: isOpen ? "0 4px 24px rgba(99,102,241,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
      background: isLocked ? "#fafafa" : "#fff",
      opacity: isLocked ? 0.5 : 1,
      transition: "box-shadow 350ms ease, border-color 350ms ease, opacity 350ms ease",
      overflow: "hidden",
    }}>
      {/* Entire header is the click target */}
      <div
        onClick={() => { if (!isLocked) onToggle?.(); }}
        style={{
          padding: "15px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 58,
          cursor: isLocked ? "default" : "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600,
            background: isDone ? "#22c55e" : isOpen ? "#6366f1" : "#e5e7eb",
            color: isDone || isOpen ? "#fff" : "#9ca3af",
            transition: "background 350ms ease",
          }}>
            {isDone ? (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : step}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.3, minHeight: 16 }}>
              {isDone && !isOpen && summary
                ? <span style={{ color: "#6366f1", fontWeight: 500 }}>{summary}</span>
                : !isDone && !isOpen
                  ? <span style={{ color: "#9ca3af" }}>{subtitle}</span>
                  : <span style={{ color: "transparent", userSelect: "none" }}>·</span>
              }
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
          {isDone && !isOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="text-xs font-semibold text-indigo-500 px-2.5 py-1 rounded-lg border-none bg-transparent cursor-pointer hover:bg-indigo-50 transition-colors duration-150"
            >
              Edit
            </button>
          )}
          {/* Chevron — visual only, click is handled by the header div */}
          <div
            style={{
              padding: 4,
              color: isOpen ? "#6366f1" : "#d1d5db",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, transition: "color 350ms ease",
            }}
            aria-hidden="true"
          >
            <svg
              width="16" height="16" fill="none" stroke="currentColor"
              strokeWidth={2} viewBox="0 0 24 24"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 380ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      <AnimatedBody isOpen={isOpen}>
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "20px 18px 24px" }}>
          {children}
        </div>
      </AnimatedBody>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Label maps (shared by SummaryCard + collapsedSummary)
// ─────────────────────────────────────────────────────────────
const sponsorshipLabels: Record<string, string> = {
  self: "Self-Sponsored",
  sponsored: "Sponsored",
};
const profileLabels: Record<string, string> = {
  employed: "Employed",
  student: "Student",
  "self-employed": "Self-Employed",
};

// ─────────────────────────────────────────────────────────────
// Summary card — original animated entry after step 4
// ─────────────────────────────────────────────────────────────
function SummaryCard({
  selection,
  onShowDocuments,
}: {
  selection: Selection;
  onShowDocuments: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      borderRadius: 14,
      border: "1.5px solid #c7d2fe",
      background: "linear-gradient(140deg,#eef2ff 0%,#fff 65%)",
      boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
      overflow: "hidden",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 480ms ease, transform 480ms cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 20px 16px",
        borderBottom: "1px solid #e0e7ff",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)", flexShrink: 0,
        }}>
          <svg width="15" height="15" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>All set! Here's your summary</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            Ready to see your personalised document checklist
          </div>
        </div>
      </div>

      {/* Chips grid */}
      <div style={{
        padding: "16px 20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 10,
      }}>
        <SummaryChip
          label="Destination"
          value={selection.countryName ?? "—"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          }
        />
        <SummaryChip
          label="Visa Type"
          value={selection.visaTypeName ?? "—"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          }
        />
        <SummaryChip
          label="Applying From"
          value={selection.location ?? "—"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
          }
        />
        <SummaryChip
          label="Sponsorship"
          value={sponsorshipLabels[selection.sponsorship ?? ""] ?? "—"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <SummaryChip
          label="Profile"
          value={profileLabels[selection.profile ?? ""] ?? "—"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          }
        />
      </div>

      {/* CTA */}
      <div style={{ padding: "4px 20px 20px" }}>
        <button
          onClick={onShowDocuments}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 0",
            fontSize: 14, fontWeight: 600, color: "#fff",
            background: "linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            border: "none", borderRadius: 12, cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.45)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)";
          }}
        >
          See My Required Documents
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
type CardId = "country" | "visaType" | "location" | "details";

const STEPS: { id: CardId; title: string; subtitle: string }[] = [
  { id: "country",  title: "Select Destination Country",  subtitle: "Where are you planning to go?" },
  { id: "visaType", title: "Select Visa Type",            subtitle: "What type of visa do you need?" },
  { id: "location", title: "Where will you apply from?",  subtitle: "Select the city where you'll submit your application" },
  { id: "details",  title: "Tell us about your trip",     subtitle: "A few more details to personalise your checklist" },
];

export default function WizardAccordion() {
  const router = useRouter();
  const [openCard, setOpenCard] = useState<CardId | null>("country");
  const [selection, setSelection] = useState<Selection>({
    country: null, countryName: null,
    visaType: null, visaTypeName: null,
    location: null, sponsorship: null, profile: null,
  });

  const isComplete = (id: CardId): boolean => {
    if (id === "country")  return !!selection.country;
    if (id === "visaType") return !!selection.visaType;
    if (id === "location") return !!selection.location;
    if (id === "details")  return !!selection.sponsorship && !!selection.profile;
    return false;
  };

  const isLocked = (id: CardId): boolean => {
    const order: CardId[] = ["country", "visaType", "location", "details"];
    const i = order.indexOf(id);
    return i > 0 && !isComplete(order[i - 1]);
  };

  const allDone = STEPS.every((s) => isComplete(s.id));

  const collapsedSummary = (id: CardId): string => {
    if (id === "country"  && selection.countryName)  return selection.countryName;
    if (id === "visaType" && selection.visaTypeName)  return selection.visaTypeName;
    if (id === "location" && selection.location)      return selection.location;
    if (id === "details"  && selection.sponsorship)
      return `${sponsorshipLabels[selection.sponsorship] ?? selection.sponsorship} · ${profileLabels[selection.profile ?? ""] ?? selection.profile ?? ""}`;
    return "";
  };

  // Track whether the user opened a card via "Edit" while all steps were already done.
  // Completing that card should jump straight to summary, not chain through subsequent cards.
  const isEditingRef = useRef(false);

  const handleToggle = (id: CardId) => {
    if (isLocked(id)) return;
    // If the wizard is already complete, expanding a card via header click is an "edit"
    // — completing it should return to summary, not chain through already-filled cards.
    const willOpen = openCard !== id;
    isEditingRef.current = willOpen && allDone;
    setOpenCard((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id: CardId) => {
    if (!isLocked(id)) {
      isEditingRef.current = allDone;
      setOpenCard(id);
    }
  };

  const advance = (next: CardId | null) => {
    if (isEditingRef.current) {
      // Was editing a completed step → skip straight back to summary
      isEditingRef.current = false;
      setTimeout(() => setOpenCard(null), 300);
    } else {
      setTimeout(() => setOpenCard(next), 300);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", paddingTop: 64, paddingBottom: 80 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 16px 0" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
            Find Your Required Documents
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            Answer a few quick questions to get your personalised document checklist
          </p>
        </div>

        {/* Progress pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>
          {STEPS.map((s) => (
            <div key={s.id} style={{
              height: 6, borderRadius: 3,
              width: isComplete(s.id) ? 28 : 8,
              background: isComplete(s.id) ? "#6366f1" : openCard === s.id ? "#a5b4fc" : "#e5e7eb",
              transition: "width 400ms ease, background 400ms ease",
            }} />
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS.map((step, idx) => (
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
                  selectedCountry={selection.country}
                  onSelect={(code, name) => {
                    setSelection((s) => ({
                      ...s, country: code, countryName: name,
                      visaType: null, visaTypeName: null, location: null,
                    }));
                    if (code) advance("visaType");
                  }}
                  compact
                />
              )}
              {step.id === "visaType" && (
                <StepVisaType
                  countryCode={selection.country}
                  selectedVisa={selection.visaType}
                  onSelect={(visa, name) => {
                    setSelection((s) => ({ ...s, visaType: visa, visaTypeName: name }));
                    if (visa) advance("location");
                  }}
                  compact
                />
              )}
              {step.id === "location" && (
                <StepLocation
                  countryCode={selection.country}
                  selectedLocation={selection.location}
                  onSelect={(loc) => {
                    setSelection((s) => ({ ...s, location: loc }));
                    if (loc) advance("details");
                  }}
                  compact
                />
              )}
              {step.id === "details" && (
                <StepDetails
                  sponsorship={selection.sponsorship}
                  profile={selection.profile}
                  onSelect={(sponsorship, profile) => {
                    setSelection((s) => ({ ...s, sponsorship, profile }));
                    if (sponsorship && profile) advance(null);
                  }}
                  compact
                />
              )}
            </AccordionCard>
          ))}

          {/* Summary card — appears when all 4 done and no card is open */}
          {allDone && openCard === null && (
            <SummaryCard
              selection={selection}
              onShowDocuments={() => {
                const params = new URLSearchParams({
                  country:     selection.country     ?? "",
                  visaType:    selection.visaType     ?? "",
                  location:    selection.location     ?? "",
                  sponsorship: selection.sponsorship  ?? "",
                  profile:     selection.profile      ?? "",
                });
                router.push(`/documents?${params.toString()}`);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
