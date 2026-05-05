"use client";
// app/page.tsx
import Link from "next/link";

const STEPS = [
  {
    num: "01",
    label: "Pick destination",
    desc: "Choose from 9 countries across Asia, Europe & North America",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    num: "02",
    label: "Select visa type",
    desc: "Tourist, Business, Student, Work or Transit",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    num: "03",
    label: "Add your details",
    desc: "Location, sponsorship & employment profile",
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    num: "04",
    label: "Get your checklist",
    desc: "A personalised, categorised document list — instantly",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
];

const STATS = [
  { value: "9+", label: "Countries covered" },
  { value: "5", label: "Visa types" },
  { value: "2 min", label: "To complete" },
  { value: "Free", label: "No sign-up needed" },
];

export default function HomePage() {
  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: 960, margin: "0 auto",
        padding: "96px 24px 64px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center",
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#eef2ff", border: "1px solid #c7d2fe",
          color: "#6366f1", fontSize: 12, fontWeight: 600,
          padding: "5px 14px", borderRadius: 20, marginBottom: 28,
          letterSpacing: "0.02em",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
          Free · No account required · Takes 2 minutes
        </div>

        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          margin: "0 0 16px",
          maxWidth: 640,
        }}>
          Know exactly which{" "}
          <span style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            visa documents
          </span>{" "}
          you need
        </h1>

        <p style={{
          fontSize: 16, color: "#64748b", lineHeight: 1.65,
          maxWidth: 480, margin: "0 auto 36px",
        }}>
          Answer 4 quick questions. Get a personalised, categorised document checklist for your visa application — no confusion, no guesswork.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Link href="/wizard" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
              transition: "transform 160ms ease, box-shadow 160ms ease",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(99,102,241,0.45)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.35)";
              }}
            >
              Check My Documents
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            No sign-up · Works for Indian applicants
          </span>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{
          maxWidth: 760, margin: "0 auto",
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center",
              padding: "12px 0",
              borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>How it works</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
            Four steps to your checklist
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              background: "#fff",
              border: "1px solid #f1f5f9",
              borderRadius: 16,
              padding: "24px 20px",
              position: "relative",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: step.bg, color: step.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, marginBottom: 16,
                border: `1px solid ${step.color}22`,
              }}>
                {step.num}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                {step.desc}
              </div>

              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute", top: 30, right: -8,
                  width: 16, height: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#d1d5db", zIndex: 1,
                  display: "none", // hidden on mobile; shown via media query ideally
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        maxWidth: 960, margin: "0 auto 64px",
        padding: "0 24px",
      }}>
        <div style={{
          background: "linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)",
          borderRadius: 20,
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }} />
          <div style={{
            position: "absolute", bottom: -60, left: -30,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }} />

          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Ready to start your application?
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 24px" }}>
              Get your personalised checklist in under 2 minutes.
            </p>
            <Link href="/wizard" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "12px 28px",
                background: "#fff",
                color: "#4f46e5",
                border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                transition: "transform 160ms ease",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
              >
                Get My Document Checklist →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}