"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

const FOOTER_LINKS = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Countries covered", href: "#countries" },
    { label: "Visa guides", href: "#guides" },
    { label: "Check documents", href: "/wizard" },
  ],
  Resources: [
    { label: "Embassy directory", href: "#" },
    { label: "Travel advisories", href: "#" },
    { label: "Document templates", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Disclaimer", href: "#" },
  ],
};

const TRUST_BADGES = [
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Embassy-verified data",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Updated May 2026",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "AI-powered intelligence",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "190+ countries",
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ fontFamily: "'DM Sans', sans-serif", background: "#070514", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .vm-footer-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 60px 28px 0;
        }
        .vm-footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 52px;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }

        .vm-footer-logo-link {
          text-decoration: none; margin-bottom: 16px; display: inline-block;
        }
        .vm-footer-tagline {
          font-size: 13px; line-height: 1.7;
          color: rgba(255,255,255,0.32); max-width: 240px; margin: 0 0 24px;
        }

        .vm-footer-trust {
          display: flex; flex-direction: column; gap: 10px;
        }
        .vm-footer-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: rgba(255,255,255,0.4);
        }
        .vm-footer-trust-item svg { color: #6c5ce7; flex-shrink: 0; }

        .vm-footer-col-title {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .vm-footer-col-links {
          display: flex; flex-direction: column; gap: 11px;
        }
        .vm-footer-col-link {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.42);
          text-decoration: none; letter-spacing: -0.01em;
          transition: color 0.18s ease;
        }
        .vm-footer-col-link:hover { color: rgba(255,255,255,0.82); }

        .vm-footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0 28px; gap: 16px; flex-wrap: wrap;
        }
        .vm-footer-copy {
          font-size: 12px; color: rgba(255,255,255,0.2);
          letter-spacing: -0.01em;
        }
        .vm-footer-disclaimer {
          font-size: 11.5px; color: rgba(255,255,255,0.18);
          max-width: 480px; text-align: right; line-height: 1.5;
        }

        @media (max-width: 800px) {
          .vm-footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .vm-footer-brand { grid-column: 1 / -1; }
          .vm-footer-tagline { max-width: 100%; }
          .vm-footer-trust { flex-direction: row; flex-wrap: wrap; gap: 14px; }
          .vm-footer-disclaimer { text-align: left; max-width: 100%; }
        }
        @media (max-width: 480px) {
          .vm-footer-top { grid-template-columns: 1fr; }
          .vm-footer-inner { padding: 40px 20px 0; }
        }
      `}</style>

      <div className="vm-footer-inner">
        <div className="vm-footer-top">
          {/* Brand column */}
          <div className="vm-footer-brand">
            <Link href="/" className="vm-footer-logo-link">
              <Logo size="sm" />
            </Link>
            <p className="vm-footer-tagline">
              Personalised visa document checklists, powered by official embassy data and AI.
            </p>
            <div className="vm-footer-trust">
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="vm-footer-trust-item">
                  {b.icon}
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="vm-footer-col-title">{title}</p>
              <div className="vm-footer-col-links">
                {links.map((link) => (
                  <a key={link.label} href={link.href} className="vm-footer-col-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="vm-footer-bottom">
          <span className="vm-footer-copy">
            © {new Date().getFullYear()} VisaMate. All rights reserved.
          </span>
          <p className="vm-footer-disclaimer">
            VisaMate is not legal advice. Always verify requirements with official embassy or consulate sources before applying.
          </p>
        </div>
      </div>
    </footer>
  );
}