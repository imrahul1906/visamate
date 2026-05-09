"use client";

/**
 * JourneySpark — Step 0  (Redesigned)
 *
 * Changes from original:
 *  1. Hero layout: 2-column grid (text left, globe right) — no wasted vertical space
 *  2. Headline: product-specific copy replacing generic travel-blog headline
 *  3. Eyebrow label + serif display font for authority without pretension
 *  4. Trust row: embassy-verified · last-updated · AI-powered — costs no space, adds credibility
 *  5. Globe: smaller (130px), tucked right — still present, no longer dominant
 *  6. Destination card stats row: docs required + processing time + difficulty
 *     — turns a decorative card into a genuinely useful preview
 *  7. Fact box: white surface matching body, not dark — consistent with body section
 *  8. INSPIRE_CARDS extended: expects { flag, country, mood, docs, time, difficulty, color1, color2 }
 *     — add those fields to your constants file, or use the inline fallback below
 */

import React, { useState, useEffect, useRef } from "react";
import { GLOBAL_STYLES, SS, SR, INSPIRE_CARDS, FACTS } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InspireCard {
  flag: string;
  country: string;
  mood: string;
  color1: string;
  color2: string;
  // New fields — add to your constants; fallbacks are provided below
  docs?: string;
  time?: string;
  difficulty?: string;
}

// ─── RotatingFact ─────────────────────────────────────────────────────────────
function RotatingFact() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % FACTS.length);
        setVis(true);
      }, 280);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 16px",
      border: "1px solid #ece9e3",
      opacity: vis ? 1 : 0,
      transition: "opacity 280ms ease",
    }}>
      <div style={{
        fontSize: 9.5,
        fontWeight: 700,
        color: "#6366f1",
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        marginBottom: 7,
        fontFamily: SS,
      }}>
        Did you know
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{FACTS[idx].e}</span>
        <div style={{
          fontSize: 12,
          color: "#475569",
          lineHeight: 1.65,
          fontFamily: SS,
          fontStyle: "italic",
        }}>
          {FACTS[idx].t}
        </div>
      </div>
    </div>
  );
}

// ─── JourneySpark ─────────────────────────────────────────────────────────────
export default function JourneySpark() {
  const [activeCard, setActiveCard] = useState(0);
  const [cardVis, setCardVis]       = useState(true);
  const [orbit, setOrbit]           = useState(0);
  const rafRef = useRef<number | null>(null);
  const t0Ref  = useRef<number | null>(null);

  // Globe orbit animation
  useEffect(() => {
    const loop = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      setOrbit(((ts - t0Ref.current) / 1000) * 18);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Rotating destination cards
  useEffect(() => {
    const t = setInterval(() => {
      setCardVis(false);
      setTimeout(() => {
        setActiveCard(c => (c + 1) % INSPIRE_CARDS.length);
        setCardVis(true);
      }, 350);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const card = INSPIRE_CARDS[activeCard] as InspireCard;

  // Globe orbit dots
  const orbitDots = [0, 60, 120, 180, 240, 300].map((base, i) => {
    const a = ((base + orbit) * Math.PI) / 180;
    // Smaller globe: cx=65 cy=65 rx=56 ry=20
    return { x: 65 + 56 * Math.cos(a), y: 65 + 20 * Math.sin(a), z: Math.sin(a), i };
  });

  // Stat fallbacks for cards that don't yet have the new fields
  const cardDocs       = card.docs       ?? "—";
  const cardTime       = card.time       ?? "—";
  const cardDifficulty = card.difficulty ?? "—";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── HERO ── */}
      <div style={{
        background: "#0d1117",
        padding: "26px 24px 20px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Stars */}
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            borderRadius: "50%",
            background: "white",
            top: `${(i * 19 + 7) % 95}%`,
            left: `${(i * 27 + 11) % 97}%`,
            opacity: 0.15 + (i % 4) * 0.12,
            animation: `twinkleStar ${1.2 + (i % 5) * 0.5}s ease-in-out ${(i * 0.22) % 2.5}s infinite alternate`,
          }} />
        ))}

        {/* 2-column hero: text left, globe right */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 130px",
          gap: 16,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Left: copy */}
          <div>
            {/* Eyebrow */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 9,
            }}>
              <div style={{
                width: 20,
                height: 1.5,
                background: "#6366f1",
                borderRadius: 2,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#6366f1",
                fontFamily: SS,
              }}>
                Visa Document Intelligence
              </span>
            </div>

            {/* Headline — serif for authority */}
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              marginBottom: 7,
              // Falls back to SR (your display font) — swap to a serif if available in your project
              fontFamily: `Georgia, ${SR}, serif`,
            }}>
              Your personalised<br />
              visa checklist,<br />
              in 4 steps.
            </div>

            {/* Subheadline */}
            <div style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.7,
              fontFamily: SS,
            }}>
              Accurate requirements sourced<br />
              from official embassy data.
            </div>
          </div>

          {/* Right: compact globe */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <defs>
                <radialGradient id="jg2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="jb2" cx="38%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#2d1f5e" />
                  <stop offset="60%" stopColor="#1a1035" />
                  <stop offset="100%" stopColor="#0a0718" />
                </radialGradient>
                <clipPath id="jc2"><circle cx="65" cy="65" r="44" /></clipPath>
              </defs>

              {/* Glow ring */}
              <circle cx="65" cy="65" r="60" fill="url(#jg2)" />
              {/* Globe body */}
              <circle cx="65" cy="65" r="44" fill="url(#jb2)" />

              {/* Latitude lines */}
              {[-22, -11, 0, 11, 22].map((dy, i) => (
                <ellipse
                  key={i}
                  cx="65" cy={65 + dy}
                  rx={Math.max(0, Math.sqrt(44 ** 2 - dy ** 2))}
                  ry="4.5"
                  fill="none"
                  stroke="rgba(129,140,248,0.15)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Longitude lines */}
              {[0, 36, 72, 108, 144].map((r, i) => (
                <ellipse
                  key={i}
                  cx="65" cy="65"
                  rx="8" ry="44"
                  fill="none"
                  stroke="rgba(129,140,248,0.1)"
                  strokeWidth="0.5"
                  transform={`rotate(${r} 65 65)`}
                />
              ))}

              {/* Continents */}
              <g clipPath="url(#jc2)">
                <ellipse cx="55"  cy="57"  rx="14" ry="8"  fill="rgba(16,185,129,0.45)" />
                <ellipse cx="85"  cy="53"  rx="10" ry="7"  fill="rgba(16,185,129,0.35)" />
                <ellipse cx="67"  cy="78"  rx="16" ry="6"  fill="rgba(16,185,129,0.32)" />
                <ellipse cx="47"  cy="71"  rx="7"  ry="4"  fill="rgba(16,185,129,0.25)" />
                <ellipse cx="93"  cy="69"  rx="8"  ry="5"  fill="rgba(16,185,129,0.2)" />
              </g>

              {/* Pulse ring */}
              <circle
                cx="65" cy="65" r="50"
                fill="none"
                stroke="#6366f1"
                strokeWidth="1"
                style={{ animation: "pulseRing 3s ease-in-out infinite" }}
              />

              {/* Orbit dots */}
              {orbitDots.map(d => (
                <circle
                  key={d.i}
                  cx={d.x}
                  cy={d.y}
                  r={d.z > 0 ? 3.5 : 2}
                  fill={d.z > 0 ? "#a5b4fc" : "#312e81"}
                  opacity={0.35 + d.z * 0.55}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* ── Trust row ── */}
        <div style={{
          display: "flex",
          gap: 14,
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap" as const,
        }}>
          {[
            { label: "Embassy-verified" },
            { label: "Updated May 2025" },
            { label: "AI-powered" },
          ].map(({ label }) => (
            <div key={label} style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10.5,
              color: "rgba(255,255,255,0.42)",
              fontFamily: SS,
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#10b981",
                flexShrink: 0,
              }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 20px 36px",
        background: "#F8F6F1",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>

        {/* Destination card */}
        <div>
          <div className="section-lbl">Popular destinations</div>
          <div style={{
            background: `linear-gradient(135deg,${card.color1} 0%,${card.color2} 100%)`,
            borderRadius: 14,
            padding: "18px 20px 14px",
            opacity: cardVis ? 1 : 0,
            transition: "opacity 350ms ease",
            boxShadow: "0 6px 28px rgba(0,0,0,0.18)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Ghost flag */}
            <div style={{
              position: "absolute",
              right: -8,
              top: -8,
              fontSize: 72,
              opacity: 0.06,
              lineHeight: 1,
              userSelect: "none",
            }}>
              {card.flag}
            </div>

            {/* Flag + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                flexShrink: 0,
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
                {card.flag}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", fontFamily: SR }}>
                  {card.country}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.48)", marginTop: 2, fontFamily: SS }}>
                  {card.mood}
                </div>
              </div>
            </div>

            {/* ── Stat row (new) ── */}
            <div style={{
              display: "flex",
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              {[
                { val: cardDocs,       lbl: "Required" },
                { val: cardTime,       lbl: "Processing" },
                { val: cardDifficulty, lbl: "Difficulty" },
              ].map((s, i, arr) => (
                <React.Fragment key={s.lbl}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: SR }}>
                      {s.val}
                    </div>
                    <div style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.32)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.09em",
                      marginTop: 2,
                      fontFamily: SS,
                    }}>
                      {s.lbl}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 1, background: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: "center" }}>
              {INSPIRE_CARDS.map((_, i) => (
                <div key={i} style={{
                  height: 3.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.7)",
                  width: i === activeCard ? 16 : 4,
                  opacity: i === activeCard ? 1 : 0.3,
                  transition: "all 350ms ease",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <div className="section-lbl">How it works</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { n: "01", t: "Pick your destination",  s: "We load visa insights for your country" },
              { n: "02", t: "Choose your visa type",   s: "Tourist, work, student & more" },
              { n: "03", t: "Set your location",       s: "Your city determines the embassy & process" },
              { n: "04", t: "Tell us your profile",    s: "Sponsorship & employment status" },
            ].map((item, i) => (
              <div key={i} className="panel-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
                <div style={{
                  fontFamily: SR,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6366f1",
                  minWidth: 22,
                  letterSpacing: "0.05em",
                }}>
                  {item.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", fontFamily: SS }}>{item.t}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1, fontFamily: SS }}>{item.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fact */}
        <RotatingFact />
      </div>
    </div>
  );
}