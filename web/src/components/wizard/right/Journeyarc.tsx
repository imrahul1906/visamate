"use client";

/**
 * JourneyArc — Step 2
 * Visa type selected. Shows a live visa profile card + what this journey looks like:
 * arc steps, what the visa allows, and a nudge to set location.
 */

import React, { useState, useEffect } from "react";
import { GLOBAL_STYLES, SS, SR, COUNTRY_DATA, DEFAULT_COUNTRY, VISA_PERSONA, DEFAULT_VISA } from "./constants";
import type { Selection } from "./types";

interface Props {
  selection: Selection;
}

export default function JourneyArc({ selection }: Props) {
  const d = COUNTRY_DATA[selection.country ?? ""]  ?? DEFAULT_COUNTRY;
  const v = VISA_PERSONA[selection.visaType ?? ""] ?? DEFAULT_VISA;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [selection.visaType]);

  const arcSteps = v.journeyArc.split("→").map(s => s.trim());

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(150deg,${d.color1} 0%,${d.color2} 65%,${v.color}18 100%)`,
        padding: "26px 26px 24px", position: "relative", overflow: "hidden", flexShrink: 0,
        opacity: mounted ? 1 : 0, transition: "opacity 450ms ease",
      }}>
        <div style={{ position: "absolute", right: -15, top: -15, fontSize: 100, opacity: 0.07, userSelect: "none" }}>{d.flag}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${v.color}45,transparent)` }} />

        <div style={{ position: "relative" }}>
          <div className="chip" style={{ background: `${v.color}20`, color: v.color, border: `1px solid ${v.color}40`, marginBottom: 14, fontFamily: SS }}>
            <span>{v.icon}</span>{v.label} Visa — journey mapped
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 40, lineHeight: 1 }}>{d.flag}</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, fontFamily: SR }}>{selection.countryName}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", marginTop: 2, fontFamily: SS }}>{v.label} Visa · {v.stayDuration}</div>
            </div>
          </div>
          <div className="chip" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: SS }}>
            {v.entryNote}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 20px 36px", background: "#F8F6F1",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 500ms ease 120ms",
      }}>
        {/* Journey arc */}
        <div className="section-lbl">Your journey arc</div>
        <div className="panel-card" style={{ padding: "20px 20px", marginBottom: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 4, top: 18, bottom: 18, width: 2, background: `linear-gradient(180deg,${v.color}70,${v.color}15)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {arcSteps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, animation: `cardSlideIn 350ms ease ${i * 100}ms both` }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                    border: `2.5px solid ${i === 0 ? v.color : i === arcSteps.length - 1 ? "#22c55e" : `${v.color}50`}`,
                    background: i === 0 ? v.color : i === arcSteps.length - 1 ? "#22c55e" : "transparent",
                    zIndex: 1,
                    boxShadow: i === 0 ? `0 0 12px ${v.color}60` : "none",
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontFamily: SS }}>{step}</div>
                    {i === 0 && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontFamily: SS }}>Your journey begins here</div>}
                    {i === arcSteps.length - 1 && <div style={{ fontSize: 11, color: "#22c55e", marginTop: 2, fontFamily: SS }}>Journey complete</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What this visa allows */}
        <div className="section-lbl">What this visa allows</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { icon: "📅", label: "Max stay",          value: v.stayDuration },
            { icon: "🔄", label: "Entry type",         value: v.entryNote },
            { icon: "⏱️", label: "Typical processing", value: `${d.processingDays[0]}–${d.processingDays[1]} days` },
            { icon: "📍", label: "Apply from",         value: selection.location ?? "Your city →" },
          ].map(item => (
            <div key={item.label} className="panel-card" style={{ padding: "13px 14px" }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", lineHeight: 1.3, fontFamily: SS }}>{item.value}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, fontFamily: SS }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Next step nudge */}
        <div style={{
          background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 14,
          padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${v.color}20`, border: `1.5px solid ${v.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>📍</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: SS }}>Next: Where will you apply from?</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", marginTop: 2, fontFamily: SS }}>Your city determines the embassy & process</div>
          </div>
        </div>
      </div>
    </div>
  );
}