"use client";

/**
 * ApplicationTimeline — Step 3
 * "If you start today, here is your exact road to a visa decision."
 * Personalised milestone timeline based on country processing days.
 */

import React, { useState, useEffect } from "react";
import { GLOBAL_STYLES, SS, SR, COUNTRY_DATA, DEFAULT_COUNTRY, VISA_PERSONA, DEFAULT_VISA } from "./constants";
import type { Selection } from "./types";

interface Props {
  selection: Selection;
  completedCount: number;
}

export default function ApplicationTimeline({ selection }: Props) {
  const d = COUNTRY_DATA[selection.country ?? ""]  ?? DEFAULT_COUNTRY;
  const v = VISA_PERSONA[selection.visaType ?? ""] ?? DEFAULT_VISA;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Build timeline from today
  const today   = new Date();
  const addDays = (base: Date, n: number) => { const r = new Date(base); r.setDate(r.getDate() + n); return r; };
  const fmt     = (dt: Date) => dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const t1 = today;
  const t2 = addDays(today, 7);
  const t3 = addDays(today, 14);
  const t4 = addDays(today, 14 + d.processingDays[0]);
  const t5 = addDays(today, 14 + d.processingDays[1]);

  const milestones = [
    { date: t1, label: "Start today",        sub: "Begin collecting your documents",           icon: "🚀", color: v.color,    isToday: true  },
    { date: t2, label: "Documents ready",    sub: "All paperwork collected & organised",        icon: "📁", color: "#f59e0b",  isToday: false },
    { date: t3, label: "Submit application", sub: "Hand in at embassy or VFS centre",           icon: "📬", color: "#6366f1",  isToday: false },
    { date: t4, label: "Processing begins",  sub: `Earliest decision from ${fmt(t4)}`,          icon: "⚙️", color: "#0ea5e9",  isToday: false },
    { date: t5, label: "Decision expected",  sub: "Most applications decided by this date",     icon: "✅", color: "#22c55e",  isToday: false },
  ];

  const totalDays = 14 + d.processingDays[1];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(150deg,${d.color1} 0%,${d.color2} 100%)`,
        padding: "26px 26px 24px", position: "relative", overflow: "hidden", flexShrink: 0,
        opacity: mounted ? 1 : 0, transition: "opacity 450ms ease",
      }}>
        <div style={{ position: "absolute", right: -15, top: -15, fontSize: 90, opacity: 0.07, userSelect: "none" }}>{d.flag}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${d.accentColor}50,transparent)` }} />

        <div style={{ position: "relative" }}>
          <div className="chip" style={{ background: `${d.accentColor}20`, color: d.accentColor, border: `1px solid ${d.accentColor}40`, marginBottom: 14, fontFamily: SS }}>
            📅 Your application road map
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 34 }}>{d.flag}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", fontFamily: SR }}>
                {selection.countryName} · {v.label} Visa
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, fontFamily: SS }}>
                Applying from {selection.location ?? "your city"}
              </div>
            </div>
          </div>

          {/* Summary banner */}
          <div style={{
            background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "11px 14px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", fontFamily: SS, marginBottom: 2 }}>Start now → Decision by</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: SS }}>
                <span style={{ color: d.accentColor }}>{fmt(t5)}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: d.accentColor, fontFamily: SS, letterSpacing: "-0.03em", lineHeight: 1 }}>~{totalDays}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: SS }}>days total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 20px 36px", background: "#F8F6F1",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 500ms ease 120ms",
      }}>
        <div className="section-lbl">Your step-by-step timeline</div>
        <div className="panel-card" style={{ padding: "20px 20px", marginBottom: 16 }}>
          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute", left: 19, top: 22, bottom: 22, width: 2,
              background: "linear-gradient(180deg,#6366f1 0%,#10b981 100%)", opacity: 0.18,
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, paddingBottom: i < milestones.length - 1 ? 20 : 0,
                  animation: `cardSlideIn 350ms ease ${i * 80}ms both`,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? m.color : `${m.color}14`,
                    border: `2px solid ${m.color}${i === 0 ? "" : "40"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, zIndex: 1,
                    boxShadow: i === 0 ? `0 4px 16px ${m.color}40` : "none",
                  }}>{m.icon}</div>
                  <div style={{ flex: 1, paddingTop: 5 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", fontFamily: SS }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1.5, fontFamily: SS }}>{m.sub}</div>
                    <div style={{ marginTop: 5, fontSize: 11, color: m.color, fontWeight: 600, fontFamily: SS }}>
                      {m.isToday ? "Today" : fmt(m.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro tip */}
        <div style={{
          background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 14,
          padding: "16px 18px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚡</span>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 4, fontFamily: SS }}>Pro tip</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.65, fontFamily: SS }}>
              Book your embassy or VFS appointment as soon as your documents are ready — slots fill up fast, especially during peak travel seasons.
            </div>
          </div>
        </div>

        {/* Last step nudge */}
        <div className="panel-card" style={{
          padding: "15px 18px", border: `1.5px solid ${d.accentColor}35`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            background: `${d.accentColor}15`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 17,
          }}>👤</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", fontFamily: SS }}>One last step</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: SS }}>
              Tell us your profile → unlock your personalised document checklist
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}