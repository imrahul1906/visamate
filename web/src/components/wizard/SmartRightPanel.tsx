"use client";

/**
 * SmartRightPanel — "Your Journey, Building Live"
 * ================================================
 * Right panel that tells a COHERENT STORY as the user fills the wizard.
 *
 * Step 0 → Animated globe + destination inspiration (kept & refined)
 * Step 1 → "Destination Revealed" — atmospheric country portrait, NO fees, NO docs
 * Step 2 → "Journey Arc" — live visa profile card + what this journey looks like
 * Step 3 → "Application Timeline" — personalised: if you apply today, here's when
 * All done → Real DocumentsContent (handled in WizardAccordion)
 */

import React, { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Selection {
  country: string | null;
  countryName: string | null;
  visaType: string | null;
  visaTypeName: string | null;
  location: string | null;
  sponsorship: string | null;
  profile: string | null;
}

// ─── Country atmosphere data — NO fees, NO doc counts ────────────────────────
const COUNTRY_DATA: Record<string, {
  flag: string; tagline: string; atmosphere: string; highlight: string;
  season: string; currency: string; language: string;
  processingDays: [number, number];
  color1: string; color2: string; accentColor: string;
}> = {
  us: { flag:"🇺🇸", tagline:"Land of Infinite Possibility",
    atmosphere:"From the neon pulse of New York to the golden light of California — a continent of contrasts awaiting exploration.",
    highlight:"One of the world's most visited destinations", season:"Year-round, peak Jun–Aug",
    currency:"US Dollar (USD)", language:"English", processingDays:[3,60],
    color1:"#0a1628", color2:"#1a2f5c", accentColor:"#3b82f6" },
  gb: { flag:"🇬🇧", tagline:"Where History Meets the Future",
    atmosphere:"Ancient castles and cutting-edge culture share the same cobblestones. London buzzes; the countryside breathes.",
    highlight:"Home to some of the world's greatest museums", season:"May–Sep for mild weather",
    currency:"Pound Sterling (GBP)", language:"English", processingDays:[3,15],
    color1:"#0d1b2a", color2:"#1a3352", accentColor:"#ef4444" },
  de: { flag:"🇩🇪", tagline:"Precision, Culture & Open Roads",
    atmosphere:"Bavarian castles rise above misty forests. Berlin reinvents itself nightly. The Rhine Valley flows eternal.",
    highlight:"Schengen gateway to 26 European countries", season:"Apr–Oct for best weather",
    currency:"Euro (EUR)", language:"German", processingDays:[42,84],
    color1:"#111111", color2:"#1c1c1c", accentColor:"#f59e0b" },
  fr: { flag:"🇫🇷", tagline:"Art de Vivre, Elevated",
    atmosphere:"Paris for the soul; Provence for the senses. France doesn't just welcome visitors — it transforms them.",
    highlight:"World's most visited country for a reason", season:"Apr–Jun, Sep–Oct ideal",
    currency:"Euro (EUR)", language:"French", processingDays:[10,45],
    color1:"#0d1b35", color2:"#1a2d5a", accentColor:"#3b82f6" },
  ca: { flag:"🇨🇦", tagline:"Wilderness Without Limits",
    atmosphere:"Where the Rocky Mountains meet multicultural cities. Canada is vast, welcoming, and utterly spectacular.",
    highlight:"Second largest country by area on Earth", season:"Jun–Aug for warmth, Dec–Feb snow",
    currency:"Canadian Dollar (CAD)", language:"English & French", processingDays:[2,84],
    color1:"#0f1e0f", color2:"#1a3020", accentColor:"#ef4444" },
  au: { flag:"🇦🇺", tagline:"Edge of the Known World",
    atmosphere:"Ochre deserts, electric reefs, and Sydney's sun-soaked harbour. Australia is nature's greatest showroom.",
    highlight:"Home to extraordinary unique wildlife", season:"Sep–Nov, Mar–May (avoid summer heat)",
    currency:"Australian Dollar (AUD)", language:"English", processingDays:[20,35],
    color1:"#1a0f05", color2:"#2d1a0a", accentColor:"#f59e0b" },
  jp: { flag:"🇯🇵", tagline:"Ancient Soul, Future City",
    atmosphere:"Cherry blossoms over temples. Ramen steam rising at midnight. Bullet trains threading mountain valleys.",
    highlight:"Consistently ranked world's safest travel destination", season:"Mar–May (sakura), Oct–Nov (koyo)",
    currency:"Japanese Yen (JPY)", language:"Japanese", processingDays:[5,10],
    color1:"#1a0808", color2:"#2d1010", accentColor:"#ec4899" },
  ae: { flag:"🇦🇪", tagline:"Where Ambition Lives",
    atmosphere:"Gold-tipped skyscrapers rise from ancient desert. The UAE fuses Bedouin tradition with sci-fi futures.",
    highlight:"Dubai is the world's most popular city to visit", season:"Nov–Mar (before the heat)",
    currency:"UAE Dirham (AED)", language:"Arabic (English widely spoken)", processingDays:[3,5],
    color1:"#0d1a12", color2:"#1a2d1f", accentColor:"#10b981" },
  sg: { flag:"🇸🇬", tagline:"The City That Works",
    atmosphere:"A seamless blend of Chinese, Malay, Indian and global cultures — a city-state of extraordinary order and flavour.",
    highlight:"Most connected airport hub in Asia", season:"Year-round (tropical climate)",
    currency:"Singapore Dollar (SGD)", language:"English, Mandarin, Malay, Tamil", processingDays:[3,5],
    color1:"#0a1520", color2:"#0f2030", accentColor:"#0ea5e9" },
  nl: { flag:"🇳🇱", tagline:"Cycling Through Masterpieces",
    atmosphere:"Tulip fields flanking canal houses. Van Gogh and Rembrandt born here. A tiny country with an outsized soul.",
    highlight:"Schengen gateway with one of Europe's most open cultures", season:"Apr–May (tulips), Jul–Aug",
    currency:"Euro (EUR)", language:"Dutch (English near-universal)", processingDays:[15,30],
    color1:"#0d1a2d", color2:"#1a2d4a", accentColor:"#f59e0b" },
};

const DEFAULT_COUNTRY = {
  flag:"🌍", tagline:"Your Next Chapter Awaits",
  atmosphere:"Every destination has a story waiting to be written. You're about to start yours.",
  highlight:"Applying well in advance dramatically improves approval odds",
  season:"Varies by destination", currency:"Check locally", language:"Check locally",
  processingDays:[7,30] as [number,number],
  color1:"#0d1525", color2:"#1a2540", accentColor:"#6366f1",
};

// ─── Visa persona data ───────────────────────────────────────────────────────
const VISA_PERSONA: Record<string, {
  icon: string; label: string; stayDuration: string;
  journeyArc: string; color: string; entryNote: string;
}> = {
  tourist:  { icon:"✈️",  label:"Tourist",  stayDuration:"Up to 90 days",        journeyArc:"Explore → Discover → Absorb → Return", color:"#0ea5e9", entryNote:"Single or multiple entry" },
  student:  { icon:"🎓",  label:"Student",  stayDuration:"Duration of course",    journeyArc:"Arrive → Study → Graduate → Explore options", color:"#8b5cf6", entryNote:"Long-stay with renewals" },
  work:     { icon:"💼",  label:"Work",     stayDuration:"Duration of contract",  journeyArc:"Arrive → Work → Establish → Extend",   color:"#10b981", entryNote:"Employer-tied, renewable" },
  business: { icon:"🏢",  label:"Business", stayDuration:"Up to 30–90 days",      journeyArc:"Meet → Negotiate → Conclude → Return",  color:"#f59e0b", entryNote:"Multiple entry standard" },
};

const DEFAULT_VISA = { icon:"📄", label:"Visa", stayDuration:"Varies", journeyArc:"Apply → Travel → Enjoy → Return", color:"#6366f1", entryNote:"Entry conditions apply" };

// ─── Inspiration cards ────────────────────────────────────────────────────────
const INSPIRE_CARDS = [
  { flag:"🇯🇵", country:"Japan",          mood:"Cherry blossoms · Ramen lanes · Zen",         color1:"#1a0808", color2:"#3d1515" },
  { flag:"🇮🇹", country:"Italy",          mood:"Renaissance art · Coastal cliffs · Espresso", color1:"#1a0f05", color2:"#3d2010" },
  { flag:"🇨🇦", country:"Canada",         mood:"Northern lights · Maple forests · Hockey",    color1:"#0f1e0f", color2:"#1a3020" },
  { flag:"🇬🇧", country:"United Kingdom", mood:"Big Ben · Rolling moors · Afternoon tea",     color1:"#0d1b2a", color2:"#1a3050" },
  { flag:"🇦🇺", country:"Australia",      mood:"Great Barrier Reef · Uluru · Surf",           color1:"#1a0f05", color2:"#2d1a0a" },
  { flag:"🇩🇪", country:"Germany",        mood:"Baroque castles · Craft beer · Black Forest",  color1:"#111111", color2:"#2a2a2a" },
];

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes panelFadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes twinkleStar   { from { opacity:0.1 } to { opacity:0.8 } }
  @keyframes pulseRing     { 0%,100% { opacity:0.15; transform:scale(1) } 50% { opacity:0.45; transform:scale(1.04) } }
  @keyframes cardSlideIn   { from { opacity:0; transform:translateX(-10px) } to { opacity:1; transform:translateX(0) } }
  @keyframes dotPulse      { 0%,100% { transform:scale(1) } 50% { transform:scale(1.3) } }
  .panel-card  { background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
  .chip        { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.01em; }
  .section-lbl { font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; margin-bottom:10px; font-family:system-ui,sans-serif; }
`;

const SS = "system-ui, -apple-system, sans-serif";
const SR = "'Georgia', 'Times New Roman', serif";

// ─────────────────────────────────────────────────────────────────────────────
// Rotating "did you know" facts
// ─────────────────────────────────────────────────────────────────────────────
const FACTS = [
  { e:"📅", t:"Applying 8–12 weeks early is the safest window for most international visas." },
  { e:"📋", t:"Most rejections happen due to incomplete documents — not the applicant's profile." },
  { e:"🔒", t:"Showing strong home-country ties significantly boosts tourist visa approval odds." },
  { e:"🌐", t:"One Schengen visa unlocks 27 European countries — one application, endless travel." },
  { e:"🏦", t:"Bank statements are the single most scrutinised financial document in any application." },
];

function RotatingFact() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => { setVis(false); setTimeout(() => { setIdx(i => (i+1) % FACTS.length); setVis(true); }, 280); }, 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius:14, padding:"16px 18px",
      opacity:vis?1:0, transition:"opacity 280ms ease", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
      <div style={{ fontSize:10, fontWeight:700, color:"rgba(165,180,252,0.7)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8, fontFamily:SS }}>Did you know</div>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>{FACTS[idx].e}</span>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.8)", lineHeight:1.65, fontFamily:SR, fontStyle:"italic" }}>{FACTS[idx].t}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0: Journey Spark
// ─────────────────────────────────────────────────────────────────────────────
function JourneySpark() {
  const [activeCard, setActiveCard] = useState(0);
  const [cardVis, setCardVis] = useState(true);
  const [orbit, setOrbit] = useState(0);
  const rafRef = useRef<number|null>(null);
  const t0Ref  = useRef<number|null>(null);

  useEffect(() => {
    const loop = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      setOrbit(((ts - t0Ref.current) / 1000) * 18);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCardVis(false);
      setTimeout(() => { setActiveCard(c => (c+1) % INSPIRE_CARDS.length); setCardVis(true); }, 350);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const card = INSPIRE_CARDS[activeCard];

  const orbitDots = [0,60,120,180,240,300].map((base, i) => {
    const a = ((base + orbit) * Math.PI) / 180;
    return { x: 90 + 70*Math.cos(a), y: 90 + 26*Math.sin(a), z: Math.sin(a), i };
  });

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Dark hero */}
      <div style={{ background:"linear-gradient(160deg,#0a0e1a 0%,#111827 50%,#0d1520 100%)",
        padding:"32px 28px 28px", position:"relative", overflow:"hidden", flexShrink:0 }}>
        {[...Array(28)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:i%4===0?2:1, height:i%4===0?2:1, borderRadius:"50%",
            background:"white", top:`${(i*19+7)%95}%`, left:`${(i*27+11)%97}%`,
            animation:`twinkleStar ${1.2+(i%5)*0.5}s ease-in-out ${(i*0.22)%2.5}s infinite alternate` }} />
        ))}
        {/* Globe */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:22, position:"relative", zIndex:1 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <radialGradient id="jg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="jb" cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#3730a3" />
                <stop offset="55%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0d0b2a" />
              </radialGradient>
              <clipPath id="jc"><circle cx="90" cy="90" r="56" /></clipPath>
            </defs>
            <circle cx="90" cy="90" r="80" fill="url(#jg)" />
            <circle cx="90" cy="90" r="56" fill="url(#jb)" />
            {[-28,-14,0,14,28].map((dy,i) => (
              <ellipse key={i} cx="90" cy={90+dy} rx={Math.max(0,Math.sqrt(56**2-dy**2))} ry="5.5"
                fill="none" stroke="rgba(129,140,248,0.18)" strokeWidth="0.6" />
            ))}
            {[0,36,72,108,144].map((r,i) => (
              <ellipse key={i} cx="90" cy="90" rx="10" ry="56"
                fill="none" stroke="rgba(129,140,248,0.12)" strokeWidth="0.6"
                transform={`rotate(${r} 90 90)`} />
            ))}
            <g clipPath="url(#jc)">
              <ellipse cx="72"  cy="78"  rx="17" ry="10" fill="rgba(16,185,129,0.5)" />
              <ellipse cx="115" cy="72"  rx="12" ry="9"  fill="rgba(16,185,129,0.4)" />
              <ellipse cx="93"  cy="106" rx="20" ry="7"  fill="rgba(16,185,129,0.38)" />
              <ellipse cx="68"  cy="98"  rx="8"  ry="5"  fill="rgba(16,185,129,0.3)" />
              <ellipse cx="130" cy="95"  rx="10" ry="6"  fill="rgba(16,185,129,0.25)" />
              <ellipse cx="72"  cy="68"  rx="24" ry="14" fill="rgba(255,255,255,0.05)" />
            </g>
            <circle cx="90" cy="90" r="63" fill="none" stroke="#6366f1" strokeWidth="1.2" style={{ animation:"pulseRing 3s ease-in-out infinite" }} />
            <circle cx="90" cy="90" r="73" fill="none" stroke="#818cf8" strokeWidth="0.5" style={{ animation:"pulseRing 3s ease-in-out infinite 1.5s" }} />
            {orbitDots.map(d => (
              <circle key={d.i} cx={d.x} cy={d.y} r={d.z>0?4:2.5}
                fill={d.z>0?"#a5b4fc":"#312e81"} opacity={0.4+d.z*0.55} />
            ))}
          </svg>
        </div>
        <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:21, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:7, fontFamily:SR }}>
            Where will you go?
          </div>
          <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.42)", lineHeight:1.65, fontFamily:SS }}>
            Answer 4 questions to unlock your<br />personalised visa document checklist
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 36px", background:"#F8F6F1", display:"flex", flexDirection:"column", gap:18 }}>

        {/* Rotating card */}
        <div>
          <div className="section-lbl">Travellers are heading to</div>
          <div style={{
            background:`linear-gradient(135deg,${card.color1} 0%,${card.color2} 100%)`,
            borderRadius:16, padding:"20px 22px",
            opacity:cardVis?1:0, transition:"opacity 350ms ease",
            boxShadow:"0 8px 32px rgba(0,0,0,0.2)", position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", right:-10, top:-10, fontSize:80, opacity:0.09, lineHeight:1, userSelect:"none" }}>{card.flag}</div>
            <div style={{ display:"flex", alignItems:"center", gap:14, position:"relative" }}>
              <div style={{ width:52, height:52, borderRadius:14, flexShrink:0, background:"rgba(255,255,255,0.1)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
                border:"1px solid rgba(255,255,255,0.15)" }}>{card.flag}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", fontFamily:SR }}>{card.country}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.48)", marginTop:3, fontFamily:SS }}>{card.mood}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5, marginTop:16, justifyContent:"center" }}>
              {INSPIRE_CARDS.map((_,i) => (
                <div key={i} style={{ height:4, borderRadius:3, background:"rgba(255,255,255,0.7)",
                  width:i===activeCard?18:5, opacity:i===activeCard?1:0.3, transition:"all 350ms ease" }} />
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <div className="section-lbl">How it works</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { n:"01", t:"Pick your destination",   s:"We load visa insights for your country" },
              { n:"02", t:"Choose your visa type",    s:"Tourist, work, student & more" },
              { n:"03", t:"Set your location",        s:"Your city determines the embassy & process" },
              { n:"04", t:"Tell us your profile",     s:"Sponsorship & employment status" },
            ].map((item,i) => (
              <div key={i} className="panel-card" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px" }}>
                <div style={{ fontFamily:SR, fontSize:12, fontWeight:700, color:"#6366f1", minWidth:26, letterSpacing:"0.05em" }}>{item.n}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:"#111827", fontFamily:SS }}>{item.t}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:SS }}>{item.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RotatingFact />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Destination Revealed — atmospheric, NO fees, NO doc counts
// ─────────────────────────────────────────────────────────────────────────────
function DestinationRevealed({ selection }: { selection: Selection }) {
  const d = COUNTRY_DATA[selection.country ?? ""] ?? DEFAULT_COUNTRY;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, [selection.country]);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", animation:"panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Dark cinematic hero */}
      <div style={{
        background:`linear-gradient(150deg,${d.color1} 0%,${d.color2} 100%)`,
        padding:"30px 26px 26px", position:"relative", overflow:"hidden", flexShrink:0,
        opacity:mounted?1:0, transition:"opacity 500ms ease",
      }}>
        <div style={{ position:"absolute", right:-20, top:-20, fontSize:120, opacity:0.07, lineHeight:1, userSelect:"none", filter:"blur(1px)" }}>{d.flag}</div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${d.accentColor}55,transparent)` }} />
        <div style={{ position:"relative" }}>
          <div className="chip" style={{ background:`${d.accentColor}20`, color:d.accentColor, border:`1px solid ${d.accentColor}40`, marginBottom:14, fontFamily:SS }}>
            <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill={d.accentColor} style={{ animation:"dotPulse 2s ease-in-out infinite" }} /></svg>
            Destination selected
          </div>
          <div style={{ fontSize:52, marginBottom:10, lineHeight:1, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{d.flag}</div>
          <div style={{ fontSize:24, fontWeight:700, color:"#fff", letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:7, fontFamily:SR }}>
            {selection.countryName}
          </div>
          <div style={{ fontSize:13, color:`${d.accentColor}cc`, fontStyle:"italic", fontFamily:SR, lineHeight:1.3 }}>
            "{d.tagline}"
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex:1, overflowY:"auto", padding:"20px 20px 36px", background:"#F8F6F1",
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(10px)",
        transition:"all 500ms ease 120ms",
      }}>
        {/* Atmospheric quote */}
        <div className="panel-card" style={{ padding:"18px 20px", marginBottom:16, borderLeft:`3px solid ${d.accentColor}` }}>
          <div style={{ fontSize:13, color:"#374151", lineHeight:1.75, fontStyle:"italic", fontFamily:SR }}>
            {d.atmosphere}
          </div>
        </div>

        {/* Quick facts */}
        <div className="section-lbl">Quick facts</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          {[
            { icon:"🗓️", label:"Best time to visit", value:d.season },
            { icon:"💱", label:"Currency",            value:d.currency },
            { icon:"🗣️", label:"Language",            value:d.language },
            { icon:"📌", label:"Good to know",        value:d.highlight },
          ].map(item => (
            <div key={item.label} className="panel-card" style={{ padding:"14px 14px" }}>
              <div style={{ fontSize:18, marginBottom:7 }}>{item.icon}</div>
              <div style={{ fontSize:11.5, fontWeight:600, color:"#0f172a", lineHeight:1.4, fontFamily:SS }}>{item.value}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:3, fontFamily:SS }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Next step nudge */}
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius:14, padding:"16px 18px",
          display:"flex", alignItems:"center", gap:14, boxShadow:"0 4px 20px rgba(0,0,0,0.12)" }}>
          <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
            background:`${d.accentColor}20`, border:`1.5px solid ${d.accentColor}40`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📄</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:SS }}>Next: Select your visa type</div>
            <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.42)", marginTop:2, fontFamily:SS }}>
              Tourist, work, student & more — each has its own requirements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Journey Arc — visa type selected, what does this journey look like?
// ─────────────────────────────────────────────────────────────────────────────
function JourneyArc({ selection }: { selection: Selection }) {
  const d = COUNTRY_DATA[selection.country ?? ""]  ?? DEFAULT_COUNTRY;
  const v = VISA_PERSONA[selection.visaType ?? ""] ?? DEFAULT_VISA;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, [selection.visaType]);

  const arcSteps = v.journeyArc.split("→").map(s => s.trim());

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", animation:"panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Hero */}
      <div style={{
        background:`linear-gradient(150deg,${d.color1} 0%,${d.color2} 65%,${v.color}18 100%)`,
        padding:"26px 26px 24px", position:"relative", overflow:"hidden", flexShrink:0,
        opacity:mounted?1:0, transition:"opacity 450ms ease",
      }}>
        <div style={{ position:"absolute", right:-15, top:-15, fontSize:100, opacity:0.07, userSelect:"none" }}>{d.flag}</div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${v.color}45,transparent)` }} />
        <div style={{ position:"relative" }}>
          <div className="chip" style={{ background:`${v.color}20`, color:v.color, border:`1px solid ${v.color}40`, marginBottom:14, fontFamily:SS }}>
            <span>{v.icon}</span>{v.label} Visa — journey mapped
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:12 }}>
            <div style={{ fontSize:40, lineHeight:1 }}>{d.flag}</div>
            <div>
              <div style={{ fontSize:19, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1, fontFamily:SR }}>{selection.countryName}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.48)", marginTop:2, fontFamily:SS }}>{v.label} Visa · {v.stayDuration}</div>
            </div>
          </div>
          <div className="chip" style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.12)", fontFamily:SS }}>
            {v.entryNote}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex:1, overflowY:"auto", padding:"20px 20px 36px", background:"#F8F6F1",
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(10px)",
        transition:"all 500ms ease 120ms",
      }}>
        {/* Journey arc */}
        <div className="section-lbl">Your journey arc</div>
        <div className="panel-card" style={{ padding:"20px 20px", marginBottom:16 }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:4, top:18, bottom:18, width:2,
              background:`linear-gradient(180deg,${v.color}70,${v.color}15)` }} />
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {arcSteps.map((step, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, animation:`cardSlideIn 350ms ease ${i*100}ms both` }}>
                  <div style={{
                    width:10, height:10, borderRadius:"50%", flexShrink:0, marginTop:4,
                    border:`2.5px solid ${i===0 ? v.color : i===arcSteps.length-1 ? "#22c55e" : `${v.color}50`}`,
                    background:i===0 ? v.color : i===arcSteps.length-1 ? "#22c55e" : "transparent",
                    zIndex:1,
                    boxShadow:i===0?`0 0 12px ${v.color}60`:"none",
                  }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#111827", fontFamily:SS }}>{step}</div>
                    {i===0 && <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:SS }}>Your journey begins here</div>}
                    {i===arcSteps.length-1 && <div style={{ fontSize:11, color:"#22c55e", marginTop:2, fontFamily:SS }}>Journey complete</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What this visa allows */}
        <div className="section-lbl">What this visa allows</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          {[
            { icon:"📅", label:"Max stay",         value:v.stayDuration },
            { icon:"🔄", label:"Entry type",        value:v.entryNote },
            { icon:"⏱️", label:"Typical processing", value:`${d.processingDays[0]}–${d.processingDays[1]} days` },
            { icon:"📍", label:"Apply from",        value:selection.location ?? "Your city →" },
          ].map(item => (
            <div key={item.label} className="panel-card" style={{ padding:"13px 14px" }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{item.icon}</div>
              <div style={{ fontSize:11.5, fontWeight:600, color:"#0f172a", lineHeight:1.3, fontFamily:SS }}>{item.value}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:3, fontFamily:SS }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Nudge */}
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius:14, padding:"16px 18px",
          display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:`${v.color}20`,
            border:`1.5px solid ${v.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📍</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:SS }}>Next: Where will you apply from?</div>
            <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.42)", marginTop:2, fontFamily:SS }}>Your city determines the embassy & process</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Application Timeline — the MOST useful thing to show
// "If you start today, here is your exact road to a visa decision"
// ─────────────────────────────────────────────────────────────────────────────
function ApplicationTimeline({ selection }: { selection: Selection }) {
  const d = COUNTRY_DATA[selection.country ?? ""]  ?? DEFAULT_COUNTRY;
  const v = VISA_PERSONA[selection.visaType ?? ""] ?? DEFAULT_VISA;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  // Build timeline from today
  const today  = new Date();
  const addDays = (base: Date, n: number) => { const r = new Date(base); r.setDate(r.getDate()+n); return r; };
  const fmt     = (dt: Date) => dt.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  const t1 = today;
  const t2 = addDays(today, 7);
  const t3 = addDays(today, 14);
  const t4 = addDays(today, 14 + d.processingDays[0]);
  const t5 = addDays(today, 14 + d.processingDays[1]);

  const milestones = [
    { date:t1, label:"Start today",          sub:"Begin collecting your documents",              icon:"🚀", color:v.color,    isToday:true },
    { date:t2, label:"Documents ready",      sub:"All paperwork collected & organised",          icon:"📁", color:"#f59e0b",  isToday:false },
    { date:t3, label:"Submit application",   sub:"Hand in at embassy or VFS centre",             icon:"📬", color:"#6366f1",  isToday:false },
    { date:t4, label:"Processing begins",    sub:`Earliest decision from ${fmt(t4)}`,            icon:"⚙️", color:"#0ea5e9",  isToday:false },
    { date:t5, label:"Decision expected",    sub:"Most applications decided by this date",        icon:"✅", color:"#22c55e",  isToday:false },
  ];

  const totalDays = 14 + d.processingDays[1];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", animation:"panelFadeUp 400ms ease both" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Hero */}
      <div style={{
        background:`linear-gradient(150deg,${d.color1} 0%,${d.color2} 100%)`,
        padding:"26px 26px 24px", position:"relative", overflow:"hidden", flexShrink:0,
        opacity:mounted?1:0, transition:"opacity 450ms ease",
      }}>
        <div style={{ position:"absolute", right:-15, top:-15, fontSize:90, opacity:0.07, userSelect:"none" }}>{d.flag}</div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${d.accentColor}50,transparent)` }} />
        <div style={{ position:"relative" }}>
          <div className="chip" style={{ background:`${d.accentColor}20`, color:d.accentColor, border:`1px solid ${d.accentColor}40`, marginBottom:14, fontFamily:SS }}>
            📅 Your application road map
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:34 }}>{d.flag}</span>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", fontFamily:SR }}>
                {selection.countryName} · {v.label} Visa
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:2, fontFamily:SS }}>
                Applying from {selection.location ?? "your city"}
              </div>
            </div>
          </div>
          {/* Summary banner */}
          <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:10, padding:"11px 14px",
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.38)", fontFamily:SS, marginBottom:2 }}>Start now → Decision by</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:SS }}>
                <span style={{ color:d.accentColor }}>{fmt(t5)}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:30, fontWeight:800, color:d.accentColor, fontFamily:SS, letterSpacing:"-0.03em", lineHeight:1 }}>~{totalDays}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:SS }}>days total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex:1, overflowY:"auto", padding:"20px 20px 36px", background:"#F8F6F1",
        opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(10px)",
        transition:"all 500ms ease 120ms",
      }}>
        <div className="section-lbl">Your step-by-step timeline</div>
        <div className="panel-card" style={{ padding:"20px 20px", marginBottom:16 }}>
          <div style={{ position:"relative" }}>
            {/* Connecting line */}
            <div style={{ position:"absolute", left:19, top:22, bottom:22, width:2,
              background:"linear-gradient(180deg,#6366f1 0%,#10b981 100%)", opacity:0.18 }} />
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display:"flex", gap:14, paddingBottom:i<milestones.length-1?20:0,
                  animation:`cardSlideIn 350ms ease ${i*80}ms both` }}>
                  <div style={{
                    width:40, height:40, borderRadius:"50%", flexShrink:0,
                    background:i===0 ? m.color : `${m.color}14`,
                    border:`2px solid ${m.color}${i===0?"":"40"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:17, zIndex:1,
                    boxShadow:i===0?`0 4px 16px ${m.color}40`:"none",
                  }}>{m.icon}</div>
                  <div style={{ flex:1, paddingTop:5 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:"#111827", fontFamily:SS }}>{m.label}</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:1.5, fontFamily:SS }}>{m.sub}</div>
                    <div style={{ marginTop:5, fontSize:11, color:m.color, fontWeight:600, fontFamily:SS }}>
                      {m.isToday ? "Today" : fmt(m.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro tip */}
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius:14, padding:"16px 18px",
          marginBottom:14, display:"flex", alignItems:"flex-start", gap:12 }}>
          <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>⚡</span>
          <div>
            <div style={{ fontSize:12.5, fontWeight:700, color:"#fff", marginBottom:4, fontFamily:SS }}>Pro tip</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.58)", lineHeight:1.65, fontFamily:SS }}>
              Book your embassy or VFS appointment as soon as your documents are ready — slots fill up fast, especially during peak travel seasons.
            </div>
          </div>
        </div>

        {/* Last step nudge */}
        <div className="panel-card" style={{ padding:"15px 18px", border:`1.5px solid ${d.accentColor}35`,
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background:`${d.accentColor}15`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>👤</div>
          <div>
            <div style={{ fontSize:12.5, fontWeight:700, color:"#111827", fontFamily:SS }}>One last step</div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:2, fontFamily:SS }}>
              Tell us your profile → unlock your personalised document checklist
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function SmartRightPanel({
  selection,
  completedCount,
}: {
  selection: Selection;
  completedCount: number;
}) {
  if (completedCount === 0) return <JourneySpark />;
  if (completedCount === 1) return <DestinationRevealed selection={selection} />;
  if (completedCount === 2) return <JourneyArc selection={selection} />;
  return <ApplicationTimeline selection={selection} completedCount={completedCount} />;
}