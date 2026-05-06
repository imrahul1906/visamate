"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(229,231,235,0.8)",
      boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            flexShrink: 0,
          }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", letterSpacing: "-0.01em" }}>
            Visa<span style={{ color: "#6366f1" }}>Mate</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { label: "How it works", href: "#" },
            { label: "Guides", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 13, color: "#6b7280", fontWeight: 500,
                padding: "6px 12px", borderRadius: 8,
                textDecoration: "none",
                transition: "background 150ms ease, color 150ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLAnchorElement).style.color = "#1f2937"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
            >
              {label}
            </a>
          ))}

          <Link href="/wizard" style={{ textDecoration: "none" }}>
            <button style={{
              marginLeft: 8,
              padding: "7px 16px",
              background: pathname === "/wizard" ? "#eef2ff" : "linear-gradient(135deg,#6366f1,#4f46e5)",
              color: pathname === "/wizard" ? "#6366f1" : "#fff",
              border: pathname === "/wizard" ? "1px solid #c7d2fe" : "none",
              borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "transform 150ms ease, box-shadow 150ms ease",
              boxShadow: pathname === "/wizard" ? "none" : "0 2px 8px rgba(99,102,241,0.28)",
            }}
              onMouseEnter={e => {
                if (pathname !== "/wizard") {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(99,102,241,0.38)";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = pathname === "/wizard" ? "none" : "0 2px 8px rgba(99,102,241,0.28)";
              }}
            >
              Check Documents
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
