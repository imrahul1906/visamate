"use client";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{
      borderTop: "1px solid #f3f4f6",
      background: "#fff",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" fill="none" stroke="white" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
            Visa<span style={{ color: "#6366f1" }}>Mate</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["Privacy", "Terms", "How it works", "Guides"].map((label, i) => (
            <a
              key={label}
              href="#"
              style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none", transition: "color 150ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#6366f1")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "#d1d5db", textAlign: "center", margin: 0, maxWidth: 440 }}>
          VisaMate is not legal advice. Always verify requirements with official embassy or consulate sources before applying.
        </p>
      </div>
    </footer>
  );
}
