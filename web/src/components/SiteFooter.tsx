"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

// ─── FAQ Static Data ───
const FAQ_ITEMS = [
  {
    q: "How is my privacy protected?",
    a: "VisaMate operates strictly on a Zero Server Storage model. All document uploads, form inputs, and checklist checkmarks remain entirely in your browser's local sandbox memory (localStorage). Nothing is ever sent to or stored on our servers, ensuring 100% data confidentiality."
  },
  {
    q: "Where does the visa checklist data come from?",
    a: "Our checklists are compiled and cross-referenced from official consulate websites, embassy circulars, and verified visa center (like VFS Global) regulations. These details are reviewed monthly by travel specialists (Sync: May 2026)."
  },
  {
    q: "Which countries are currently supported?",
    a: "We fully support Japan tourist visa applications from India (covering center centers: Delhi, Mumbai, Bengaluru, Chennai, Kolkata). South Korea, Schengen Area, and United States visa builders are currently in development."
  }
];

export default function SiteFooter() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeLegal, setActiveLegal] = useState<"privacy" | "terms" | "disclaimer" | null>(null);
  const [lastLegal, setLastLegal] = useState<"privacy" | "terms" | "disclaimer">("privacy");

  const handleLegalToggle = (type: "privacy" | "terms" | "disclaimer") => {
    if (activeLegal === type) {
      setActiveLegal(null);
    } else {
      setActiveLegal(type);
      setLastLegal(type);
      setTimeout(() => {
        const el = document.getElementById("vm-legal-drawer");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 320);
    }
  };

  return (
    <footer style={{
      fontFamily: "'DM Sans', var(--font-dm-sans), sans-serif",
      background: "var(--vm-surface2)",
      borderTop: "1px solid var(--vm-border)"
    }}>
      <style>{`
        .vm-footer-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 52px 24px 28px;
        }

        .vm-footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 56px;
          padding-bottom: 36px;
        }
        
        /* Column 1: Brand & Description */
        .vm-footer-logo-link {
          text-decoration: none; margin-bottom: 16px; display: inline-block;
        }
        .vm-footer-tagline {
          font-size: 13px; line-height: 1.65;
          color: var(--vm-trans-white-45); max-width: 280px; margin: 0;
        }
        
        /* Column 2: Accordion FAQs */
        .vm-footer-col-title {
          font-size: 11px; font-weight: 700;
          color: var(--vm-trans-white-35);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 18px;
        }
        .vm-faq-accordion {
          display: flex; flex-direction: column; gap: 10px;
        }
        .vm-faq-card {
          border-bottom: 1px solid var(--vm-trans-white-05);
          padding-bottom: 8px;
        }
        .vm-faq-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          background: transparent; border: none; padding: 4px 0;
          text-align: left; font-size: 13px; font-weight: 600;
          color: var(--vm-trans-white-65); cursor: pointer;
          transition: color 0.2s;
        }
        .vm-faq-trigger:hover { color: var(--vm-text); }
        .vm-faq-trigger svg {
          color: var(--vm-trans-white-25);
          transition: transform 0.25s ease;
        }
        .vm-faq-trigger.active svg {
          transform: rotate(180deg);
          color: var(--vm-purple-light);
        }
        
        /* CSS Grid Height animation wrapper */
        .vm-faq-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease-in-out;
        }
        .vm-faq-wrapper.active {
          grid-template-rows: 1fr;
        }
        .vm-faq-answer {
          overflow: hidden;
          min-height: 0;
          font-size: 12px; line-height: 1.6;
          color: var(--vm-trans-white-45);
          opacity: 0;
          padding-top: 8px;
          transition: opacity 0.2s ease;
        }
        .vm-faq-wrapper.active .vm-faq-answer {
          opacity: 1;
        }

        /* Column 3: Contact & Support */
        .vm-support-card {
          background: var(--vm-trans-white-02);
          border: 1px solid var(--vm-trans-white-05);
          border-radius: 12px; padding: 16px;
        }
        .vm-support-title {
          font-size: 12.5px; font-weight: 700; color: var(--vm-text); margin-bottom: 6px;
        }
        .vm-support-desc {
          font-size: 11.5px; color: var(--vm-trans-white-45); line-height: 1.6; margin-bottom: 10px;
        }
        .vm-support-email {
          display: inline-block; font-size: 12.5px; font-weight: 600;
          color: var(--vm-purple-light); text-decoration: none; transition: color 0.2s;
        }
        .vm-support-email:hover { color: var(--vm-indigo-light); }

        /* Inline Legal Drawer Styles */
        .vm-legal-drawer {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease-in-out;
        }
        .vm-legal-drawer.active {
          grid-template-rows: 1fr;
        }
        .vm-legal-drawer-content {
          overflow: hidden;
          min-height: 0;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--vm-trans-white-06);
        }
        .vm-legal-card {
          background: var(--vm-trans-white-02);
          border: 1px solid var(--vm-trans-white-06);
          border-radius: 12px; padding: 24px;
        }
        .vm-legal-header {
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--vm-trans-white-05);
          padding-bottom: 12px; margin-bottom: 14px;
        }
        .vm-legal-title {
          font-size: 15px; font-weight: 600; color: var(--vm-text); margin: 0;
        }
        .vm-legal-close {
          background: transparent; border: none; color: var(--vm-trans-white-45);
          font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s;
        }
        .vm-legal-close:hover { color: var(--vm-text); }
        
        .vm-legal-scrollable {
          max-height: 200px; overflow-y: auto; padding-right: 8px;
          font-size: 12.5px; color: var(--vm-trans-white-45); line-height: 1.6;
        }
        .vm-legal-scrollable::-webkit-scrollbar { width: 4px; }
        .vm-legal-scrollable::-webkit-scrollbar-thumb { background: var(--vm-scrollbar-thumb); border-radius: 2px; }
        .vm-legal-scrollable h4 {
          color: var(--vm-text); font-weight: 600; font-size: 13.5px; margin: 12px 0 4px;
        }
        .vm-legal-scrollable p { margin-bottom: 8px; }

        /* Bottom Bar */
        .vm-footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 20px; gap: 16px; flex-wrap: wrap;
          border-top: 1px solid var(--vm-trans-white-05);
        }
        .vm-footer-copy {
          font-size: 12px; color: var(--vm-trans-white-35);
          letter-spacing: -0.01em;
        }
        .vm-footer-bottom-links {
          display: flex; align-items: center; gap: 20px;
        }
        .vm-bottom-link {
          font-size: 12px; color: var(--vm-trans-white-35);
          background: transparent; border: none; cursor: pointer; padding: 0;
          transition: color 0.18s;
        }
        .vm-bottom-link:hover { color: var(--vm-trans-white-65); }

        @media (max-width: 860px) {
          .vm-footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>

      <div className="vm-footer-inner">
        {/* 3-Column Content Grid */}
        <div className="vm-footer-grid">
          {/* Col 1: Brand details & description */}
          <div>
            <Link href="/" className="vm-footer-logo-link">
              <Logo size="sm" showBadge={false} />
            </Link>
            <p className="vm-footer-tagline">
              Embassy-sourced visa document requirements checklists and template formats. Generated privately within your browser client.
            </p>
          </div>

          {/* Col 2: CSS Grid Animated FAQ Accordion */}
          <div>
            <p className="vm-footer-col-title">FAQ & Help</p>
            <div id="vm-faq-accordion" className="vm-faq-accordion">
              {FAQ_ITEMS.map((item, idx) => {
                const isActive = expandedFaq === idx;
                return (
                  <div key={idx} className="vm-faq-card">
                    <button
                      className={`vm-faq-trigger ${isActive ? "active" : ""}`}
                      onClick={() => setExpandedFaq(isActive ? null : idx)}
                    >
                      <span>{item.q}</span>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div className={`vm-faq-wrapper ${isActive ? "active" : ""}`}>
                      <div className="vm-faq-answer">
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Support Details */}
          <div>
            <p className="vm-footer-col-title">Support</p>
            <div className="vm-support-card">
              <h4 className="vm-support-title">Need Help?</h4>
              <p className="vm-support-desc">
                For questions regarding document checklists, VFS operating hours, or data corrections, reach out to our team.
              </p>
              <a href="mailto:support@visamate.ai" className="vm-support-email">
                support@visamate.ai
              </a>
            </div>
          </div>
        </div>

        {/* Inline Legal Disclosure Drawer */}
        <div id="vm-legal-drawer" className={`vm-legal-drawer ${activeLegal ? "active" : ""}`}>
          <div className="vm-legal-drawer-content">
            <div className="vm-legal-card" style={{ opacity: activeLegal ? 1 : 0, transition: "opacity 0.35s ease-in-out" }}>
              <div className="vm-legal-header">
                <h3 className="vm-legal-title">
                  {lastLegal === "privacy" ? "Privacy Policy" : lastLegal === "terms" ? "Terms of Service" : "Disclaimer"}
                </h3>
                <button className="vm-legal-close" onClick={() => setActiveLegal(null)}>
                  Dismiss [x]
                </button>
              </div>
              
              <div className="vm-legal-scrollable">
                {lastLegal === "privacy" && (
                  <>
                    <p>VisaMate is committed to protecting applicant confidentiality. We operate under a strict, self-contained architecture:</p>
                    <h4>1. Zero Database Storage</h4>
                    <p>Your passport details, application names, travel itineraries, and visa forms are processed entirely inside your local browser runtime. They are stored within the standard `localStorage` sandbox of your browser client and are never uploaded to our servers.</p>
                    <h4>2. Clean Session Policy</h4>
                    <p>You can instantly delete all files and checklist selections by clicking the &ldquo;Start fresh&rdquo; button in the header navigation or by clearing your browser cache. Once cleared, the data is gone forever and cannot be recovered.</p>
                    <h4>3. Template Generation Safety</h4>
                    <p>Auto-generated documents (such as travel cover letters or sponsorship forms) are compiled using local Javascript logic. No file templates are cached on server databases.</p>
                  </>
                )}
                {lastLegal === "terms" && (
                  <>
                    <p>Welcome to VisaMate. By utilizing our checklist tools, you agree to these operational terms:</p>
                    <h4>1. Informational Service Only</h4>
                    <p>VisaMate provides document requirements checklists and auto-fill formatting helpers. The service is provided &ldquo;as is&rdquo;. We do not guarantee visa approval, and our templates are not substitutes for legal travel advice.</p>
                    <h4>2. Verify Embassy Circulars</h4>
                    <p>Embassy regulations, passport collection hours, and visa fees fluctuate constantly. Users are strictly responsible for cross-referencing final checklists with the official embassy before booking flights or submitting applications.</p>
                    <h4>3. Data Retention Limitation</h4>
                    <p>Since we do not store customer records, we cannot retrieve lost checklists or templates. It is the user&apos;s responsibility to download generated PDFs before closing their browser session.</p>
                  </>
                )}
                {lastLegal === "disclaimer" && (
                  <>
                    <p>Please read this disclaimer carefully before using VisaMate:</p>
                    <h4>1. Independence from Government Bodies</h4>
                    <p>VisaMate is an independent visa checklist and intelligence tool. We are **not affiliated, associated, authorized, endorsed by, or in any way officially connected** with VFS Global, BLS, any embassy, consulate, or governmental immigration authority.</p>
                    <h4>2. Accuracy of Embassy Rules</h4>
                    <p>While our database compiles requirements using official sources, embassy officers retain absolute discretion to ask for supplementary documents that may not be standard. Always confirm final submittal requirements directly at your VFS/Embassy center.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal anchors */}
        <div className="vm-footer-bottom">
          <span className="vm-footer-copy">
            © {new Date().getFullYear()} VisaMate. All rights reserved.
          </span>
          
          <div className="vm-footer-bottom-links">
            <button className="vm-bottom-link" onClick={() => handleLegalToggle("privacy")}>Privacy Policy</button>
            <button className="vm-bottom-link" onClick={() => handleLegalToggle("terms")}>Terms of Service</button>
            <button className="vm-bottom-link" onClick={() => handleLegalToggle("disclaimer")}>Disclaimer</button>
          </div>
        </div>
      </div>
    </footer>
  );
}