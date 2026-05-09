"use client";

/**
 * DestinationRevealed — Step 1
 * Country selected. Shows atmospheric portrait of the destination —
 * NO fees, NO doc counts. Just vibes + quick facts + nudge to pick visa type.
 */

import React, { useState, useEffect } from "react";
import { GLOBAL_STYLES, SS, SR, COUNTRY_DATA, DEFAULT_COUNTRY } from "./constants";
import type { Selection } from "./types";

interface Props {
  selection: Selection;
}

export default function DestinationRevealed({ selection }: Props) {
  const d = COUNTRY_DATA[selection.country ?? ""] ?? DEFAULT_COUNTRY;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [selection.country]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Dark cinematic hero */}
      <div style={{
        background: `linear-gradient(150deg,${d.color1} 0%,${d.color2} 100%)`,
        padding: "30px 26px 26px", position: "relative", overflow: "hidden", flexShrink: 0,
        opacity: mounted ? 1 : 0, transition: "opacity 500ms ease",
      }}>
        {/* Large ghost flag */}
        <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.07, lineHeight: 1, userSelect: "none", filter: "blur(1px)" }}>{d.flag}</div>
        {/* Accent line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${d.accentColor}55,transparent)` }} />

        <div style={{ position: "relative" }}>
          {/* Live badge */}
          <div className="chip" style={{ background: `${d.accentColor}20`, color: d.accentColor, border: `1px solid ${d.accentColor}40`, marginBottom: 14, fontFamily: SS }}>
            <svg width="7" height="7" viewBox="0 0 7 7">
              <circle cx="3.5" cy="3.5" r="3.5" fill={d.accentColor} style={{ animation: "dotPulse 2s ease-in-out infinite" }} />
            </svg>
            Destination selected
          </div>

          <div style={{ fontSize: 52, marginBottom: 10, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{d.flag}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 7, fontFamily: SR }}>
            {selection.countryName}
          </div>
          <div style={{ fontSize: 13, color: `${d.accentColor}cc`, fontStyle: "italic", fontFamily: SR, lineHeight: 1.3 }}>
            "{d.tagline}"
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 20px 36px", background: "#F8F6F1",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 500ms ease 120ms",
      }}>
        {/* Atmospheric quote */}
        <div className="panel-card" style={{ padding: "18px 20px", marginBottom: 16, borderLeft: `3px solid ${d.accentColor}` }}>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, fontStyle: "italic", fontFamily: SR }}>
            {d.atmosphere}
          </div>
        </div>

        {/* Quick facts grid */}
        <div className="section-lbl">Quick facts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { icon: "🗓️", label: "Best time to visit", value: d.season },
            { icon: "💱", label: "Currency",            value: d.currency },
            { icon: "🗣️", label: "Language",            value: d.language },
            { icon: "📌", label: "Good to know",        value: d.highlight },
          ].map(item => (
            <div key={item.label} className="panel-card" style={{ padding: "14px 14px" }}>
              <div style={{ fontSize: 18, marginBottom: 7 }}>{item.icon}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", lineHeight: 1.4, fontFamily: SS }}>{item.value}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, fontFamily: SS }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Next step nudge */}
        <div style={{
          background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 14,
          padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${d.accentColor}20`, border: `1.5px solid ${d.accentColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>📄</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: SS }}>Next: Select your visa type</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", marginTop: 2, fontFamily: SS }}>
              Tourist, work, student & more — each has its own requirements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}