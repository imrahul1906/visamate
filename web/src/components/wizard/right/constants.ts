// ─── Constants & Shared Data ──────────────────────────────────────────────────

// Font shorthands
export const SS = "system-ui, -apple-system, sans-serif";
export const SR = "'Georgia', 'Times New Roman', serif";

// ─── Global styles ────────────────────────────────────────────────────────────
export const GLOBAL_STYLES = `
  @keyframes panelFadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes twinkleStar   { from { opacity:0.1 } to { opacity:0.8 } }
  @keyframes pulseRing     { 0%,100% { opacity:0.15; transform:scale(1) } 50% { opacity:0.45; transform:scale(1.04) } }
  @keyframes cardSlideIn   { from { opacity:0; transform:translateX(-10px) } to { opacity:1; transform:translateX(0) } }
  @keyframes dotPulse      { 0%,100% { transform:scale(1) } 50% { transform:scale(1.3) } }
  .panel-card  { background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
  .chip        { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.01em; }
  .section-lbl { font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; margin-bottom:10px; font-family:system-ui,sans-serif; }
`;

// ─── Country atmosphere data — NO fees, NO doc counts ────────────────────────
export const COUNTRY_DATA: Record<string, {
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

export const DEFAULT_COUNTRY = {
  flag:"🌍", tagline:"Your Next Chapter Awaits",
  atmosphere:"Every destination has a story waiting to be written. You're about to start yours.",
  highlight:"Applying well in advance dramatically improves approval odds",
  season:"Varies by destination", currency:"Check locally", language:"Check locally",
  processingDays:[7,30] as [number,number],
  color1:"#0d1525", color2:"#1a2540", accentColor:"#6366f1",
};

// ─── Visa persona data ────────────────────────────────────────────────────────
export const VISA_PERSONA: Record<string, {
  icon: string; label: string; stayDuration: string;
  journeyArc: string; color: string; entryNote: string;
}> = {
  tourist:  { icon:"✈️",  label:"Tourist",  stayDuration:"Up to 90 days",        journeyArc:"Explore → Discover → Absorb → Return", color:"#0ea5e9", entryNote:"Single or multiple entry" },
  student:  { icon:"🎓",  label:"Student",  stayDuration:"Duration of course",    journeyArc:"Arrive → Study → Graduate → Explore options", color:"#8b5cf6", entryNote:"Long-stay with renewals" },
  work:     { icon:"💼",  label:"Work",     stayDuration:"Duration of contract",  journeyArc:"Arrive → Work → Establish → Extend",   color:"#10b981", entryNote:"Employer-tied, renewable" },
  business: { icon:"🏢",  label:"Business", stayDuration:"Up to 30–90 days",      journeyArc:"Meet → Negotiate → Conclude → Return",  color:"#f59e0b", entryNote:"Multiple entry standard" },
};

export const DEFAULT_VISA = {
  icon:"📄", label:"Visa", stayDuration:"Varies",
  journeyArc:"Apply → Travel → Enjoy → Return",
  color:"#6366f1", entryNote:"Entry conditions apply",
};

// ─── Inspiration cards ────────────────────────────────────────────────────────
export const INSPIRE_CARDS = [
  { flag:"🇯🇵", country:"Japan",          mood:"Cherry blossoms · Ramen lanes · Zen",         color1:"#1a0808", color2:"#3d1515" },
  { flag:"🇮🇹", country:"Italy",          mood:"Renaissance art · Coastal cliffs · Espresso", color1:"#1a0f05", color2:"#3d2010" },
  { flag:"🇨🇦", country:"Canada",         mood:"Northern lights · Maple forests · Hockey",    color1:"#0f1e0f", color2:"#1a3020" },
  { flag:"🇬🇧", country:"United Kingdom", mood:"Big Ben · Rolling moors · Afternoon tea",     color1:"#0d1b2a", color2:"#1a3050" },
  { flag:"🇦🇺", country:"Australia",      mood:"Great Barrier Reef · Uluru · Surf",           color1:"#1a0f05", color2:"#2d1a0a" },
  { flag:"🇩🇪", country:"Germany",        mood:"Baroque castles · Craft beer · Black Forest",  color1:"#111111", color2:"#2a2a2a" },
];

// ─── Rotating "did you know" facts ────────────────────────────────────────────
export const FACTS = [
  { e:"📅", t:"Applying 8–12 weeks early is the safest window for most international visas." },
  { e:"📋", t:"Most rejections happen due to incomplete documents — not the applicant's profile." },
  { e:"🔒", t:"Showing strong home-country ties significantly boosts tourist visa approval odds." },
  { e:"🌐", t:"One Schengen visa unlocks 27 European countries — one application, endless travel." },
  { e:"🏦", t:"Bank statements are the single most scrutinised financial document in any application." },
];