"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

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

        .vm-header-logo { text-decoration: none; }

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

        .vm-divider {
          width: 1px; height: 18px;
          background: rgba(255,255,255,0.1);
          margin: 0 8px;
        }

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
          .vm-header-cta { display: none; }
          .vm-hamburger { display: flex; }
        }
      `}</style>

      <header className={`vm-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="vm-inner">
          <Link href="/" className="vm-header-logo">
            <Logo size="md" showBadge />
          </Link>

          <nav className="vm-nav">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="vm-nav-link">{label}</a>
            ))}
            <div className="vm-divider" />
            <Button
              href="/wizard"
              variant={isWizard ? "ghost" : "primary"}
              className="vm-header-cta"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 12h3.75M9 15h3.75m-7.5 6h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v12A2.25 2.25 0 004.5 21z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              Check Documents
            </Button>
          </nav>

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