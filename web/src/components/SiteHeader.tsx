"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Guides", href: "#guides" },
  { label: "Countries", href: "#countries" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isWizard = pathname === "/wizard";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .vm-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-header.scrolled {
          background: rgba(10, 7, 24, 0.86);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          box-shadow: 0 2px 40px rgba(0,0,0,0.4);
        }
        .vm-header.top {
          background: transparent;
          border-bottom: 0.5px solid transparent;
        }

        .vm-inner {
          max-width: 1100px; margin: 0 auto;
          height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
        }

        /* Logo */
        .vm-logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
        }
        .vm-logo-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(108,92,231,0.5), 0 4px 14px rgba(108,92,231,0.35);
          flex-shrink: 0;
          position: relative; overflow: hidden;
        }
        .vm-logo-icon::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          border-radius: inherit;
        }
        .vm-logo-wordmark {
          font-size: 15.5px; font-weight: 600;
          color: rgba(255,255,255,0.93); letter-spacing: -0.025em;
          line-height: 1;
        }
        .vm-logo-wordmark span { color: #a78bfa; }

        /* Pill badge next to logo */
        .vm-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(108,92,231,0.14);
          border: 0.5px solid rgba(108,92,231,0.38);
          border-radius: 20px; padding: 3px 9px 3px 6px;
          font-size: 10.5px; font-weight: 500;
          color: #a89cef; letter-spacing: 0.01em;
          margin-left: 4px;
        }
        .vm-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #6c5ce7;
          box-shadow: 0 0 6px rgba(108,92,231,0.8);
          animation: vm-pulse 2.2s ease-in-out infinite;
        }
        @keyframes vm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }

        /* Nav links */
        .vm-nav { display: flex; align-items: center; gap: 2px; }
        .vm-nav-link {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.48);
          padding: 7px 13px; border-radius: 9px;
          text-decoration: none; letter-spacing: -0.01em;
          transition: color 0.18s ease, background 0.18s ease;
          cursor: pointer;
        }
        .vm-nav-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.06);
        }

        /* Divider */
        .vm-divider {
          width: 1px; height: 18px;
          background: rgba(255,255,255,0.1);
          margin: 0 8px;
        }

        /* CTA button */
        .vm-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 17px;
          background: linear-gradient(135deg, #6c5ce7 0%, #8b7cf6 100%);
          color: #fff;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
          cursor: pointer; text-decoration: none;
          box-shadow: 0 0 0 1px rgba(108,92,231,0.5), 0 3px 14px rgba(108,92,231,0.4);
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .vm-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
        }
        .vm-cta:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 0 0 1px rgba(108,92,231,0.6), 0 6px 22px rgba(108,92,231,0.52);
        }
        .vm-cta:active { transform: translateY(0); }

        .vm-cta.active-page {
          background: rgba(108,92,231,0.14);
          color: #a89cef;
          box-shadow: 0 0 0 0.5px rgba(108,92,231,0.4);
        }
        .vm-cta.active-page::before { display: none; }
        .vm-cta.active-page:hover { transform: none; box-shadow: 0 0 0 0.5px rgba(108,92,231,0.6); }

        /* Mobile hamburger */
        .vm-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; padding: 6px; border: none;
          background: transparent; border-radius: 8px;
        }
        .vm-hamburger span {
          width: 22px; height: 1.5px;
          background: rgba(255,255,255,0.65); border-radius: 2px;
          display: block; transition: all 0.25s ease;
        }

        /* Mobile drawer */
        .vm-drawer {
          position: fixed; top: 62px; left: 0; right: 0;
          background: rgba(10,7,24,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          padding: 16px 28px 24px;
          display: flex; flex-direction: column; gap: 4px;
          transform: translateY(-8px); opacity: 0;
          pointer-events: none;
          transition: transform 0.25s ease, opacity 0.25s ease;
          z-index: 99;
        }
        .vm-drawer.open {
          transform: translateY(0); opacity: 1; pointer-events: auto;
        }
        .vm-drawer-link {
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.55); padding: 11px 0;
          text-decoration: none;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
          transition: color 0.18s;
        }
        .vm-drawer-link:hover { color: rgba(255,255,255,0.9); }
        .vm-drawer-cta {
          margin-top: 12px;
          display: block; text-align: center;
          padding: 12px;
          background: linear-gradient(135deg, #6c5ce7 0%, #8b7cf6 100%);
          color: #fff; text-decoration: none;
          border-radius: 10px; font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 18px rgba(108,92,231,0.45);
        }

        @media (max-width: 720px) {
          .vm-nav { display: none; }
          .vm-divider { display: none; }
          .vm-cta { display: none; }
          .vm-hamburger { display: flex; }
          .vm-badge { display: none; }
        }
      `}</style>

      <header className={`vm-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="vm-inner">
          {/* Logo */}
          <Link href="/" className="vm-logo">
            <div className="vm-logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="vm-logo-wordmark">
              Visa<span>Mate</span>
            </span>
            <span className="vm-badge">
              <span className="vm-badge-dot" />
              AI-powered
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="vm-nav">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="vm-nav-link">{label}</a>
            ))}
            <div className="vm-divider" />
            <Link href="/wizard" className={`vm-cta${isWizard ? " active-page" : ""}`}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12h3.75M9 15h3.75m-7.5 6h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v12A2.25 2.25 0 004.5 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Check Documents
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="vm-hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span style={menuOpen ? { transform: "rotate(45deg) translate(4.5px, 4.5px)" } : {}} />
            <span style={menuOpen ? { opacity: 0 } : {}} />
            <span style={menuOpen ? { transform: "rotate(-45deg) translate(4.5px, -4.5px)" } : {}} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`vm-drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className="vm-drawer-link" onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <Link href="/wizard" className="vm-drawer-cta" onClick={() => setMenuOpen(false)}>
          Check Documents
        </Link>
      </div>
    </>
  );
}