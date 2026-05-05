"use client";

// app/documents/page.tsx
import Link from "next/link";

const DOCUMENT_CATEGORIES = [
  {
    label: "Common Documents",
    count: 3,
    color: "#6366f1",
    bg: "#eef2ff",
    items: ["Passport (6 months validity)", "Visa Application Form", "Passport-size Photograph"],
  },
  {
    label: "Financial Documents",
    count: 2,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    items: ["Bank Statement (last 6 months)", "Income Tax Returns (last 2 years)"],
  },
  {
    label: "Personal Documents",
    count: 2,
    color: "#10b981",
    bg: "#f0fdf4",
    items: ["Employment Letter / Leave Approval", "Hotel & Flight Bookings"],
  },
  {
    label: "Travel Documents",
    count: 1,
    color: "#f59e0b",
    bg: "#fffbeb",
    items: ["Travel Itinerary"],
  },
];

export default function DocumentsPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        background: "#f3f4f6",
        paddingTop: 80,
        paddingBottom: 80,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 580, width: "100%", padding: "0 16px" }}>
        {/* Top badge */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{
            display: "inline-block",
            background: "#fef3c7",
            color: "#d97706",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "4px 14px",
            borderRadius: 20,
            marginBottom: 16,
            textTransform: "uppercase",
          }}>
            Coming Soon
          </span>

          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 6px 20px rgba(99,102,241,0.28)",
          }}>
            <svg width="26" height="26" fill="none" stroke="white" strokeWidth={1.7} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            Your Document Checklist
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 auto", maxWidth: 380, lineHeight: 1.6 }}>
            We're building this feature. Soon you'll get a personalised document checklist with status tracking, templates, and guidelines for each document.
          </p>
        </div>

        {/* Preview card */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1.5px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          marginBottom: 16,
        }}>
          {/* Mock progress bar */}
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Document Progress</span>
              <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>3 / 8 ready</span>
            </div>
            <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "37.5%",
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                borderRadius: 3,
              }} />
            </div>
          </div>

          {/* Categories */}
          {DOCUMENT_CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              style={{
                padding: "14px 20px",
                borderBottom: i < DOCUMENT_CATEGORIES.length - 1 ? "1px solid #f9fafb" : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: cat.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" fill="none" stroke={cat.color} strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cat.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: cat.color,
                    background: cat.bg, padding: "2px 8px", borderRadius: 20,
                  }}>{cat.count} docs</span>
                </div>
                {cat.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/wizard" style={{ flex: 1 }}>
            <button style={{
              width: "100%", padding: "12px 0",
              background: "#fff", color: "#374151",
              border: "1.5px solid #e5e7eb", borderRadius: 12,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "border-color 160ms ease, background 160ms ease",
            }}>
              ← Edit Selections
            </button>
          </Link>
          <Link href="/" style={{ flex: 1 }}>
            <button style={{
              width: "100%", padding: "12px 0",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              transition: "transform 160ms ease",
            }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}