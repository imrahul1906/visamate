// visamate/web/src/features/wizard/WizardAccordion.tsx

"use client"
import { useState, useRef, useEffect } from "react";
import DocumentsContent from "../documents/DocumentsContent";
import type { WizardSelections } from "@/types/wizard";
import WizardCard from "./WizardCard";

// ─── Static data ─────────────────────────────────────────────────────────────

const TRUST = [
  { color: "#4ade80", label: "Embassy-verified" },
  { color: "#a78bfa", label: "Updated May 2026" },
  { color: "#34d399", label: "Zero Server Storage" },
  { color: "#60a5fa", label: "AI-powered" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  onShowDocuments,
  onEditSelections,
}: {
  onShowDocuments: (s: WizardSelections) => void;
  onEditSelections?: () => void;
}) {
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
        <div><WizardCard onShowDocuments={onShowDocuments} onEditSelections={onEditSelections} /></div>
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

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

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

  const handleEditSelections = () => {
    setDocsVisible(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <Hero onShowDocuments={handleShowDocuments} onEditSelections={handleEditSelections} />
      {docsVisible && wizardSelections && (
        <DocumentsSection sectionRef={docsSectionRef} visible={docsVisible} selections={wizardSelections} />
      )}
    </div>
  );
}